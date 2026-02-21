from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime


class AnalyticsOverview(BaseModel):
    """DTO for admin dashboard overview statistics"""

    total_courses: int
    total_users: int
    total_events: int
    total_issues: int
    open_issues: int
    recent_events_count: int
    courses_created_this_week: int
    active_users_this_week: int


class CourseAnalytics(BaseModel):
    """DTO for course-specific analytics"""

    course_id: str
    course_title: str
    total_enrollments: int
    completion_rate: float
    average_progress: float
    quiz_attempts: int
    quiz_pass_rate: float
    last_activity: Optional[datetime]


class UserEngagementMetrics(BaseModel):
    """DTO for user engagement metrics"""

    total_users: int
    active_users_today: int
    active_users_this_week: int
    active_users_this_month: int
    average_session_duration: Optional[float]
    most_popular_courses: List[Dict[str, Any]]
    engagement_trend: List[Dict[str, Any]]


class EventStatistics(BaseModel):
    """DTO for event statistics"""

    total_events: int
    events_by_type: Dict[str, int]
    events_by_severity: Dict[str, int]
    recent_errors: int
    recent_warnings: int
