from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import date, datetime, timedelta
from app.models.activity import Activity, DailyAthleteState
from typing import List


def get_activities(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Activity]:
    return db.query(Activity).filter(
        Activity.user_id == user_id
    ).order_by(desc(Activity.start_time)).offset(skip).limit(limit).all()


def get_activities_in_range(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date
) -> List[Activity]:
    return db.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.start_time >= datetime.combine(start_date, datetime.min.time()),
        Activity.start_time <= datetime.combine(end_date, datetime.max.time())
    ).order_by(desc(Activity.start_time)).all()


def create_activity(
    db: Session,
    user_id: int,
    provider_activity_id: str | None = None,
    **kwargs
) -> Activity:
    db_activity = Activity(
        user_id=user_id,
        provider_activity_id=provider_activity_id,
        **kwargs
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


def get_daily_state(
    db: Session,
    user_id: int,
    state_date: date
) -> DailyAthleteState | None:
    return db.query(DailyAthleteState).filter(
        DailyAthleteState.user_id == user_id,
        DailyAthleteState.date == state_date
    ).first()


def get_daily_states_in_range(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date
) -> List[DailyAthleteState]:
    return db.query(DailyAthleteState).filter(
        DailyAthleteState.user_id == user_id,
        DailyAthleteState.date >= start_date,
        DailyAthleteState.date <= end_date
    ).order_by(DailyAthleteState.date).all()


def upsert_daily_state(
    db: Session,
    user_id: int,
    state_date: date,
    **kwargs
) -> DailyAthleteState:
    db_state = get_daily_state(db, user_id, state_date)
    if db_state:
        for key, value in kwargs.items():
            setattr(db_state, key, value)
        db.commit()
        db.refresh(db_state)
        return db_state
    else:
        db_state = DailyAthleteState(
            user_id=user_id,
            date=state_date,
            **kwargs
        )
        db.add(db_state)
        db.commit()
        db.refresh(db_state)
        return db_state


def get_recent_daily_states(
    db: Session,
    user_id: int,
    days: int = 30
) -> List[DailyAthleteState]:
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    return get_daily_states_in_range(db, user_id, start_date, end_date)


def get_daily_tss_for_acwr(
    db: Session,
    user_id: int,
    days: int = 28
) -> List[float]:
    """获取 ACWR 计算所需的每日 TSS 数据"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    activities = get_activities_in_range(db, user_id, start_date, end_date)
    daily_tss = []
    for i in range(days):
        target_date = end_date - timedelta(days=i)
        day_tss = sum(
            a.tss or 0 for a in activities
            if a.start_time and a.start_time.date() == target_date
        )
        daily_tss.append(day_tss)
    return daily_tss
