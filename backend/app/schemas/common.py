from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import date, datetime


class CapacityStatus(str, Enum):
    READY_TO_PUSH = "ready_to_push"
    TRAIN_NORMALLY = "train_normally"
    REDUCE_INTENSITY = "reduce_intensity"
    RECOVERY_REQUIRED = "recovery_required"


class RiskLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    ELEVATED = "elevated"
    HIGH_CAUTION = "high_caution"


class DataQuality(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INSUFFICIENT = "insufficient"


class IntensityLevel(str, Enum):
    EASY = "easy"
    MODERATE = "moderate"
    HARD = "hard"
    RECOVERY = "recovery"


class SportType(str, Enum):
    RUNNING = "running"
    CYCLING = "cycling"
    STRENGTH = "strength"
    RECOVERY = "recovery"
