from typing import Dict, Optional, Tuple
from dataclasses import dataclass
from app.schemas.common import CapacityStatus


@dataclass
class CapacityResult:
    score: float
    status: CapacityStatus
    status_text: str
    confidence: float
    data_quality: str
    trend: float
    subscores: Dict[str, float]


class TrainingCapacityEngine:
    """训练能力综合评分引擎

    基于多维度加权计算今日训练能力：
    - Sleep Score (20%): 睡眠恢复情况
    - HRV Score (10%): 自主神经恢复
    - Form Score (15%): CTL 与 ATL 的平衡
    - ACWR Score (10%): 急性慢性负荷比
    - Monotony Score (10%): 训练单调性
    - Adherence Score (15%): 训练执行率
    - Subjective Fatigue (10%): 主观疲劳
    - Recovery Trend (10%): 近期恢复趋势
    """

    WEIGHTS = {
        "sleep": 0.20,
        "hrv": 0.10,
        "form": 0.15,
        "acwr": 0.10,
        "monotony": 0.10,
        "adherence": 0.15,
        "subjective_fatigue": 0.10,
        "recovery_trend": 0.10
    }

    @classmethod
    def calculate(cls, **kwargs) -> CapacityResult:
        """
        计算训练能力综合评分

        Args:
            sleep: 睡眠评分 0-100
            hrv: HRV 评分 0-100
            form: Form 标准化评分 0-100
            acwr: ACWR 标准化评分 0-100
            monotony: Monotony 标准化评分 0-100
            adherence: 训练执行率 0-100
            subjective_fatigue: 主观疲劳评分 0-100
            recovery_trend: 恢复趋势评分 0-100
            trend: 较昨日变化（可选）
            data_quality_level: 数据质量等级（可选，默认 'medium'）

        Returns:
            CapacityResult: 训练能力结果
        """
        subscores = {}
        total_weight = 0.0
        weighted_sum = 0.0

        for dimension, weight in cls.WEIGHTS.items():
            value = kwargs.get(dimension)
            if value is not None:
                value = max(0, min(100, value))
                subscores[dimension] = value
                weighted_sum += value * weight
                total_weight += weight
            else:
                subscores[dimension] = 50.0

        # 归一化总分
        if total_weight > 0:
            final_score = weighted_sum / total_weight
        else:
            final_score = 50.0

        # 数据质量和置信度评估
        available_dimensions = sum(1 for k, v in kwargs.items() if k in cls.WEIGHTS and v is not None)
        if available_dimensions >= 7:
            data_quality = "high"
            confidence = 0.9
        elif available_dimensions >= 5:
            data_quality = "medium"
            confidence = 0.75
        elif available_dimensions >= 3:
            data_quality = "low"
            confidence = 0.5
        else:
            data_quality = "insufficient"
            confidence = 0.3

        # 确定状态
        status, status_text = cls._get_status(final_score)

        # 获取趋势
        trend = kwargs.get("trend", 0.0)

        return CapacityResult(
            score=round(final_score, 1),
            status=status,
            status_text=status_text,
            confidence=confidence,
            data_quality=data_quality,
            trend=trend,
            subscores=subscores
        )

    @staticmethod
    def _get_status(score: float) -> Tuple[CapacityStatus, str]:
        """根据分数确定状态"""
        if score >= 81:
            return CapacityStatus.READY_TO_PUSH, "状态很好，可以安排高质量训练"
        elif score >= 61:
            return CapacityStatus.TRAIN_NORMALLY, "状态稳定，适合正常训练"
        elif score >= 41:
            return CapacityStatus.REDUCE_INTENSITY, "状态一般，建议降低强度"
        else:
            return CapacityStatus.RECOVERY_REQUIRED, "恢复优先，建议休息或恢复训练"

    @staticmethod
    def normalize_form(form: float) -> float:
        """
        将 Form (CTL - ATL) 标准化为 0-100 评分

        Args:
            form: Form 值，通常范围 -30 到 +30

        Returns:
            float: 标准化评分 0-100
        """
        # Form = 20 -> 100 分
        # Form = 0 -> 80 分
        # Form = -10 -> 60 分
        # Form = -20 -> 30 分
        # Form < -25 -> 10 分
        if form >= 20:
            return 100.0
        elif form >= 0:
            return 80 + (form / 20) * 20
        elif form >= -10:
            return 60 + ((form + 10) / 10) * 20
        elif form >= -20:
            return 30 + ((form + 20) / 10) * 30
        else:
            return 10.0

    @staticmethod
    def normalize_subjective_fatigue(fatigue: int) -> float:
        """
        将主观疲劳 1-10 转换为评分

        Args:
            fatigue: 主观疲劳程度 1-10（1=非常轻松，10=极度疲劳）

        Returns:
            float: 标准化评分 0-100（分数越高表示恢复越好）
        """
        # 疲劳值越高，分数越低
        fatigue = max(1, min(10, fatigue))
        return 100 - (fatigue - 1) * 10
