from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List
from datetime import datetime, timedelta, timezone

from app.models import (
    EventDB,
    EventSeverity,
    IssueDB,
    IssueStatus,
    CourseDB,
    UserProgressDB,
)
from app.dto.analytics_dto import (
    AnalyticsOverview,
    CourseAnalytics,
    UserEngagementMetrics,
    EventStatistics,
)


class AnalyticsService:
    """Service for analytics and reporting"""

    @staticmethod
    async def get_overview(db: AsyncSession) -> AnalyticsOverview:
        """Get dashboard overview statistics"""
        # Total courses
        total_courses_result = await db.execute(select(func.count(CourseDB.id)))
        total_courses = total_courses_result.scalar_one()

        # Total events
        total_events_result = await db.execute(select(func.count(EventDB.id)))
        total_events = total_events_result.scalar_one()

        # Total issues
        total_issues_result = await db.execute(select(func.count(IssueDB.id)))
        total_issues = total_issues_result.scalar_one()

        # Open issues
        open_issues_result = await db.execute(
            select(func.count(IssueDB.id)).where(IssueDB.status == IssueStatus.OPEN)
        )
        open_issues = open_issues_result.scalar_one()

        # Recent events (last 24 hours)
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        recent_events_result = await db.execute(
            select(func.count(EventDB.id)).where(EventDB.created_at >= yesterday)
        )
        recent_events_count = recent_events_result.scalar_one()

        # Courses created this week
        week_ago = datetime.now(timezone.utc) - timedelta(days=7)
        courses_this_week_result = await db.execute(
            select(func.count(CourseDB.id)).where(CourseDB.created_at >= week_ago)
        )
        courses_created_this_week = courses_this_week_result.scalar_one()

        # For now, set total_users and active_users to 0 since we don't have user auth yet
        total_users = 0
        active_users_this_week = 0

        return AnalyticsOverview(
            total_courses=total_courses,
            total_users=total_users,
            total_events=total_events,
            total_issues=total_issues,
            open_issues=open_issues,
            recent_events_count=recent_events_count,
            courses_created_this_week=courses_created_this_week,
            active_users_this_week=active_users_this_week,
        )

    @staticmethod
    async def get_event_statistics(db: AsyncSession) -> EventStatistics:
        """Get event statistics"""
        # Total events
        total_events_result = await db.execute(select(func.count(EventDB.id)))
        total_events = total_events_result.scalar_one()

        # Events by type
        events_by_type_result = await db.execute(
            select(EventDB.event_type, func.count(EventDB.id)).group_by(
                EventDB.event_type
            )
        )
        events_by_type = {
            str(row[0].value): row[1] for row in events_by_type_result.all()
        }

        # Events by severity
        events_by_severity_result = await db.execute(
            select(EventDB.severity, func.count(EventDB.id)).group_by(EventDB.severity)
        )
        events_by_severity = {
            str(row[0].value): row[1] for row in events_by_severity_result.all()
        }

        # Recent errors and warnings (last 24 hours)
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        recent_errors_result = await db.execute(
            select(func.count(EventDB.id)).where(
                and_(
                    EventDB.created_at >= yesterday,
                    EventDB.severity == EventSeverity.ERROR,
                )
            )
        )
        recent_errors = recent_errors_result.scalar_one()

        recent_warnings_result = await db.execute(
            select(func.count(EventDB.id)).where(
                and_(
                    EventDB.created_at >= yesterday,
                    EventDB.severity == EventSeverity.WARNING,
                )
            )
        )
        recent_warnings = recent_warnings_result.scalar_one()

        return EventStatistics(
            total_events=total_events,
            events_by_type=events_by_type,
            events_by_severity=events_by_severity,
            recent_errors=recent_errors,
            recent_warnings=recent_warnings,
        )

    @staticmethod
    async def get_course_analytics(db: AsyncSession) -> List[CourseAnalytics]:
        """Get analytics for all courses"""
        courses_result = await db.execute(select(CourseDB))
        courses = courses_result.scalars().all()

        analytics_list = []
        for course in courses:
            # Count progress records for this course (proxy for enrollments)
            enrollments_result = await db.execute(
                select(func.count(UserProgressDB.id)).where(
                    UserProgressDB.course_id == course.id
                )
            )
            total_enrollments = enrollments_result.scalar_one()

            # Calculate average progress
            avg_progress_result = await db.execute(
                select(func.avg(UserProgressDB.overall_progress)).where(
                    UserProgressDB.course_id == course.id
                )
            )
            average_progress = avg_progress_result.scalar_one() or 0.0

            # Completion rate (progress >= 100%)
            completed_result = await db.execute(
                select(func.count(UserProgressDB.id)).where(
                    and_(
                        UserProgressDB.course_id == course.id,
                        UserProgressDB.overall_progress >= 100,
                    )
                )
            )
            completed_count = completed_result.scalar_one()
            completion_rate = (
                (completed_count / total_enrollments * 100)
                if total_enrollments > 0
                else 0.0
            )

            # Get last activity from events
            last_activity_result = await db.execute(
                select(func.max(EventDB.created_at)).where(
                    EventDB.resource_id == str(course.id)
                )
            )
            last_activity = last_activity_result.scalar_one()

            analytics_list.append(
                CourseAnalytics(
                    course_id=str(course.id),
                    course_title=course.title,
                    total_enrollments=total_enrollments,
                    completion_rate=round(completion_rate, 2),
                    average_progress=round(average_progress, 2),
                    quiz_attempts=0,  # Placeholder
                    quiz_pass_rate=0.0,  # Placeholder
                    last_activity=last_activity,
                )
            )

        return analytics_list

    @staticmethod
    async def get_user_engagement(db: AsyncSession) -> UserEngagementMetrics:
        """Get user engagement metrics"""
        # Since we don't have user authentication yet, return placeholder data
        # This will be populated once user auth is implemented

        # Get most popular courses by enrollment count
        popular_courses_result = await db.execute(
            select(
                CourseDB.id,
                CourseDB.title,
                func.count(UserProgressDB.id).label("enrollment_count"),
            )
            .join(UserProgressDB, CourseDB.id == UserProgressDB.course_id, isouter=True)
            .group_by(CourseDB.id, CourseDB.title)
            .order_by(func.count(UserProgressDB.id).desc())
            .limit(5)
        )
        popular_courses = [
            {"course_id": str(row[0]), "title": row[1], "enrollments": row[2]}
            for row in popular_courses_result.all()
        ]

        return UserEngagementMetrics(
            total_users=0,
            active_users_today=0,
            active_users_this_week=0,
            active_users_this_month=0,
            average_session_duration=None,
            most_popular_courses=popular_courses,
            engagement_trend=[],
        )
