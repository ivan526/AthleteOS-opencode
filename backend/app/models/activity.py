from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Date
from sqlalchemy.sql import func
from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    provider_activity_id = Column(String, index=True)
    sport = Column(String)
    start_time = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    distance_meters = Column(Float)
    tss = Column(Float)
    intensity_factor = Column(Float)
    avg_hr = Column(Float)
    max_hr = Column(Float)
    avg_power = Column(Float)
    normalized_power = Column(Float)
    avg_pace = Column(Float)
    elevation_gain = Column(Float)
    raw_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DailyAthleteState(Base):
    __tablename__ = "daily_athlete_states"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    date = Column(Date, index=True)
    data_level = Column(String, default="B")
    fitness = Column(Float)
    fatigue = Column(Float)
    form = Column(Float)
    sleep_score = Column(Float)
    hrv_score = Column(Float)
    acwr = Column(Float)
    monotony = Column(Float)
    strain = Column(Float)
    adherence = Column(Float)
    subjective_fatigue = Column(Float)
    training_capacity = Column(Float)
    capacity_status = Column(String)
    training_risk_score = Column(Float)
    training_risk_level = Column(String)
    confidence = Column(Float)
    state_json = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
