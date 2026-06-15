from pydantic import BaseModel
from typing import Optional


class UserSettingsUpdate(BaseModel):
    intervals_api_key: Optional[str] = None
    intervals_athlete_id: Optional[str] = None


class UserSettingsResponse(BaseModel):
    intervals_api_key: Optional[str] = None
    intervals_athlete_id: Optional[str] = None
    has_credentials: bool = False


class SyncSettingsUpdate(BaseModel):
    auto_sync: Optional[bool] = False
    sync_frequency: Optional[str] = "daily"
