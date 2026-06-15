from typing import List
from dataclasses import dataclass
from app.schemas.common import CapacityStatus, RiskLevel, IntensityLevel, SportType
from app.schemas.training import WorkoutRecommendation, WorkoutStructure, ExplanationItem


@dataclass
class RecommendationResult:
    recommendation: WorkoutRecommendation
    explanations: List[ExplanationItem]


class DailyRecommendationEngine:
    """每日训练建议生成引擎

    基于训练能力、风险评估和目标阶段，生成今日训练建议。
    遵循 Hard Safety Rules 强制约束。
    """

    @classmethod
    def generate(
        cls,
        capacity_score: float,
        capacity_status: CapacityStatus,
        risk_level: RiskLevel,
        risk_score: float,
        acwr: float = None,
        form: float = None,
        sleep_score: float = None,
        preferred_sport: str = "running"
    ) -> RecommendationResult:
        """
        生成今日训练建议

        Args:
            capacity_score: 训练能力评分 0-100
            capacity_status: 训练能力状态
            risk_level: 训练风险等级
            risk_score: 风险评分 0-1
            acwr: ACWR 值（可选）
            form: Form 值（可选）
            sleep_score: 睡眠评分（可选）
            preferred_sport: 用户偏好运动

        Returns:
            RecommendationResult: 训练建议和解释
        """
        # Hard Safety Rules 检查
        day_type, intensity = cls._get_day_type(capacity_score, risk_level, form, acwr)

        # 生成训练建议
        sport = SportType(preferred_sport) if preferred_sport in [s.value for s in SportType] else SportType.RUNNING

        if day_type == "recovery":
            recommendation = cls._generate_recovery_workout(sport)
        elif day_type == "easy":
            recommendation = cls._generate_easy_workout(sport, capacity_score)
        elif day_type == "moderate":
            recommendation = cls._generate_moderate_workout(sport, capacity_score)
        else:  # hard
            recommendation = cls._generate_hard_workout(sport, capacity_score)

        # 生成解释
        explanations = cls._generate_explanations(
            capacity_score, risk_score, acwr, form, sleep_score
        )

        return RecommendationResult(
            recommendation=recommendation,
            explanations=explanations
        )

    @staticmethod
    def _get_day_type(
        capacity_score: float,
        risk_level: RiskLevel,
        form: float = None,
        acwr: float = None
    ) -> tuple[str, IntensityLevel]:
        """
        确定训练日类型和强度等级

        Returns:
            (day_type, intensity_level)
        """
        # Hard Safety Rule 1: 高风险强制恢复
        if risk_level == RiskLevel.HIGH_CAUTION:
            return "recovery", IntensityLevel.RECOVERY

        # Hard Safety Rule 2: Form < -25 禁止高强度
        if form is not None and form < -25:
            return "easy", IntensityLevel.EASY

        # Hard Safety Rule 3: ACWR > 1.5 禁止高强度
        if acwr is not None and acwr > 1.5:
            return "easy", IntensityLevel.EASY

        # 基于 Training Capacity
        if capacity_score >= 81:
            return "hard", IntensityLevel.HARD
        elif capacity_score >= 61:
            return "moderate", IntensityLevel.MODERATE
        elif capacity_score >= 41:
            return "easy", IntensityLevel.EASY
        else:
            return "recovery", IntensityLevel.RECOVERY

    @staticmethod
    def _generate_recovery_workout(sport: SportType) -> WorkoutRecommendation:
        """生成恢复训练建议"""
        if sport == SportType.CYCLING:
            return WorkoutRecommendation(
                sport=sport,
                workout_type="recovery_ride",
                title="恢复骑行",
                duration_minutes=40,
                expected_tss=25,
                intensity=IntensityLevel.RECOVERY,
                structure=WorkoutStructure(
                    warmup="5分钟轻松骑",
                    main_set="保持低强度，心率不超过最大心率的 65%",
                    cooldown="5分钟放松骑"
                )
            )
        else:
            return WorkoutRecommendation(
                sport=SportType.RUNNING,
                workout_type="recovery_run",
                title="恢复跑",
                duration_minutes=30,
                expected_tss=20,
                intensity=IntensityLevel.RECOVERY,
                structure=WorkoutStructure(
                    warmup="5分钟步行或超慢跑",
                    main_set="配速比马拉松配速慢 2-3 分钟/公里",
                    cooldown="5分钟步行放松"
                )
            )

    @staticmethod
    def _generate_easy_workout(sport: SportType, capacity: float) -> WorkoutRecommendation:
        """生成轻松训练建议"""
        duration = int(40 + (capacity - 40) / 20 * 20)
        tss = int(30 + (capacity - 40) / 20 * 20)

        if sport == SportType.CYCLING:
            return WorkoutRecommendation(
                sport=sport,
                workout_type="easy_ride",
                title="轻松骑行",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.EASY,
                structure=WorkoutStructure(
                    warmup="10分钟轻松骑",
                    main_set="保持 Zone 2 强度，心率不超过最大心率的 70%",
                    cooldown="5分钟放松骑"
                )
            )
        else:
            return WorkoutRecommendation(
                sport=SportType.RUNNING,
                workout_type="easy_run",
                title="轻松跑",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.EASY,
                structure=WorkoutStructure(
                    warmup="5分钟超慢跑",
                    main_set="以谈话配速进行，能轻松对话",
                    cooldown="5分钟步行"
                )
            )

    @staticmethod
    def _generate_moderate_workout(sport: SportType, capacity: float) -> WorkoutRecommendation:
        """生成中等强度训练建议"""
        duration = int(50 + (capacity - 60) / 20 * 20)
        tss = int(55 + (capacity - 60) / 20 * 20)

        if sport == SportType.CYCLING:
            return WorkoutRecommendation(
                sport=sport,
                workout_type="sweet_spot",
                title="Sweet Spot 骑行",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.MODERATE,
                structure=WorkoutStructure(
                    warmup="10分钟热身",
                    main_set="3-4组 8分钟 FTP 88-94%，每组间休息 2分钟",
                    cooldown="10分钟放松骑"
                )
            )
        else:
            return WorkoutRecommendation(
                sport=SportType.RUNNING,
                workout_type="tempo_run",
                title="节奏跑",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.MODERATE,
                structure=WorkoutStructure(
                    warmup="10分钟轻松跑",
                    main_set="20-30分钟阈值配速，约马拉松配速或略快",
                    cooldown="10分钟放松跑"
                )
            )

    @staticmethod
    def _generate_hard_workout(sport: SportType, capacity: float) -> WorkoutRecommendation:
        """生成高强度训练建议"""
        duration = int(60 + min((capacity - 80) / 20, 1) * 20)
        tss = int(75 + min((capacity - 80) / 20, 1) * 25)

        if sport == SportType.CYCLING:
            return WorkoutRecommendation(
                sport=sport,
                workout_type="interval_cycling",
                title="间歇骑行",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.HARD,
                structure=WorkoutStructure(
                    warmup="15分钟热身，包含 3组 30秒快速骑",
                    main_set="6-8组 3分钟 VO2 Max 强度，每组间休息 3分钟",
                    cooldown="10分钟放松骑"
                )
            )
        else:
            return WorkoutRecommendation(
                sport=SportType.RUNNING,
                workout_type="interval_run",
                title="间歇跑",
                duration_minutes=duration,
                expected_tss=tss,
                intensity=IntensityLevel.HARD,
                structure=WorkoutStructure(
                    warmup="15分钟轻松跑 + 跨步跑",
                    main_set="6-8组 400米 5K 配速，每组间休息 200米慢跑",
                    cooldown="10分钟放松跑"
                )
            )

    @staticmethod
    def _generate_explanations(
        capacity: float,
        risk: float,
        acwr: float = None,
        form: float = None,
        sleep: float = None
    ) -> List[ExplanationItem]:
        """生成简洁解释"""
        explanations = []

        # 睡眠解释
        if sleep is not None:
            if sleep >= 75:
                explanations.append(ExplanationItem(
                    item_id="sleep",
                    text=f"昨晚睡眠恢复良好，睡眠评分 {int(sleep)}",
                    item_type="positive"
                ))
            elif sleep >= 60:
                explanations.append(ExplanationItem(
                    item_id="sleep",
                    text=f"睡眠一般，睡眠评分 {int(sleep)}",
                    item_type="neutral"
                ))
            else:
                explanations.append(ExplanationItem(
                    item_id="sleep",
                    text=f"睡眠不足，睡眠评分 {int(sleep)}，建议降低强度",
                    item_type="warning"
                ))

        # ACWR 解释
        if acwr is not None:
            if acwr <= 1.3:
                explanations.append(ExplanationItem(
                    item_id="acwr",
                    text=f"近期训练负荷稳定，ACWR {acwr:.2f}",
                    item_type="positive"
                ))
            elif acwr <= 1.5:
                explanations.append(ExplanationItem(
                    item_id="acwr",
                    text=f"近期训练负荷增长较快，ACWR {acwr:.2f}，注意恢复",
                    item_type="neutral"
                ))
            else:
                explanations.append(ExplanationItem(
                    item_id="acwr",
                    text=f"训练负荷增长过快，ACWR {acwr:.2f}，已降低训练强度",
                    item_type="warning"
                ))

        # Form 解释
        if form is not None:
            if form >= -10:
                explanations.append(ExplanationItem(
                    item_id="form",
                    text=f"疲劳状态正常，Form {form:.1f}",
                    item_type="positive"
                ))
            elif form >= -20:
                explanations.append(ExplanationItem(
                    item_id="form",
                    text=f"疲劳有一定积累，Form {form:.1f}",
                    item_type="neutral"
                ))
            else:
                explanations.append(ExplanationItem(
                    item_id="form",
                    text=f"过度疲劳，Form {form:.1f}，建议优先恢复",
                    item_type="warning"
                ))

        # 容量解释
        if len(explanations) < 3:
            if capacity >= 70:
                explanations.append(ExplanationItem(
                    item_id="capacity",
                    text="整体状态良好，可按计划训练",
                    item_type="positive"
                ))
            elif capacity >= 50:
                explanations.append(ExplanationItem(
                    item_id="capacity",
                    text="整体状态一般，建议适度训练",
                    item_type="neutral"
                ))
            else:
                explanations.append(ExplanationItem(
                    item_id="capacity",
                    text="整体状态较差，恢复优先",
                    item_type="warning"
                ))

        return explanations[:3]
