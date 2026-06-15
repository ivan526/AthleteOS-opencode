from sqlalchemy.orm import Session
from app.models.user import User, AthleteProfile, ConnectedAccount
from datetime import datetime


def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, email: str, name: str | None = None) -> User:
    db_user = User(email=email, name=name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_or_create_user(db: Session, email: str, name: str | None = None) -> User:
    user = get_user_by_email(db, email)
    if user:
        return user
    return create_user(db, email, name)


def get_athlete_profile(db: Session, user_id: int) -> AthleteProfile | None:
    return db.query(AthleteProfile).filter(AthleteProfile.user_id == user_id).first()


def create_athlete_profile(
    db: Session,
    user_id: int,
    primary_sport: str = "running",
    timezone: str = "Asia/Shanghai",
    **kwargs
) -> AthleteProfile:
    db_profile = AthleteProfile(
        user_id=user_id,
        primary_sport=primary_sport,
        timezone=timezone,
        **kwargs
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_connected_account(db: Session, user_id: int, provider: str) -> ConnectedAccount | None:
    return db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user_id,
        ConnectedAccount.provider == provider
    ).first()


def create_connected_account(
    db: Session,
    user_id: int,
    provider: str,
    access_token: str | None = None,
    refresh_token: str | None = None,
    provider_user_id: str | None = None
) -> ConnectedAccount:
    db_account = ConnectedAccount(
        user_id=user_id,
        provider=provider,
        access_token=access_token,
        refresh_token=refresh_token,
        provider_user_id=provider_user_id
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def update_connected_account(
    db: Session,
    account_id: int,
    **kwargs
) -> ConnectedAccount | None:
    db_account = db.query(ConnectedAccount).filter(ConnectedAccount.id == account_id).first()
    if db_account:
        for key, value in kwargs.items():
            setattr(db_account, key, value)
        db_account.last_sync_at = datetime.utcnow()
        db.commit()
        db.refresh(db_account)
    return db_account


def update_user_settings(
    db: Session,
    user_id: int,
    intervals_api_key: str | None = None,
    intervals_athlete_id: str | None = None
) -> User | None:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        if intervals_api_key is not None:
            db_user.intervals_api_key = intervals_api_key
        if intervals_athlete_id is not None:
            db_user.intervals_athlete_id = intervals_athlete_id
        db.commit()
        db.refresh(db_user)
    return db_user


def get_user_settings(db: Session, user_id: int) -> dict | None:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        return {
            "intervals_api_key": db_user.intervals_api_key,
            "intervals_athlete_id": db_user.intervals_athlete_id,
            "has_credentials": bool(db_user.intervals_api_key and db_user.intervals_athlete_id)
        }
    return None
