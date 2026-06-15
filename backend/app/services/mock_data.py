from datetime import date, timedelta
from typing import List
from app.schemas.training import (
    DailyDataResponse,
    TrainingCapacity,
    TrainingRisk,
    WorkoutRecommendation,
    WorkoutStructure,
    ExplanationItem,
    ProfessionalDetail,
    HistoryDataPoint,
    WeeklyReviewResponse,
    RiskFactor
)
from app.schemas.common import CapacityStatus, RiskLevel, IntensityLevel, SportType


class MockDataService:
    """Mock 数据服务，用于前端联调"""

    @staticmethod
    def get_today_data(user_id: int = 1) -> DailyDataResponse:
        """获取今日数据"""
        today = date.today()

        return DailyDataResponse(
            date_val=today,
            training_capacity=TrainingCapacity(
                score=76,
                status=CapacityStatus.TRAIN_NORMALLY,
                status_text="状态稳定，适合正常训练",
                confidence=0.82,
                data_quality="medium",
                trend=4,
                dimension_scores={
                    "sleep": 83,
                    "hrv": 78,
                    "form": 72,
                    "acwr": 80,
                    "monotony": 65,
                    "adherence": 89,
                    "subjective_fatigue": 75,
                    "recovery_trend": 78
                }
            ),
            training_risk=TrainingRisk(
                score=0.21,
                level=RiskLevel.LOW,
                user_label="训练风险较低",
                confidence=0.76,
                data_quality="medium",
                main_factors=[
                    RiskFactor(factor_name="acwr", factor_value=1.1, message="近期训练负荷稳定"),
                    RiskFactor(factor_name="monotony", factor_value=1.7, message="最近一周训练重复性适中")
                ],
                safe_recommendation="当前状态良好，可以按计划进行正常训练。"
            ),
            recommendation=WorkoutRecommendation(
                sport=SportType.RUNNING,
                workout_type="tempo_run",
                title="节奏跑",
                duration_minutes=50,
                expected_tss=65,
                intensity=IntensityLevel.MODERATE,
                structure=WorkoutStructure(
                    warmup="10分钟轻松跑",
                    main_set="30分钟节奏跑（配速约 5:00/km）",
                    cooldown="10分钟放松跑"
                )
            ),
            explanations=[
                ExplanationItem(item_id="1", text="昨晚睡眠恢复良好，睡眠评分 83", item_type="positive"),
                ExplanationItem(item_id="2", text="近期训练负荷稳定，ACWR 1.10 处于安全区间", item_type="positive"),
                ExplanationItem(item_id="3", text="当前疲劳处于可接受范围，Form -8", item_type="neutral")
            ],
            professional_details=[
                ProfessionalDetail(label="Form", numeric_value=-8, description_text="训练平衡状态，正值表示恢复充分"),
                ProfessionalDetail(label="ACWR", numeric_value=1.10, description_text="急性慢性负荷比，0.8-1.3为安全区间"),
                ProfessionalDetail(label="Monotony", numeric_value=1.7, description_text="训练单调性，越低表示变化越丰富"),
                ProfessionalDetail(label="CTL", numeric_value=62, description_text="长期训练负荷（42天指数移动平均）"),
                ProfessionalDetail(label="ATL", numeric_value=70, description_text="短期疲劳（7天指数移动平均）"),
                ProfessionalDetail(label="本周 TSS", numeric_value=280, unit="TSS", description_text="本周训练压力总分"),
                ProfessionalDetail(label="数据置信度", numeric_value=0.75, description_text="数据质量中等，已有 45 天历史数据")
            ]
        )

    @staticmethod
    def get_history_data(user_id: int = 1, days: int = 30) -> List[HistoryDataPoint]:
        """获取历史负荷数据"""
        data = []
        base_date = date.today() - timedelta(days=days)

        ctl, atl = 50, 45
        for i in range(days):
            tss = [40, 65, 0, 55, 75, 80, 30][i % 7]
            if i > 0:
                atl = atl * 0.833 + tss * 0.167
                ctl = ctl * 0.97 + tss * 0.03

            data.append(HistoryDataPoint(
                date_val=base_date + timedelta(days=i),
                ctl=round(ctl, 1),
                atl=round(atl, 1),
                form_value=round(ctl - atl, 1),
                tss=tss
            ))

        return data

    @staticmethod
    def get_weekly_review(user_id: int = 1) -> WeeklyReviewResponse:
        """获取每周复盘"""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        return WeeklyReviewResponse(
            week_start=week_start,
            week_end=week_end,
            summary="本周训练完成度较好，负荷增长稳定。",
            adherence=0.86,
            weekly_tss=430,
            load_change_vs_last_week=0.06,
            training_risk_level=RiskLevel.LOW,
            highlights=[
                "完成 6 次训练中的 5 次",
                "周负荷较上周增长 6%",
                "睡眠趋势稳定"
            ],
            warnings=[
                "周末连续两天强度偏高，下周初建议适当恢复"
            ],
            next_week_recommendation="下周可以维持当前训练量，但建议控制高强度训练次数，注意恢复。"
        )
