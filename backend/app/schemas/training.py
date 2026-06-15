from pydantic import BaseModel, Field
from datetime import date
from app.schemas.common import (
    CapacityStatus, RiskLevel, DataQuality, IntensityLevel, SportType
)


class RiskFactor(BaseModel):
    factor_name: str
    factor_value: float
    message: str


class TrainingCapacity(BaseModel):
    score: float = Field(..., ge=0, le=100)
    status: CapacityStatus
    status_text: str
    confidence: float = Field(..., ge=0, le=1)
    data_quality: DataQuality
    trend: float
    dimension_scores: dict[str, float]


class TrainingRisk(BaseModel):
    score: float = Field(..., ge=0, le=1)
    level: RiskLevel
    user_label: str
    confidence: float = Field(..., ge=0, le=1)
    data_quality: DataQuality
    main_factors: list[RiskFactor]
    safe_recommendation: str


class WorkoutStructure(BaseModel):
    warmup: str | None = None
    main_set: str | None = None
    cooldown: str | None = None


class WorkoutRecommendation(BaseModel):
    sport: SportType
    workout_type: str
    title: str
    duration_minutes: int = Field(..., gt=0)
    expected_tss: float = Field(..., gt=0)
    intensity: IntensityLevel
    structure: WorkoutStructure | None = None


class ExplanationItem(BaseModel):
    item_id: str
    text: str
    item_type: str


class ProfessionalDetail(BaseModel):
    label: str
    numeric_value: float
    unit: str | None = None
    description_text: str


class DailyDataResponse(BaseModel):
    date_val: date
    training_capacity: TrainingCapacity
    training_risk: TrainingRisk
    recommendation: WorkoutRecommendation
    explanations: list[ExplanationItem]
    professional_details: list[ProfessionalDetail]


class HistoryDataPoint(BaseModel):
    date_val: date
    ctl: float
    atl: float
    form_value: float
    tss: float


class WeeklyReviewResponse(BaseModel):
    week_start: date
    week_end: date
    summary: str
    adherence: float = Field(..., ge=0, le=1)
    weekly_tss: float
    load_change_vs_last_week: float
    training_risk_level: RiskLevel
    highlights: list[str]
    warnings: list[str]
    next_week_recommendation: str
