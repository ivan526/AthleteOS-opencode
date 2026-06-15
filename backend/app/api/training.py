from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.training import (
    DailyDataResponse,
    HistoryDataPoint,
    WeeklyReviewResponse
)
from app.services.training_service import TrainingDataService

router = APIRouter(prefix="/training", tags=["training"])


@router.get("/today", response_model=DailyDataResponse)
async def get_today_data(
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    获取今日训练数据

    - 训练能力评分 (Training Capacity)
    - 训练风险评估 (Training Risk)
    - 今日训练建议
    - 简洁解释列表
    - 专业详情指标
    """
    service = TrainingDataService(db)
    return service.generate_today_data(user_id)


@router.get("/history", response_model=List[HistoryDataPoint])
async def get_history_data(
    user_id: int = 1,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    获取历史负荷数据

    - CTL: 长期训练负荷
    - ATL: 短期疲劳
    - Form: 训练平衡 = CTL - ATL
    - TSS: 每日训练压力
    """
    service = TrainingDataService(db)
    return service.get_history_data(user_id, days)


@router.get("/weekly-review", response_model=WeeklyReviewResponse)
async def get_weekly_review(
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    获取本周训练复盘

    - 本周总结
    - 训练完成率
    - 周负荷变化
    - 训练亮点
    - 注意事项
    - 下周建议
    """
    service = TrainingDataService(db)
    return service.get_weekly_review(user_id)
