from typing import List, Tuple
from dataclasses import dataclass
from app.schemas.common import RiskLevel


@dataclass
class RiskFactorResult:
    factor_name: str
    factor_value: float
    message: str


@dataclass
class RiskResult:
    score: float
    level: RiskLevel
    user_label: str
    confidence: float
    data_quality: str
    main_factors: List[RiskFactorResult]
    safe_recommendation: str


class TrainingRiskEngine:
    """训练风险综合评估引擎

    综合多维度计算训练受伤风险：
    - ACWR Risk (35%): 急性慢性负荷比
    - Monotony Risk (20%): 训练单调性
    - Form Risk (20%): 训练平衡状态
    - Strain Risk (15%): 训练应变
    - Intensity Density Risk (10%): 强度密度

    输出 risk_score 0-1，用户侧展示训练风险等级
    """

    WEIGHTS = {
        "acwr": 0.35,
        "monotony": 0.20,
        "form": 0.20,
        "strain": 0.15,
        "intensity_density": 0.10
    }

    @classmethod
    def calculate(cls, **kwargs) -> RiskResult:
        """
        计算综合训练风险

        Args:
            acwr_value: ACWR 原始值
            acwr_risk: ACWR 风险评分 0-1 (0=无风险, 1=高风险)
            monotony_value: Monotony 原始值
            monotony_risk: Monotony 风险评分 0-1
            form_value: Form 原始值 (CTL - ATL)
            form_risk: Form 风险评分 0-1
            strain_value: Strain 原始值
            strain_risk: Strain 风险评分 0-1
            intensity_density_risk: 强度密度风险 0-1 (可选)
            data_quality_level: 数据质量等级（可选）

        Returns:
            RiskResult: 训练风险评估结果
        """
        risk_scores = {}
        factor_values = {}

        # ACWR 风险
        if kwargs.get("acwr_risk") is not None:
            risk_scores["acwr"] = kwargs["acwr_risk"]
            factor_values["acwr"] = kwargs.get("acwr_value", 0)

        # Monotony 风险
        if kwargs.get("monotony_risk") is not None:
            risk_scores["monotony"] = kwargs["monotony_risk"]
            factor_values["monotony"] = kwargs.get("monotony_value", 0)

        # Form 风险
        if kwargs.get("form_risk") is not None:
            risk_scores["form"] = kwargs["form_risk"]
            factor_values["form"] = kwargs.get("form_value", 0)

        # Strain 风险
        if kwargs.get("strain_risk") is not None:
            risk_scores["strain"] = kwargs["strain_risk"]
            factor_values["strain"] = kwargs.get("strain_value", 0)

        # 强度密度风险（可选）
        if kwargs.get("intensity_density_risk") is not None:
            risk_scores["intensity_density"] = kwargs["intensity_density_risk"]

        # 计算加权综合风险评分
        total_weight = 0.0
        weighted_sum = 0.0

        for factor, weight in cls.WEIGHTS.items():
            if factor in risk_scores:
                weighted_sum += risk_scores[factor] * weight
                total_weight += weight

        if total_weight > 0:
            risk_score = weighted_sum / total_weight
        else:
            risk_score = 0.5

        # 数据质量和置信度
        available_factors = len(risk_scores)
        if available_factors >= 4:
            data_quality = "high"
            confidence = 0.9
        elif available_factors >= 3:
            data_quality = "medium"
            confidence = 0.75
        elif available_factors >= 2:
            data_quality = "low"
            confidence = 0.5
        else:
            data_quality = "insufficient"
            confidence = 0.3

        # 确定风险等级和用户文案
        level, user_label, recommendation = cls._get_risk_level(risk_score)

        # 生成主要因素说明
        main_factors = cls._generate_factor_descriptions(factor_values, risk_scores)

        return RiskResult(
            score=round(risk_score, 2),
            level=level,
            user_label=user_label,
            confidence=confidence,
            data_quality=data_quality,
            main_factors=main_factors,
            safe_recommendation=recommendation
        )

    @staticmethod
    def _get_risk_level(score: float) -> Tuple[RiskLevel, str, str]:
        """根据风险分数确定等级和用户文案"""
        if score < 0.25:
            return (
                RiskLevel.LOW,
                "训练风险较低",
                "当前状态良好，可以按计划进行正常训练。"
            )
        elif score < 0.50:
            return (
                RiskLevel.MODERATE,
                "训练风险略有上升",
                "注意训练后恢复，建议适当调整强度。"
            )
        elif score < 0.75:
            return (
                RiskLevel.ELEVATED,
                "训练风险偏高，建议避免高强度",
                "建议降低训练强度，增加恢复训练，如已有疼痛不适请优先休息。"
            )
        else:
            return (
                RiskLevel.HIGH_CAUTION,
                "训练风险较高，建议恢复优先",
                "强烈建议今日以恢复为主，避免任何高强度训练，必要时休息一天。"
            )

    @staticmethod
    def _generate_factor_descriptions(
        factor_values: dict,
        risk_scores: dict
    ) -> List[RiskFactorResult]:
        """生成各风险因素的用户友好说明"""
        factors = []

        # ACWR 说明
        if "acwr" in factor_values:
            acwr = factor_values["acwr"]
            if acwr < 0.8:
                message = "近期训练负荷偏低"
            elif acwr < 1.3:
                message = "近期训练负荷稳定"
            elif acwr < 1.5:
                message = "近期训练负荷增长较快"
            else:
                message = "训练负荷增长过快"
            factors.append(RiskFactorResult(
                factor_name="acwr",
                factor_value=round(acwr, 2),
                message=message
            ))

        # Monotony 说明
        if "monotony" in factor_values:
            monotony = factor_values["monotony"]
            if monotony < 1.5:
                message = "训练变化丰富"
            elif monotony < 2.0:
                message = "训练重复性略高"
            elif monotony < 2.5:
                message = "训练较为单调"
            else:
                message = "训练高度单调"
            factors.append(RiskFactorResult(
                factor_name="monotony",
                factor_value=round(monotony, 2),
                message=message
            ))

        # Form 说明
        if "form" in factor_values:
            form = factor_values["form"]
            if form > 10:
                message = "恢复充分，状态良好"
            elif form > -10:
                message = "训练平衡状态正常"
            elif form > -20:
                message = "疲劳有一定积累"
            else:
                message = "过度疲劳，恢复不足"
            factors.append(RiskFactorResult(
                factor_name="form",
                factor_value=round(form, 1),
                message=message
            ))

        return factors

    @staticmethod
    def calculate_acwr_risk(acwr: float) -> float:
        """
        计算 ACWR 的风险分数 0-1

        Args:
            acwr: ACWR 值

        Returns:
            float: 风险分数 0-1
        """
        if acwr is None:
            return 0.3

        # ACWR < 0.8 -> 0.1
        # 0.8-1.3 -> 0.1-0.3
        # 1.3-1.5 -> 0.3-0.6
        # > 1.5 -> 0.6-1.0
        if acwr <= 0.8:
            return 0.1
        elif acwr <= 1.3:
            return 0.1 + ((acwr - 0.8) / 0.5) * 0.2
        elif acwr <= 1.5:
            return 0.3 + ((acwr - 1.3) / 0.2) * 0.3
        else:
            return min(1.0, 0.6 + ((acwr - 1.5) / 0.5) * 0.4)

    @staticmethod
    def calculate_monotony_risk(monotony: float) -> float:
        """
        计算 Monotony 的风险分数 0-1

        Args:
            monotony: Monotony 值

        Returns:
            float: 风险分数 0-1
        """
        if monotony is None:
            return 0.3

        # < 1.5 -> 0.1
        # 1.5-2.0 -> 0.1-0.4
        # 2.0-2.5 -> 0.4-0.7
        # > 2.5 -> 0.7-1.0
        if monotony <= 1.5:
            return 0.1
        elif monotony <= 2.0:
            return 0.1 + ((monotony - 1.5) / 0.5) * 0.3
        elif monotony <= 2.5:
            return 0.4 + ((monotony - 2.0) / 0.5) * 0.3
        else:
            return min(1.0, 0.7 + ((monotony - 2.5) / 0.5) * 0.3)

    @staticmethod
    def calculate_form_risk(form: float) -> float:
        """
        计算 Form 的风险分数 0-1

        Args:
            form: Form 值 (CTL - ATL)

        Returns:
            float: 风险分数 0-1
        """
        if form is None:
            return 0.3

        # Form > 0 -> 0.1
        # 0 到 -10 -> 0.1-0.3
        # -10 到 -20 -> 0.3-0.6
        # < -20 -> 0.6-1.0
        if form >= 0:
            return 0.1
        elif form >= -10:
            return 0.1 + ((abs(form) / 10)) * 0.2
        elif form >= -20:
            return 0.3 + (((abs(form) - 10) / 10)) * 0.3
        else:
            return min(1.0, 0.6 + (((abs(form) - 20) / 10)) * 0.4)

    @staticmethod
    def calculate_strain_risk(strain: float, weekly_tss: float) -> float:
        """
        计算 Strain 的风险分数 0-1

        Args:
            strain: Strain 值 (weekly_tss * monotony)
            weekly_tss: 本周总 TSS

        Returns:
            float: 风险分数 0-1
        """
        if weekly_tss <= 0:
            return 0.1

        strain_ratio = strain / weekly_tss if weekly_tss > 0 else 1.0

        # strain_ratio < 1.5 -> 0.1
        # 1.5-2.0 -> 0.1-0.4
        # 2.0-2.5 -> 0.4-0.7
        # > 2.5 -> 0.7-1.0
        if strain_ratio <= 1.5:
            return 0.1
        elif strain_ratio <= 2.0:
            return 0.1 + ((strain_ratio - 1.5) / 0.5) * 0.3
        elif strain_ratio <= 2.5:
            return 0.4 + ((strain_ratio - 2.0) / 0.5) * 0.3
        else:
            return min(1.0, 0.7 + ((strain_ratio - 2.5) / 0.5) * 0.3)
