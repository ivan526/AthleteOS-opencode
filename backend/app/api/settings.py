from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.crud.user import update_user_settings, get_user_settings
from app.schemas.settings import UserSettingsUpdate, UserSettingsResponse
from app.services.sync_service import sync_user_data

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=UserSettingsResponse)
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户设置"""
    settings = get_user_settings(db, current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="User not found")
    return settings


@router.put("", response_model=UserSettingsResponse)
async def update_settings(
    settings_data: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户设置"""
    updated_user = update_user_settings(
        db,
        user_id=current_user.id,
        intervals_api_key=settings_data.intervals_api_key,
        intervals_athlete_id=settings_data.intervals_athlete_id
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "intervals_api_key": updated_user.intervals_api_key,
        "intervals_athlete_id": updated_user.intervals_athlete_id,
        "has_credentials": bool(updated_user.intervals_api_key and updated_user.intervals_athlete_id)
    }


@router.post("/sync")
async def sync_with_saved_credentials(
    days: int = 90,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """使用已保存的凭据进行数据同步"""
    if not current_user.intervals_api_key or not current_user.intervals_athlete_id:
        raise HTTPException(
            status_code=400,
            detail="Intervals.icu credentials not configured. Please save API Key and Athlete ID first."
        )
    
    try:
        result = sync_user_data(
            user_id=current_user.id,
            api_key=current_user.intervals_api_key,
            athlete_id=current_user.intervals_athlete_id,
            days=days
        )
        return {
            "success": True,
            "message": "数据同步成功",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
