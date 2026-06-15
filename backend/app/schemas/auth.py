from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class ConnectedAccountCreate(BaseModel):
    provider: str
    access_token: str
    refresh_token: Optional[str] = None
    provider_user_id: Optional[str] = None


class ConnectedAccountResponse(BaseModel):
    id: int
    provider: str
    provider_user_id: Optional[str]
    last_sync_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)
