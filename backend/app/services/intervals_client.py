import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class IntervalsAthlete:
    athlete_id: str
    name: str
    ftp: Optional[float] = None
    weight: Optional[float] = None
    resting_hr: Optional[float] = None


@dataclass
class IntervalsActivity:
    activity_id: str
    name: str
    type: str
    start_time: datetime
    duration_seconds: float
    distance_meters: Optional[float] = None
    tss: Optional[float] = None
    intensity_factor: Optional[float] = None
    avg_hr: Optional[float] = None
    max_hr: Optional[float] = None
    avg_power: Optional[float] = None
    normalized_power: Optional[float] = None
    elevation_gain: Optional[float] = None


@dataclass
class IntervalsDailyData:
    date: str
    ctl: Optional[float] = None
    atl: Optional[float] = None
    form: Optional[float] = None
    sleep_score: Optional[float] = None
    sleep_seconds: Optional[float] = None
    hrv_sdnn: Optional[float] = None
    hrv: Optional[float] = None
    resting_hr: Optional[float] = None
    weight: Optional[float] = None
    subjective_fatigue: Optional[float] = None


class IntervalsIcuClient:
    """Intervals.icu API 客户端"""

    BASE_URL = "https://intervals.icu/api/v1"

    def __init__(self, api_key: str, athlete_id: str):
        self.api_key = api_key
        self.athlete_id = athlete_id
        self.session = requests.Session()
        self.session.auth = ("API_KEY", api_key)

    def get_athlete(self) -> IntervalsAthlete:
        """获取运动员基本信息"""
        url = f"{self.BASE_URL}/athlete/{self.athlete_id}"
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        return IntervalsAthlete(
            athlete_id=str(data.get("id", "")),
            name=data.get("name", ""),
            ftp=data.get("ftp"),
            weight=data.get("weightKg"),
            resting_hr=data.get("restingHr")
        )

    def list_activities(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[IntervalsActivity]:
        """获取活动列表"""
        if start_date is None:
            start_date = datetime.now() - timedelta(days=90)
        if end_date is None:
            end_date = datetime.now()

        url = f"{self.BASE_URL}/athlete/{self.athlete_id}/activities"
        params = {
            "oldest": start_date.strftime("%Y-%m-%d"),
            "newest": end_date.strftime("%Y-%m-%d")
        }

        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        data_list = response.json()

        activities = []
        for data in data_list:
            start_time = datetime.fromisoformat(data["start_date"].replace("Z", "+00:00"))
            activities.append(IntervalsActivity(
                activity_id=str(data.get("id", "")),
                name=data.get("name", ""),
                type=data.get("type", ""),
                start_time=start_time,
                duration_seconds=data.get("moving_time", 0),
                distance_meters=data.get("distance"),
                tss=data.get("icu_training_load"),
                intensity_factor=data.get("icu_intensity"),
                avg_hr=data.get("average_heartrate"),
                max_hr=data.get("max_heartrate"),
                avg_power=data.get("icu_average_watts"),
                normalized_power=None,
                elevation_gain=data.get("total_elevation_gain")
            ))

        return activities

    def get_wellness(self, start_date: Optional[datetime] = None, days: int = 90) -> List[IntervalsDailyData]:
        """获取健康和体能数据"""
        if start_date is None:
            start_date = datetime.now() - timedelta(days=days)
        end_date = start_date + timedelta(days=days)

        url = f"{self.BASE_URL}/athlete/{self.athlete_id}/wellness"
        params = {
            "oldest": start_date.strftime("%Y-%m-%d"),
            "newest": end_date.strftime("%Y-%m-%d")
        }

        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        data_list = response.json()

        daily_data = []
        for data in data_list:
            daily_data.append(IntervalsDailyData(
                date=data.get("id", ""),
                ctl=data.get("ctl"),
                atl=data.get("atl"),
                form=data.get("form"),
                sleep_score=data.get("sleepScore"),
                sleep_seconds=data.get("sleepSecs"),
                hrv_sdnn=data.get("hrvSDNN"),
                hrv=data.get("hrvSDNN"),
                resting_hr=data.get("restingHR"),
                weight=data.get("weight"),
                subjective_fatigue=data.get("fatigue")
            ))

        return daily_data


def create_client(api_key: str, athlete_id: str) -> IntervalsIcuClient:
    """创建 Intervals.icu 客户端"""
    return IntervalsIcuClient(api_key, athlete_id)
