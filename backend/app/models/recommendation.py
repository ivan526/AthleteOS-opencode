from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Date
from sqlalchemy.sql import func
from app.database import Base


class DailyRecommendation(Base):
    __tablename__ = "daily_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    date = Column(Date, index=True)
    day_type = Column(String)
    sport = Column(String)
    workout_type = Column(String)
    title = Column(String)
    duration_minutes = Column(Integer)
    expected_tss = Column(Float)
    intensity = Column(String)
    workout_structure = Column(JSON)
    decision_json = Column(JSON)
    user_friendly_reason = Column(String)
    technical_reason = Column(String)
    confidence = Column(Float)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class WeeklyReview(Base):
    __tablename__ = "weekly_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    week_start = Column(Date)
    week_end = Column(Date)
    adherence = Column(Float)
    weekly_tss = Column(Float)
    load_change = Column(Float)
    training_risk_level = Column(String)
    summary = Column(String)
    highlights = Column(JSON)
    warnings = Column(JSON)
    next_week_recommendation = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
