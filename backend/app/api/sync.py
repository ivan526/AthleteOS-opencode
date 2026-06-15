from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.sync_service import sync_user_data

router = APIRouter(prefix="/sync", tags=["sync"])


class SyncRequest(BaseModel):
    api_key: str
    athlete_id: str
    days: int = 90


class SyncResponse(BaseModel):
    success: bool
    message: str
    activities: dict | None = None
    wellness: dict | None = None


@router.post("/intervals-icu", response_model=SyncResponse)
async def sync_intervals_icu(
    request: SyncRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    从 Intervals.icu 同步数据"""
    try:
        result = sync_user_data(
            user_id=user_id,
            api_key=request.api_key,
            athlete_id=request.athlete_id,
            days=request.days
        )
        return SyncResponse(
            success=True,
            message="同步完成",
            **result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_sync_status(user_id: int = 1, db: Session = Depends(get_db)):
    """获取同步状态"""
    from app.models.activity import Activity, DailyAthleteState
    from sqlalchemy import func

    activity_count = db.query(func.count(Activity.id)).filter(
        Activity.user_id == user_id
    ).scalar()

    state_count = db.query(func.count(DailyAthleteState.id)).filter(
        DailyAthleteState.user_id == user_id
    ).scalar()

    latest_activity = db.query(Activity).filter(
        Activity.user_id == user_id
    ).order_by(Activity.start_time.desc()).first()

    return {
        "activity_count": activity_count,
        "daily_state_count": state_count,
        "latest_activity_date": latest_activity.start_time.isoformat() if latest_activity else None
    }
