from pydantic import BaseModel, Field
from datetime import date, datetime
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
    training_capacity: float | None
    resting_hr: float | None
    weight: float | None


class ActivityResponse(BaseModel):
    id: int
    provider_activity_id: str | None
    sport: str | None
    start_time: datetime
    duration_seconds: int | None
    distance_meters: float | None
    tss: float | None
    intensity_factor: float | None
    avg_hr: float | None
    max_hr: float | None
    avg_power: float | None
    normalized_power: float | None
    avg_pace: float | None
    elevation_gain: float | None

    class Config:
        from_attributes = True


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


class DailyStateUpdate(BaseModel):
    date_val: date
    sleep_quality: float | None = Field(None, ge=1, le=10, description="睡眠质量 1-10")
    subjective_fatigue: float | None = Field(None, ge=1, le=10, description="主观疲劳 1-10")
    muscle_soreness: float | None = Field(None, ge=1, le=10, description="肌肉酸痛 1-10")
    stress_level: float | None = Field(None, ge=1, le=10, description="压力水平 1-10")
    mood: float | None = Field(None, ge=1, le=10, description="情绪状态 1-10")
    readiness_manual: float | None = Field(None, ge=1, le=10, description="自评状态 1-10")
    resting_hr: float | None = Field(None, ge=30, le=200, description="静息心率")
    hrv_sdnn: float | None = Field(None, description="HRV SDNN")
    weight: float | None = Field(None, description="体重 kg")
    notes: str | None = Field(None, max_length=500, description="备注")


class DailyStateResponse(BaseModel):
    date_val: date
    sleep_quality: float | None
    subjective_fatigue: float | None
    muscle_soreness: float | None
    stress_level: float | None
    mood: float | None
    readiness_manual: float | None
    resting_hr: float | None
    hrv_sdnn: float | None
    weight: float | None
    notes: str | None
    training_capacity: float | None
    training_risk_level: str | None

    class Config:
        from_attributes = True


class UserFeedbackRequest(BaseModel):
    feedback_type: str
    date_val: date | None = None


class AdjustedRecommendationResponse(BaseModel):
    success: bool
    original_type: str
    adjusted_type: str
    title: str
    duration_minutes: int
    intensity: str
    reason: str
    training_capacity_impact: float
