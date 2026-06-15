from pydantic import BaseModel, Field
from app.schemas.common import (
    CapacityStatus, RiskLevel, DataQuality, IntensityLevel, SportType
)
from typing import Optional, List
from datetime import date

print("Testing classes one by one...")

class RiskFactorTest(BaseModel):
    factor_name: str = Field(...)
    factor_value: float = Field(...)
    message: str = Field(...)
print("1. RiskFactorTest OK")

class TrainingCapacityTest(BaseModel):
    score: float = Field(..., ge=0, le=100)
    status: CapacityStatus = Field(...)
    status_text: str = Field(...)
    confidence: float = Field(..., ge=0, le=1)
    data_quality: DataQuality = Field(...)
    trend: float = Field(...)
    dimension_scores: dict[str, float] = Field(...)
print("2. TrainingCapacityTest OK")

class TrainingRiskTest(BaseModel):
    score: float = Field(..., ge=0, le=1)
    level: RiskLevel = Field(...)
    user_label: str = Field(...)
    confidence: float = Field(..., ge=0, le=1)
    data_quality: DataQuality = Field(...)
    main_factors: List[RiskFactorTest] = Field(...)
    safe_recommendation: str = Field(...)
print("3. TrainingRiskTest OK")

class WorkoutStructureTest(BaseModel):
    warmup: Optional[str] = Field(None)
    main_set: Optional[str] = Field(None)
    cooldown: Optional[str] = Field(None)
print("4. WorkoutStructureTest OK")

class WorkoutRecommendationTest(BaseModel):
    sport: SportType = Field(...)
    workout_type: str = Field(...)
    title: str = Field(...)
    duration_minutes: int = Field(..., gt=0)
    expected_tss: float = Field(..., gt=0)
    intensity: IntensityLevel = Field(...)
    structure: Optional[WorkoutStructureTest] = Field(None)
print("5. WorkoutRecommendationTest OK")

class ExplanationItemTest(BaseModel):
    item_id: str = Field(...)
    text: str = Field(...)
    item_type: str = Field(...)
print("6. ExplanationItemTest OK")

class ProfessionalDetailTest(BaseModel):
    label: str = Field(...)
    numeric_value: float = Field(...)
    unit: Optional[str] = Field(None)
    description_text: str = Field(...)
print("7. ProfessionalDetailTest OK")

class HistoryDataPointTest(BaseModel):
    date: date = Field(...)
    ctl: float = Field(...)
    atl: float = Field(...)
    form_value: float = Field(...)
    tss: float = Field(...)
print("8. HistoryDataPointTest OK")

class WeeklyReviewResponseTest(BaseModel):
    week_start: date = Field(...)
    week_end: date = Field(...)
    summary: str = Field(...)
    adherence: float = Field(..., ge=0, le=1)
    weekly_tss: float = Field(...)
    load_change_vs_last_week: float = Field(...)
    training_risk_level: RiskLevel = Field(...)
    highlights: List[str] = Field(...)
    warnings: List[str] = Field(...)
    next_week_recommendation: str = Field(...)
print("9. WeeklyReviewResponseTest OK")

class DailyDataResponseTest(BaseModel):
    date: date = Field(...)
    training_capacity: TrainingCapacityTest = Field(...)
    training_risk: TrainingRiskTest = Field(...)
    recommendation: WorkoutRecommendationTest = Field(...)
    explanations: List[ExplanationItemTest] = Field(...)
    professional_details: List[ProfessionalDetailTest] = Field(...)
print("10. DailyDataResponseTest OK")

print("\nAll classes OK!")
