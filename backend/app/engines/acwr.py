from typing import Optional, Tuple, List
from dataclasses import dataclass


@dataclass
class ACWRResult:
    acwr: Optional[float]
    risk_level: str
    data_quality: str
    confidence: float
    acute_load_7d: float
    chronic_load_28d_avg: float
    message: str


class ACWREngine:
    """急性慢性负荷比计算引擎

    ACWR = Acute Load (7d) / Chronic Load (28d avg)
    """

    @staticmethod
    def calculate(daily_tss: List[float]) -> ACWRResult:
        """
        计算 ACWR

        Args:
            daily_tss: 每日 TSS 列表，按时间倒序（最新在前）

        Returns:
            ACWRResult: 计算结果
        """
        valid_tss = [t for t in daily_tss if t is not None and t >= 0]

        # 7 天急性负荷
        acute_days = min(7, len(valid_tss))
        acute_load_7d = sum(valid_tss[:acute_days]) if acute_days > 0 else 0

        # 28 天慢性负荷（周平均）
        chronic_days = min(28, len(valid_tss))
        chronic_load_total = sum(valid_tss[:chronic_days]) if chronic_days > 0 else 0
        chronic_load_28d_avg = chronic_load_total / 4 if chronic_days >= 7 else 0

        # 数据质量评估
        data_quality = "insufficient"
        confidence = 0.0

        if chronic_days >= 28:
            data_quality = "high"
            confidence = 0.95
        elif chronic_days >= 21:
            data_quality = "medium"
            confidence = 0.8
        elif chronic_days >= 14:
            data_quality = "low"
            confidence = 0.6
        else:
            data_quality = "insufficient"
            confidence = 0.3

        # 计算 ACWR
        if chronic_load_28d_avg <= 0 or acute_days < 3 or chronic_days < 7:
            return ACWRResult(
                acwr=None,
                risk_level="low",
                data_quality=data_quality,
                confidence=confidence * 0.5,
                acute_load_7d=acute_load_7d,
                chronic_load_28d_avg=chronic_load_28d_avg,
                message="数据不足，无法准确评估负荷变化"
            )

        acwr = acute_load_7d / chronic_load_28d_avg

        # 风险分级
        if acwr < 0.8:
            risk_level = "low"
            message = "近期训练负荷偏低，可适当增加训练量"
        elif 0.8 <= acwr <= 1.3:
            risk_level = "low"
            message = "近期训练负荷稳定，处于最佳区间"
        elif 1.3 < acwr <= 1.5:
            risk_level = "moderate"
            message = "近期训练负荷增长较快，注意恢复"
        else:
            risk_level = "elevated"
            message = "训练负荷增长过快，建议降低强度，防止过度训练"

        return ACWRResult(
            acwr=acwr,
            risk_level=risk_level,
            data_quality=data_quality,
            confidence=confidence,
            acute_load_7d=acute_load_7d,
            chronic_load_28d_avg=chronic_load_28d_avg,
            message=message
        )

    @staticmethod
    def normalize_score(acwr: Optional[float]) -> float:
        """
        将 ACWR 归一化为 0-100 的评分

        Args:
            acwr: ACWR 值

        Returns:
            float: 归一化评分 0-100
        """
        if acwr is None:
            return 50.0

        # ACWR 最佳区间 1.0-1.2 -> 最高分 100
        # 偏离越远分数越低
        if acwr <= 0:
            return 0
        elif acwr <= 1.1:
            # 0 -> 0, 1.1 -> 100
            return min(100, (acwr / 1.1) * 100)
        elif acwr <= 2.0:
            # 1.1 -> 100, 2.0 -> 20
            return 100 - ((acwr - 1.1) / 0.9) * 80
        else:
            return 20.0
