from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import get_db
from app.schemas.training import (
    DailyDataResponse,
    HistoryDataPoint,
    WeeklyReviewResponse,
    ActivityResponse,
    DailyStateUpdate,
    DailyStateResponse,
    UserFeedbackRequest,
    AdjustedRecommendationResponse
)
from app.services.training_service import TrainingDataService
from app.crud.activity import get_activities_in_range, get_daily_state, update_daily_wellness_state

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


@router.get("/activities", response_model=List[ActivityResponse])
async def get_activities(
    user_id: int = 1,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    获取指定天数内的活动列表

    - 返回有实际训练数据的活动
    - 按时间倒序排列（最新的在前）
    """
    today = date.today()
    start_date = today - timedelta(days=days)
    activities = get_activities_in_range(db, user_id, start_date, today)
    return sorted(activities, key=lambda a: a.start_time, reverse=True)


@router.get("/daily-state/{date_val}", response_model=DailyStateResponse)
async def get_daily_state_data(
    date_val: date,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """获取指定日期的用户状态数据"""
    state = get_daily_state(db, user_id, date_val)
    if state:
        return DailyStateResponse(
            date_val=state.date,
            sleep_quality=state.sleep_quality,
            subjective_fatigue=state.subjective_fatigue,
            muscle_soreness=state.muscle_soreness,
            stress_level=state.stress_level,
            mood=state.mood,
            readiness_manual=state.readiness_manual,
            resting_hr=state.resting_hr,
            hrv_sdnn=state.hrv_sdnn,
            weight=state.weight,
            notes=state.notes,
            training_capacity=state.training_capacity,
            training_risk_level=state.training_risk_level
        )
    return DailyStateResponse(
        date_val=date_val,
        sleep_quality=None,
        subjective_fatigue=None,
        muscle_soreness=None,
        stress_level=None,
        mood=None,
        readiness_manual=None,
        resting_hr=None,
        hrv_sdnn=None,
        weight=None,
        notes=None,
        training_capacity=None,
        training_risk_level=None
    )


@router.put("/daily-state", response_model=DailyStateResponse)
async def update_daily_state(
    data: DailyStateUpdate,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """更新用户每日状态（主观录入 + 指标）"""
    state = update_daily_wellness_state(
        db,
        user_id=user_id,
        date_val=data.date_val,
        sleep_quality=data.sleep_quality,
        subjective_fatigue=data.subjective_fatigue,
        muscle_soreness=data.muscle_soreness,
        stress_level=data.stress_level,
        mood=data.mood,
        readiness_manual=data.readiness_manual,
        resting_hr=data.resting_hr,
        hrv_sdnn=data.hrv_sdnn,
        weight=data.weight,
        notes=data.notes
    )
    
    service = TrainingDataService(db)
    service.generate_today_data(user_id)
    
    updated_state = get_daily_state(db, user_id, data.date_val)
    return DailyStateResponse(
        date_val=updated_state.date,
        sleep_quality=updated_state.sleep_quality,
        subjective_fatigue=updated_state.subjective_fatigue,
        muscle_soreness=updated_state.muscle_soreness,
        stress_level=updated_state.stress_level,
        mood=updated_state.mood,
        readiness_manual=updated_state.readiness_manual,
        resting_hr=updated_state.resting_hr,
        hrv_sdnn=updated_state.hrv_sdnn,
        weight=updated_state.weight,
        notes=updated_state.notes,
        training_capacity=updated_state.training_capacity,
        training_risk_level=updated_state.training_risk_level
    )


@router.post("/feedback", response_model=AdjustedRecommendationResponse)
async def submit_user_feedback(
    feedback: UserFeedbackRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    提交用户反馈并动态调整训练建议
    
    反馈类型:
    - as_planned: 按计划训练
    - too_tired: 太累了
    - no_time: 没时间
    - legs_sore: 腿部不适
    - switch_cycle: 换成骑行
    - rest_day: 今天休息
    """
    service = TrainingDataService(db)
    today_data = service.generate_today_data(user_id)
    original_type = today_data.recommendation.sport
    
    # 根据反馈类型调整训练建议
    adjustments = {
        'as_planned': {
            'adjusted_type': original_type,
            'title': today_data.recommendation.title,
            'duration': today_data.recommendation.duration_minutes,
            'intensity': today_data.recommendation.intensity,
            'reason': '保持原计划训练',
            'capacity_impact': 0.0
        },
        'too_tired': {
            'adjusted_type': 'recovery',
            'title': '轻松恢复跑',
            'duration': max(20, today_data.recommendation.duration_minutes // 2),
            'intensity': 'easy',
            'reason': '检测到疲劳，降低训练强度和时长',
            'capacity_impact': -5.0
        },
        'no_time': {
            'adjusted_type': original_type,
            'title': '30分钟高效训练',
            'duration': 30,
            'intensity': 'moderate',
            'reason': '压缩训练时长，保持中等强度',
            'capacity_impact': -2.0
        },
        'legs_sore': {
            'adjusted_type': 'recovery',
            'title': '低冲击交叉训练',
            'duration': 40,
            'intensity': 'very_easy',
            'reason': '腿部不适，建议游泳或自行车低强度恢复',
            'capacity_impact': -8.0
        },
        'switch_cycle': {
            'adjusted_type': 'cycling',
            'title': '自行车耐力训练',
            'duration': int(today_data.recommendation.duration_minutes * 1.2),
            'intensity': today_data.recommendation.intensity,
            'reason': '切换为骑行，保持心率区间',
            'capacity_impact': 0.0
        },
        'rest_day': {
            'adjusted_type': 'rest',
            'title': '完全休息日',
            'duration': 0,
            'intensity': 'none',
            'reason': '选择休息，促进身体恢复',
            'capacity_impact': 5.0
        }
    }
    
    adj = adjustments.get(feedback.feedback_type, adjustments['as_planned'])
    
    return AdjustedRecommendationResponse(
        success=True,
        original_type=original_type,
        adjusted_type=adj['adjusted_type'],
        title=adj['title'],
        duration_minutes=adj['duration'],
        intensity=adj['intensity'],
        reason=adj['reason'],
        training_capacity_impact=adj['capacity_impact']
    )
