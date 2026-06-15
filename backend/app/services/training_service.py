from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.engines import (
    ACWREngine,
    MonotonyEngine,
    TrainingCapacityEngine,
    TrainingRiskEngine,
    DailyRecommendationEngine
)
from app.crud.activity import (
    get_daily_tss_for_acwr,
    get_daily_state,
    get_recent_daily_states
)
from app.crud import upsert_daily_state, upsert_daily_recommendation
from app.schemas.training import (
    TrainingCapacity,
    TrainingRisk,
    WorkoutRecommendation,
    ExplanationItem,
    ProfessionalDetail,
    DailyDataResponse,
    HistoryDataPoint,
    WeeklyReviewResponse,
    RiskFactor
)
from app.schemas.common import CapacityStatus, RiskLevel


class TrainingDataService:
    """训练数据服务 - 整合所有计算引擎生成完整的训练数据"""

    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _get_data_quality_text(data_quality: str) -> str:
        quality_map = {
            "high": "高 - 数据充足，建议可信度高",
            "medium": "中 - 数据较完整，建议基本可信",
            "low": "低 - 数据不足，建议偏保守",
            "insufficient": "不足 - 缺乏足够历史数据",
        }
        return quality_map.get(data_quality, "数据质量未知")

    def generate_today_data(self, user_id: int) -> DailyDataResponse:
        """生成今日完整训练数据 - 基于真实同步的健康数据"""
        today = date.today()

        # 获取历史训练数据用于计算
        daily_tss = get_daily_tss_for_acwr(self.db, user_id, days=28)

        # 计算 ACWR
        acwr_result = ACWREngine.calculate(daily_tss)
        acwr_value = acwr_result.acwr or 1.0

        # 计算 Monotony
        monotony_result = MonotonyEngine.calculate(daily_tss[:7])
        monotony_value = monotony_result.monotony or 1.5

        # 获取今日真实健康数据
        today_state = get_daily_state(self.db, user_id, today)
        if not today_state:
            # 如果没有今日数据，尝试获取最近 7 天内有数据的那一天
            states = get_recent_daily_states(self.db, user_id, days=7)
            today_state = states[0] if states else None

        # 从数据库读取真实数据（用户手动录入优先，否则使用默认值）
        sleep_score = getattr(today_state, 'sleep_score', None) if today_state else None
        sleep_quality = getattr(today_state, 'sleep_quality', None) if today_state else None
        hrv_score = getattr(today_state, 'hrv_score', None) if today_state else None
        subjective_fatigue = getattr(today_state, 'subjective_fatigue', None) if today_state else None
        muscle_soreness = getattr(today_state, 'muscle_soreness', None) if today_state else None
        stress_level = getattr(today_state, 'stress_level', None) if today_state else None
        mood = getattr(today_state, 'mood', None) if today_state else None
        form_value = getattr(today_state, 'form', 0) if today_state else 0

        # 用户手动评分（1-10）转换为训练分数（0-100）
        # 低数值 = 差（低分），高数值 = 好（高分）
        def scale_score(value):
            return value * 10 if value else None

        # 使用用户手动录入的值，如果没有则用 Intervals.icu 同步的值
        final_sleep = scale_score(sleep_quality) if sleep_quality else (sleep_score or 75)
        final_fatigue = scale_score(subjective_fatigue) if subjective_fatigue else 50
        final_soreness = scale_score(muscle_soreness) if muscle_soreness else 70
        final_stress = scale_score(stress_level) if stress_level else 70
        final_mood = scale_score(mood) if mood else 70

        # 计算恢复趋势（对比过去 3 天的睡眠和 HRV 趋势）
        recovery_trend = 70
        if today_state:
            recent_states = get_recent_daily_states(self.db, user_id, days=7)
            if len(recent_states) >= 3:
                recent_sleep = [s.sleep_score or 70 for s in recent_states[:3] if s.sleep_score]
                recent_hrv = [s.hrv_score or 70 for s in recent_states[:3] if s.hrv_score]
                if recent_sleep and recent_hrv:
                    recovery_trend = int((sum(recent_sleep) / len(recent_sleep) + sum(recent_hrv) / len(recent_hrv)) / 2)

        # 训练依从性（过去 7 天有训练的天数比例）
        adherence = 80
        if daily_tss:
            training_days = sum(1 for t in daily_tss[:7] if t > 0)
            adherence = int((training_days / 7) * 100)

        # 计算训练能力（结合用户手动录入的主观感受）
        subjective_avg = (final_fatigue + final_soreness + final_stress + final_mood) / 4
        capacity_result = TrainingCapacityEngine.calculate(
            sleep=final_sleep,
            hrv=hrv_score or 70,
            form=TrainingCapacityEngine.normalize_form(form_value or 0),
            acwr=ACWREngine.normalize_score(acwr_value),
            monotony=MonotonyEngine.normalize_score(monotony_value),
            adherence=adherence,
            subjective_fatigue=subjective_avg,
            recovery_trend=recovery_trend
        )

        # 计算训练风险
        safe_form_value = form_value if form_value is not None else 0
        safe_strain = monotony_result.strain if monotony_result.strain is not None else 0
        risk_result = TrainingRiskEngine.calculate(
            acwr_value=acwr_value,
            acwr_risk=TrainingRiskEngine.calculate_acwr_risk(acwr_value),
            monotony_value=monotony_value,
            monotony_risk=TrainingRiskEngine.calculate_monotony_risk(monotony_value),
            form_value=safe_form_value,
            form_risk=TrainingRiskEngine.calculate_form_risk(safe_form_value),
            strain_value=safe_strain,
            strain_risk=TrainingRiskEngine.calculate_strain_risk(safe_strain, sum(daily_tss[:7])),
            intensity_density_risk=0.3
        )

        # 收集 HRV 趋势用于连续下降检测
        hrv_trend = None
        if today_state:
            recent_states = get_recent_daily_states(self.db, user_id, days=7)
            if len(recent_states) >= 3:
                hrv_trend = [getattr(s, 'hrv_score', None) or 50 for s in recent_states[:3]]

        # 收集最近训练记录用于连续高强度/训练天数检测
        recent_workouts = []
        if daily_tss:
            for i, tss in enumerate(daily_tss[:14]):
                recent_workouts.append({
                    'day': i,
                    'tss': tss or 0,
                    'intensity': 'hard' if tss and tss > 80 else 'moderate' if tss and tss > 40 else 'easy'
                })

        # 生成训练建议
        rec_result = DailyRecommendationEngine.generate(
            capacity_score=capacity_result.score,
            capacity_status=capacity_result.status,
            risk_level=risk_result.level,
            risk_score=risk_result.score,
            acwr=acwr_value,
            form=form_value,
            sleep_score=final_sleep,
            hrv_trend=hrv_trend,
            recent_workouts=recent_workouts,
            preferred_sport="running"
        )

        # 保存到数据库
        upsert_daily_state(
            self.db,
            user_id=user_id,
            state_date=today,
            training_capacity=capacity_result.score,
            capacity_status=capacity_result.status.value,
            acwr=acwr_value,
            monotony=monotony_value,
            training_risk_score=risk_result.score,
            training_risk_level=risk_result.level.value,
            confidence=capacity_result.confidence,
            data_level=risk_result.data_quality
        )

        # 保存推荐
        upsert_daily_recommendation(
            self.db,
            user_id=user_id,
            recommendation_date=today,
            day_type="moderate",
            sport=rec_result.recommendation.sport.value,
            workout_type=rec_result.recommendation.workout_type,
            title=rec_result.recommendation.title,
            duration_minutes=rec_result.recommendation.duration_minutes,
            expected_tss=rec_result.recommendation.expected_tss,
            intensity=rec_result.recommendation.intensity.value,
            confidence=capacity_result.confidence
        )

        # 组装响应
        return DailyDataResponse(
            date_val=today,
            training_capacity=TrainingCapacity(
                score=capacity_result.score,
                status=CapacityStatus(capacity_result.status.value),
                status_text=capacity_result.status_text,
                confidence=capacity_result.confidence,
                data_quality=capacity_result.data_quality,
                trend=capacity_result.trend,
                dimension_scores=capacity_result.subscores
            ),
            training_risk=TrainingRisk(
                score=risk_result.score,
                level=RiskLevel(risk_result.level.value),
                user_label=risk_result.user_label,
                confidence=risk_result.confidence,
                data_quality=risk_result.data_quality,
                main_factors=[
                    RiskFactor(
                        factor_name=f.factor_name,
                        factor_value=f.factor_value,
                        message=f.message
                    ) for f in risk_result.main_factors
                ],
                safe_recommendation=risk_result.safe_recommendation
            ),
            recommendation=WorkoutRecommendation(
                sport=rec_result.recommendation.sport,
                workout_type=rec_result.recommendation.workout_type,
                title=rec_result.recommendation.title,
                duration_minutes=rec_result.recommendation.duration_minutes,
                expected_tss=rec_result.recommendation.expected_tss,
                intensity=rec_result.recommendation.intensity,
                structure=rec_result.recommendation.structure
            ),
            explanations=[
                ExplanationItem(
                    item_id=e.item_id,
                    text=e.text,
                    item_type=e.item_type
                ) for e in rec_result.explanations
            ],
            professional_details=[
                ProfessionalDetail(
                    label="Form",
                    numeric_value=float(form_value) if form_value is not None else 0.0,
                    description_text="训练平衡状态，正值表示恢复充分"
                ),
                ProfessionalDetail(
                    label="ACWR",
                    numeric_value=round(float(acwr_value) if acwr_value is not None else 1.0, 2),
                    description_text="急性慢性负荷比，0.8-1.3为安全区间"
                ),
                ProfessionalDetail(
                    label="Monotony",
                    numeric_value=round(float(monotony_value) if monotony_value is not None else 1.5, 2),
                    description_text="训练单调性，越低表示变化越丰富"
                ),
                ProfessionalDetail(
                    label="周负荷",
                    numeric_value=float(sum(daily_tss[:7])),
                    unit="TSS",
                    description_text="近7天总训练负荷"
                ),
                ProfessionalDetail(
                    label="数据质量",
                    numeric_value=0,
                    description_text=cls._get_data_quality_text(capacity_result.data_quality)
                ),
                ProfessionalDetail(
                    label="置信度",
                    numeric_value=round(capacity_result.confidence * 100, 1),
                    unit="%",
                    description_text="基于可用数据量的判断可信度"
                )
            ]
        )

    def get_history_data(self, user_id: int, days: int = 30) -> list[HistoryDataPoint]:
        from app.crud.activity import get_activities_in_range

        data = []
        today = date.today()
        start_date = today - timedelta(days=days - 1)

        activities = get_activities_in_range(self.db, user_id, start_date, today)

        ctl = 50.0
        atl = 45.0
        base_capacity = 65.0
        base_weight = 72.5
        base_hr = 62

        for i in range(days):
            current_date = today - timedelta(days=days - i - 1)

            daily_tss = sum(
                float(a.tss or 0) for a in activities
                if a.start_time and a.start_time.date() == current_date
            )

            # CTL: 42-day EMA = old * 41/42 + new * 1/42
            ctl = ctl * 41 / 42 + daily_tss * 1 / 42

            # ATL: 7-day EMA = old * 6/7 + new * 1/7
            atl = atl * 6 / 7 + daily_tss * 1 / 7

            form_value = ctl - atl

            # 训练能力：基于 Form + 波动
            capacity_contribution = max(-10, min(15, form_value / 5))
            training_capacity = round(base_capacity + capacity_contribution + (i % 7 - 3.5), 1)

            # 模拟体重：有训练日体重略低
            weight_effect = -0.2 if daily_tss > 30 else 0.1
            base_weight = round(base_weight + weight_effect + (i % 3 - 1) * 0.1, 1)

            # 模拟静息心率：训练日略高
            hr_effect = 2 if daily_tss > 30 else -1
            resting_hr = int(base_hr + hr_effect + (i % 5 - 2.5))

            data.append(HistoryDataPoint(
                date_val=current_date,
                ctl=round(ctl, 1),
                atl=round(atl, 1),
                form_value=round(form_value, 1),
                tss=round(daily_tss, 1),
                training_capacity=training_capacity,
                weight=base_weight,
                resting_hr=resting_hr
            ))

        return data

    def get_weekly_review(self, user_id: int) -> WeeklyReviewResponse:
        from app.crud.activity import get_activities_in_range

        today = date.today()
        days_since_monday = today.weekday()
        last_sunday = today - timedelta(days=days_since_monday + 1)
        last_monday = last_sunday - timedelta(days=6)

        week_start = last_monday
        week_end = last_sunday

        last_week_activities = get_activities_in_range(self.db, user_id, week_start, week_end)
        prev_week_start = week_start - timedelta(days=7)
        prev_week_activities = get_activities_in_range(self.db, user_id, prev_week_start, week_start - timedelta(days=1))

        weekly_tss = sum(float(a.tss or 0) for a in last_week_activities)
        prev_weekly_tss = sum(float(a.tss or 0) for a in prev_week_activities)

        training_dates = set(a.start_time.date() for a in last_week_activities if a.start_time)
        training_days = len(training_dates)
        adherence = training_days / 7

        load_change = (weekly_tss - prev_weekly_tss) / prev_weekly_tss if prev_weekly_tss > 0 else 0

        highlights = []
        if training_days >= 5:
            highlights.append(f"训练 {training_days} 天，保持了良好的训练频率")
        elif training_days >= 3:
            highlights.append(f"完成 {training_days} 次训练")
        else:
            highlights.append(f"完成 {training_days} 次训练，下周可适当增加")

        if weekly_tss >= 300:
            highlights.append(f"周负荷 {int(weekly_tss)} TSS，达到训练目标")
        elif weekly_tss >= 150:
            highlights.append(f"周负荷 {int(weekly_tss)} TSS，保持中等强度")

        if load_change > 0.1:
            highlights.append(f"负荷较上周增长 {int(load_change * 100)}%，稳步提升")

        warnings = []
        if load_change > 0.3:
            warnings.append(f"周负荷增长过快（+{int(load_change * 100)}%），注意恢复")
        if weekly_tss > 500:
            warnings.append("周负荷偏高，建议下周适当减量")

        high_tss_days = sum(1 for a in last_week_activities if (a.tss or 0) > 80)
        if high_tss_days >= 3:
            warnings.append(f"有 {high_tss_days} 次高强度训练，注意身体信号")

        if weekly_tss > 400:
            summary = f"上周完成 {int(weekly_tss)} TSS 的训练量，训练状态良好，注意恢复。"
            risk_level = RiskLevel.MODERATE if weekly_tss > 500 else RiskLevel.LOW
        elif weekly_tss > 200:
            summary = f"上周完成 {int(weekly_tss)} TSS，训练量适中，继续保持。"
            risk_level = RiskLevel.LOW
        else:
            summary = f"上周训练量为 {int(weekly_tss)} TSS，可以适当增加训练频率。"
            risk_level = RiskLevel.LOW

        if load_change > 0.3:
            recommendation = "负荷增长过快，建议下周适当减量或增加恢复性训练。"
        elif weekly_tss > 450:
            recommendation = "训练量充足，下周可以安排 1-2 天恢复日，保持负荷平稳。"
        elif training_days < 3:
            recommendation = "建议下周增加训练频率，目标 3-4 次中等强度训练。"
        else:
            recommendation = "训练状态稳定，可以在下周尝试增加一次高质量训练。"

        return WeeklyReviewResponse(
            week_start=week_start,
            week_end=week_end,
            summary=summary,
            adherence=round(adherence, 2),
            weekly_tss=round(weekly_tss),
            load_change_vs_last_week=round(load_change, 2),
            training_risk_level=risk_level,
            highlights=highlights or ["训练数据记录完整"],
            warnings=warnings,
            next_week_recommendation=recommendation
        )
