from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.engines import (
    ACWREngine,
    MonotonyEngine,
    TrainingCapacityEngine,
    TrainingRiskEngine,
    DailyRecommendationEngine
)
from app.crud.activity import get_daily_tss_for_acwr
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

    def generate_today_data(self, user_id: int) -> DailyDataResponse:
        """生成今日完整训练数据"""
        today = date.today()

        # 获取历史训练数据用于计算
        daily_tss = get_daily_tss_for_acwr(self.db, user_id, days=28)

        # 计算 ACWR
        acwr_result = ACWREngine.calculate(daily_tss)
        acwr_value = acwr_result.acwr or 1.0

        # 计算 Monotony
        monotony_result = MonotonyEngine.calculate(daily_tss[:7])
        monotony_value = monotony_result.monotony or 1.5

        # 计算 Form 值 (简化 - 实际应从 Intervals.icu 同步)
        form_value = (sum(daily_tss[:7]) / 7) - (sum(daily_tss[7:14]) / 7) if len(daily_tss) >= 14 else 0

        # 计算训练能力
        capacity_result = TrainingCapacityEngine.calculate(
            sleep=75,
            hrv=70,
            form=TrainingCapacityEngine.normalize_form(form_value),
            acwr=ACWREngine.normalize_score(acwr_value),
            monotony=MonotonyEngine.normalize_score(monotony_value),
            adherence=80,
            subjective_fatigue=5,
            recovery_trend=70
        )

        # 计算训练风险
        risk_result = TrainingRiskEngine.calculate(
            acwr_value=acwr_value,
            acwr_risk=TrainingRiskEngine.calculate_acwr_risk(acwr_value),
            monotony_value=monotony_value,
            monotony_risk=TrainingRiskEngine.calculate_monotony_risk(monotony_value),
            form_value=form_value,
            form_risk=TrainingRiskEngine.calculate_form_risk(form_value),
            strain_value=monotony_result.strain,
            strain_risk=TrainingRiskEngine.calculate_strain_risk(monotony_result.strain, sum(daily_tss[:7])),
            intensity_density_risk=0.3
        )

        # 生成训练建议
        rec_result = DailyRecommendationEngine.generate(
            capacity_score=capacity_result.score,
            capacity_status=capacity_result.status,
            risk_level=risk_result.level,
            risk_score=risk_result.score,
            acwr=acwr_value,
            form=form_value,
            sleep_score=75,
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
                    numeric_value=form_value,
                    description_text="训练平衡状态，正值表示恢复充分"
                ),
                ProfessionalDetail(
                    label="ACWR",
                    numeric_value=round(acwr_value, 2),
                    description_text="急性慢性负荷比，0.8-1.3为安全区间"
                ),
                ProfessionalDetail(
                    label="Monotony",
                    numeric_value=round(monotony_value, 2),
                    description_text="训练单调性，越低表示变化越丰富"
                ),
                ProfessionalDetail(
                    label="周负荷",
                    numeric_value=sum(daily_tss[:7]),
                    unit="TSS",
                    description_text="近7天总训练负荷"
                )
            ]
        )

    def get_history_data(self, user_id: int, days: int = 30) -> list[HistoryDataPoint]:
        """获取历史负荷数据"""
        data = []
        today = date.today()

        for i in range(days):
            current_date = today - timedelta(days=days - i - 1)
            # 简化 - 使用模拟数据
            ctl = 50 + i * 0.5
            atl = 45 + i * 0.6
            tss = 40 + (i % 7) * 10

            data.append(HistoryDataPoint(
                date_val=current_date,
                ctl=round(ctl, 1),
                atl=round(atl, 1),
                form_value=round(ctl - atl, 1),
                tss=round(tss, 1)
            ))

        return data

    def get_weekly_review(self, user_id: int) -> WeeklyReviewResponse:
        """获取每周复盘数据"""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        return WeeklyReviewResponse(
            week_start=week_start,
            week_end=week_end,
            summary="本周训练完成度较好，负荷增长稳定，注意周末高强度后的恢复。",
            adherence=0.86,
            weekly_tss=430,
            load_change_vs_last_week=0.06,
            training_risk_level=RiskLevel.LOW,
            highlights=["完成 6 次计划中的 5 次", "周负荷较上周增长 6%", "睡眠质量稳定"],
            warnings=["周末连续两天强度偏高，下周初建议适当恢复"],
            next_week_recommendation="下周可以维持当前训练量，但建议控制高强度训练次数，注意恢复。"
        )
