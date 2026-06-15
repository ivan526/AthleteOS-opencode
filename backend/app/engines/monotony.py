import math
from typing import Optional, List
from dataclasses import dataclass


@dataclass
class MonotonyResult:
    monotony: Optional[float]
    monotony_capped: float
    risk_level: str
    data_quality: str
    confidence: float
    mean_daily_load: float
    std_daily_load: float
    strain: float
    message: str


class MonotonyEngine:
    """训练单调性计算引擎

    Monotony = mean_daily_load / std_daily_load

    检测训练是否过于单调，缺乏变化。
    """

    @staticmethod
    def calculate(daily_tss: List[float]) -> MonotonyResult:
        """
        计算训练单调性

        Args:
            daily_tss: 最近 7 天每日 TSS，按时间倒序（最新在前）

        Returns:
            MonotonyResult: 计算结果
        """
        recent_tss = [t for t in daily_tss[:7] if t is not None and t >= 0]
        training_days = len([t for t in recent_tss if t > 10])

        data_quality = "insufficient"
        confidence = 0.0

        if training_days >= 5:
            data_quality = "high"
            confidence = 0.9
        elif training_days >= 3:
            data_quality = "medium"
            confidence = 0.7
        else:
            data_quality = "insufficient"
            confidence = 0.3

        if training_days < 3:
            return MonotonyResult(
                monotony=None,
                monotony_capped=0.0,
                risk_level="low",
                data_quality=data_quality,
                confidence=confidence * 0.5,
                mean_daily_load=0.0,
                std_daily_load=0.0,
                strain=0.0,
                message="训练天数不足，无法评估单调性"
            )

        mean_daily_load = sum(recent_tss) / len(recent_tss)

        # 计算标准差
        variance = sum((t - mean_daily_load) ** 2 for t in recent_tss) / len(recent_tss)
        std_daily_load = math.sqrt(variance)

        # 处理标准差为 0 的情况
        if std_daily_load < 1:
            monotony = None
            monotony_capped = 3.0
            strain = mean_daily_load * monotony_capped if mean_daily_load > 0 else 0
            return MonotonyResult(
                monotony=monotony,
                monotony_capped=monotony_capped,
                risk_level="severe",
                data_quality=data_quality,
                confidence=confidence,
                mean_daily_load=mean_daily_load,
                std_daily_load=std_daily_load,
                strain=strain,
                message="最近每日训练负荷高度重复，建议增加轻重变化"
            )

        monotony = mean_daily_load / std_daily_load
        monotony_capped = min(monotony, 3.0)
        strain = mean_daily_load * monotony

        # 风险分级
        if monotony < 1.5:
            risk_level = "low"
            message = "训练变化丰富，负荷分配合理"
        elif 1.5 <= monotony < 2.0:
            risk_level = "warning"
            message = "训练重复性略高，可适当增加变化"
        elif 2.0 <= monotony < 2.5:
            risk_level = "high"
            message = "训练较为单调，建议增加不同强度训练"
        else:
            risk_level = "severe"
            message = "训练高度单调，受伤风险增加，急需调整"

        return MonotonyResult(
            monotony=monotony,
            monotony_capped=monotony_capped,
            risk_level=risk_level,
            data_quality=data_quality,
            confidence=confidence,
            mean_daily_load=mean_daily_load,
            std_daily_load=std_daily_load,
            strain=strain,
            message=message
        )

    @staticmethod
    def normalize_score(monotony: Optional[float]) -> float:
        """
        将 Monotony 归一化为 0-100 的评分

        Args:
            monotony: Monotony 值

        Returns:
            float: 归一化评分 0-100（越低越健康）
        """
        if monotony is None:
            return 50.0

        # Monotony 越小越好
        # 0-1.0 -> 100-90
        # 1.0-1.5 -> 90-80
        # 1.5-2.0 -> 80-60
        # 2.0-2.5 -> 60-40
        # 2.5+ -> 40-0
        if monotony <= 1.0:
            return 100 - monotony * 10
        elif monotony <= 1.5:
            return 90 - ((monotony - 1.0) / 0.5) * 10
        elif monotony <= 2.0:
            return 80 - ((monotony - 1.5) / 0.5) * 20
        elif monotony <= 2.5:
            return 60 - ((monotony - 2.0) / 0.5) * 20
        else:
            return max(0, 40 - ((monotony - 2.5) / 0.5) * 40)
