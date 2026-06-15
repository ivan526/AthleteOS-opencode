from typing import List, Optional
from dataclasses import dataclass
from app.schemas.common import CapacityStatus, RiskLevel, IntensityLevel, SportType
from app.schemas.training import WorkoutRecommendation, WorkoutStructure, ExplanationItem


@dataclass
class SafetyCheckResult:
    """安全规则检查结果"""
    triggered: bool
    day_type: str
    intensity: IntensityLevel
    reason: str
    severity: str  # "warning" | "mandatory"


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
        hrv_trend: Optional[List[float]] = None,
        recent_workouts: Optional[List[dict]] = None,
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
            hrv_trend: 最近几天的 HRV 值（最新在前），用于检测连续下降
            recent_workouts: 最近几天的训练记录，用于检测连续高强度和连续训练天数
            preferred_sport: 用户偏好运动

        Returns:
            RecommendationResult: 训练建议和解释
        """
        # Step 1: 执行所有 Hard Safety Rules 检查
        safety_result = cls._check_all_safety_rules(
            capacity_score, risk_level, risk_score, form, acwr, 
            sleep_score, hrv_trend, recent_workouts
        )

        # Step 2: 如果触发强制安全规则，使用其建议
        if safety_result and safety_result.triggered and safety_result.severity == "mandatory":
            day_type = safety_result.day_type
            intensity = safety_result.intensity
        else:
            # Step 3: 基于 Training Capacity 判断 Day Type
            day_type, intensity = cls._get_day_type_by_capacity(capacity_score, risk_level)

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
            capacity_score, risk_score, acwr, form, sleep_score, safety_result
        )

        return RecommendationResult(
            recommendation=recommendation,
            explanations=explanations
        )

    @classmethod
    def _check_all_safety_rules(
        cls,
        capacity_score: float,
        risk_level: RiskLevel,
        risk_score: float,
        form: Optional[float],
        acwr: Optional[float],
        sleep_score: Optional[float],
        hrv_trend: Optional[List[float]],
        recent_workouts: Optional[List[dict]]
    ) -> Optional[SafetyCheckResult]:
        if capacity_score < 40:
            return SafetyCheckResult(
                triggered=True, day_type="recovery", intensity=IntensityLevel.RECOVERY,
                reason="训练能力评分过低，恢复优先", severity="mandatory"
            )

        if risk_score > 0.75 or risk_level == RiskLevel.HIGH_CAUTION:
            return SafetyCheckResult(
                triggered=True, day_type="recovery", intensity=IntensityLevel.RECOVERY,
                reason="训练风险过高，强制恢复模式", severity="mandatory"
            )

        if form is not None and form < -25:
            return SafetyCheckResult(
                triggered=True, day_type="easy", intensity=IntensityLevel.EASY,
                reason="疲劳积累过高，禁止高强度训练", severity="mandatory"
            )

        if acwr is not None and acwr > 1.5:
            return SafetyCheckResult(
                triggered=True, day_type="easy", intensity=IntensityLevel.EASY,
                reason="负荷增长过快，禁止高强度训练", severity="mandatory"
            )

        if recent_workouts:
            consecutive_hard_days = cls._count_consecutive_high_intensity(recent_workouts)
            if consecutive_hard_days >= 3:
                return SafetyCheckResult(
                    triggered=True, day_type="easy", intensity=IntensityLevel.EASY,
                    reason=f"连续 {consecutive_hard_days} 天高强度训练，今日安排轻松日", severity="mandatory"
                )

        if recent_workouts:
            consecutive_training_days = cls._count_consecutive_training_days(recent_workouts)
            if consecutive_training_days >= 7:
                return SafetyCheckResult(
                    triggered=True, day_type="recovery", intensity=IntensityLevel.RECOVERY,
                    reason=f"连续训练 {consecutive_training_days} 天，建议今日休息或恢复训练", severity="warning"
                )

        if sleep_score is not None and sleep_score < 60:
            return SafetyCheckResult(
                triggered=True, day_type="easy", intensity=IntensityLevel.EASY,
                reason="睡眠质量不佳，建议降低训练强度", severity="warning"
            )

        if hrv_trend and len(hrv_trend) >= 3 and cls._check_hrv_continuous_drop(hrv_trend):
            return SafetyCheckResult(
                triggered=True, day_type="recovery", intensity=IntensityLevel.RECOVERY,
                reason="HRV 连续下降，自主神经恢复不佳，进入恢复模式", severity="warning"
            )

        return None

    @staticmethod
    def _get_day_type_by_capacity(
        capacity_score: float, risk_level: RiskLevel
    ) -> tuple[str, IntensityLevel]:
        if risk_level == RiskLevel.ELEVATED:
            return "easy", IntensityLevel.EASY

        if capacity_score >= 81:
            return "hard", IntensityLevel.HARD
        elif capacity_score >= 61:
            return "moderate", IntensityLevel.MODERATE
        elif capacity_score >= 41:
            return "easy", IntensityLevel.EASY
        else:
            return "recovery", IntensityLevel.RECOVERY

    @staticmethod
    def _count_consecutive_high_intensity(workouts: List[dict]) -> int:
        count = 0
        for workout in workouts[:7]:
            intensity = workout.get('intensity')
            if intensity in ['hard', 'interval', 'threshold']:
                count += 1
            else:
                break
        return count

    @staticmethod
    def _count_consecutive_training_days(workouts: List[dict]) -> int:
        count = 0
        for workout in workouts[:14]:
            if workout.get('tss', 0) > 10:
                count += 1
            else:
                break
        return count

    @staticmethod
    def _check_hrv_continuous_drop(hrv_trend: List[float], threshold: float = 0.15) -> bool:
        if len(hrv_trend) < 3:
            return False
        day1, day2, day3 = hrv_trend[0], hrv_trend[1], hrv_trend[2]
        if day1 < day2 and day2 < day3:
            total_drop = (day3 - day1) / day3 if day3 > 0 else 0
            return total_drop >= threshold
        return False

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
        sleep: float = None,
        safety_result: Optional[SafetyCheckResult] = None
    ) -> List[ExplanationItem]:
        explanations = []

        if safety_result and safety_result.triggered:
            explanations.append(ExplanationItem(
                item_id="safety_rule",
                text=safety_result.reason,
                item_type="warning" if safety_result.severity == "warning" else "critical"
            ))

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
