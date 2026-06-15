from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.activity import Activity, DailyAthleteState
from app.services.intervals_client import IntervalsIcuClient
from app.crud.activity import upsert_daily_state
from app.crud.user import get_connected_account, create_connected_account
from app.database import SessionLocal


class DataSyncService:
    """Intervals.icu 数据同步服务"""

    @staticmethod
    def sync_activities(
        db: Session,
        user_id: int,
        client: IntervalsIcuClient,
        days: int = 90
    ) -> dict:
        """同步活动数据"""
        start_date = datetime.now() - timedelta(days=days)
        activities = client.list_activities(start_date=start_date, limit=500)

        synced_count = 0
        for activity in activities:
            # 检查是否已存在
            existing = db.query(Activity).filter(
                Activity.user_id == user_id,
                Activity.provider_activity_id == activity.activity_id
            ).first()

            if existing:
                continue

            db_activity = Activity(
                user_id=user_id,
                provider_activity_id=activity.activity_id,
                sport=activity.type,
                start_time=activity.start_time,
                duration_seconds=activity.duration_seconds,
                distance_meters=activity.distance_meters,
                tss=activity.tss,
                intensity_factor=activity.intensity_factor,
                avg_hr=activity.avg_hr,
                max_hr=activity.max_hr,
                avg_power=activity.avg_power,
                normalized_power=activity.normalized_power,
                elevation_gain=activity.elevation_gain
            )
            db.add(db_activity)
            synced_count += 1

        db.commit()
        return {"synced": synced_count, "total": len(activities)}

    @staticmethod
    def sync_wellness(
        db: Session,
        user_id: int,
        client: IntervalsIcuClient,
        days: int = 90
    ) -> dict:
        """同步健康和体能数据（CTL, ATL, Form, 睡眠, HRV）"""
        wellness_data = client.get_wellness(days=days)

        synced_count = 0
        for item in wellness_data:
            if not item.date:
                continue

            try:
                date_obj = datetime.strptime(item.date, "%Y-%m-%d").date()
            except ValueError:
                continue

            upsert_daily_state(
                db,
                user_id=user_id,
                state_date=date_obj,
                fitness=item.ctl,
                fatigue=item.atl,
                form=item.form,
                sleep_score=item.sleep_score,
                sleep_seconds=item.sleep_seconds,
                hrv_score=item.hrv,
                hrv_sdnn=item.hrv_sdnn,
                resting_hr=item.resting_hr,
                weight=item.weight,
                subjective_fatigue=item.subjective_fatigue
            )
            synced_count += 1

        return {"synced": synced_count, "total": len(wellness_data)}

    @classmethod
    def sync_all(
        cls,
        db: Session,
        user_id: int,
        api_key: str,
        athlete_id: str,
        days: int = 90
    ) -> dict:
        """同步所有数据"""
        client = IntervalsIcuClient(api_key, athlete_id)

        activity_result = cls.sync_activities(db, user_id, client, days)
        wellness_result = cls.sync_wellness(db, user_id, client, days)

        return {
            "activities": activity_result,
            "wellness": wellness_result
        }


def sync_user_data(user_id: int, api_key: str, athlete_id: str, days: int = 90) -> dict:
    """用户数据同步入口（供 API 使用）"""
    db = SessionLocal()
    try:
        result = DataSyncService.sync_all(db, user_id, api_key, athlete_id, days)
        return result
    finally:
        db.close()
