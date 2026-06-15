from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, JSON
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String, nullable=True)
    intervals_api_key = Column(String, nullable=True)
    intervals_athlete_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AthleteProfile(Base):
    __tablename__ = "athlete_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    primary_sport = Column(String, default="running")
    timezone = Column(String, default="Asia/Shanghai")
    birth_year = Column(Integer)
    sex = Column(String)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    provider = Column(String, nullable=False)
    access_token = Column(String)
    refresh_token = Column(String)
    provider_user_id = Column(String)
    last_sync_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
