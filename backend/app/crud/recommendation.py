from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import date, timedelta
from app.models.recommendation import DailyRecommendation, WeeklyReview
from typing import List


def get_daily_recommendation(
    db: Session,
    user_id: int,
    recommendation_date: date
) -> DailyRecommendation | None:
    return db.query(DailyRecommendation).filter(
        DailyRecommendation.user_id == user_id,
        DailyRecommendation.date == recommendation_date
    ).first()


def create_daily_recommendation(
    db: Session,
    user_id: int,
    **kwargs
) -> DailyRecommendation:
    db_recommendation = DailyRecommendation(
        user_id=user_id,
        **kwargs
    )
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation


def upsert_daily_recommendation(
    db: Session,
    user_id: int,
    recommendation_date: date,
    **kwargs
) -> DailyRecommendation:
    db_recommendation = get_daily_recommendation(db, user_id, recommendation_date)
    if db_recommendation:
        for key, value in kwargs.items():
            setattr(db_recommendation, key, value)
        db.commit()
        db.refresh(db_recommendation)
        return db_recommendation
    else:
        return create_daily_recommendation(
            db, user_id, date=recommendation_date, **kwargs
        )


def get_recent_recommendations(
    db: Session,
    user_id: int,
    days: int = 7
) -> List[DailyRecommendation]:
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    return db.query(DailyRecommendation).filter(
        DailyRecommendation.user_id == user_id,
        DailyRecommendation.date >= start_date,
        DailyRecommendation.date <= end_date
    ).order_by(desc(DailyRecommendation.date)).all()


def get_weekly_review(
    db: Session,
    user_id: int,
    week_start: date
) -> WeeklyReview | None:
    return db.query(WeeklyReview).filter(
        WeeklyReview.user_id == user_id,
        WeeklyReview.week_start == week_start
    ).first()


def create_weekly_review(
    db: Session,
    user_id: int,
    **kwargs
) -> WeeklyReview:
    db_review = WeeklyReview(
        user_id=user_id,
        **kwargs
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


def upsert_weekly_review(
    db: Session,
    user_id: int,
    week_start: date,
    **kwargs
) -> WeeklyReview:
    db_review = get_weekly_review(db, user_id, week_start)
    if db_review:
        for key, value in kwargs.items():
            setattr(db_review, key, value)
        db.commit()
        db.refresh(db_review)
        return db_review
    else:
        return create_weekly_review(
            db, user_id, week_start=week_start, **kwargs
        )


def get_recent_weekly_reviews(
    db: Session,
    user_id: int,
    weeks: int = 4
) -> List[WeeklyReview]:
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    start_date = week_start - timedelta(weeks=weeks)
    return db.query(WeeklyReview).filter(
        WeeklyReview.user_id == user_id,
        WeeklyReview.week_start >= start_date
    ).order_by(desc(WeeklyReview.week_start)).all()
