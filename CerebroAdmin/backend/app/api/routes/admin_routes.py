from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.api.dependencies import get_db
from app.services.event_service import EventService
from app.services.issue_service import IssueService
from app.services.analytics_service import AnalyticsService
from app.dto.event_dto import EventCreate, EventResponse, EventFilter
from app.dto.issue_dto import IssueCreate, IssueUpdate, IssueResponse, IssueFilter
from app.dto.analytics_dto import (
    AnalyticsOverview,
    CourseAnalytics,
    UserEngagementMetrics,
    EventStatistics,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# Event endpoints
@router.post("/events", response_model=EventResponse)
async def create_event(event_data: EventCreate, db: AsyncSession = Depends(get_db)):
    """Create a new event"""
    return await EventService.create_event(db, event_data)


@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific event by ID"""
    event = await EventService.get_event(db, str(event_id))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.get("/events", response_model=List[EventResponse])
async def get_events(
    event_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    resource_id: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Get events with optional filtering"""
    filters = EventFilter(
        event_type=event_type,
        severity=severity,
        user_id=user_id,
        resource_id=resource_id,
        limit=limit,
        offset=offset,
    )
    return await EventService.get_events(db, filters)


# Issue endpoints
@router.post("/issues", response_model=IssueResponse)
async def create_issue(issue_data: IssueCreate, db: AsyncSession = Depends(get_db)):
    """Create a new issue"""
    return await IssueService.create_issue(db, issue_data)


@router.get("/issues/{issue_id}", response_model=IssueResponse)
async def get_issue(issue_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific issue by ID"""
    issue = await IssueService.get_issue(db, str(issue_id))
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.get("/issues", response_model=List[IssueResponse])
async def get_issues(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Get issues with optional filtering"""
    filters = IssueFilter(
        status=status,
        priority=priority,
        category=category,
        assignee=assignee,
        limit=limit,
        offset=offset,
    )
    return await IssueService.get_issues(db, filters)


@router.patch("/issues/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: UUID, issue_data: IssueUpdate, db: AsyncSession = Depends(get_db)
):
    """Update an existing issue"""
    issue = await IssueService.update_issue(db, str(issue_id), issue_data)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.delete("/issues/{issue_id}")
async def delete_issue(issue_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete an issue"""
    success = await IssueService.delete_issue(db, str(issue_id))
    if not success:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"message": "Issue deleted successfully"}


# Analytics endpoints
@router.get("/analytics/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    """Get dashboard overview statistics"""
    return await AnalyticsService.get_overview(db)


@router.get("/analytics/events", response_model=EventStatistics)
async def get_event_statistics(db: AsyncSession = Depends(get_db)):
    """Get event statistics"""
    return await AnalyticsService.get_event_statistics(db)


@router.get("/analytics/courses", response_model=List[CourseAnalytics])
async def get_course_analytics(db: AsyncSession = Depends(get_db)):
    """Get analytics for all courses"""
    return await AnalyticsService.get_course_analytics(db)


@router.get("/analytics/users", response_model=UserEngagementMetrics)
async def get_user_engagement(db: AsyncSession = Depends(get_db)):
    """Get user engagement metrics"""
    return await AnalyticsService.get_user_engagement(db)
