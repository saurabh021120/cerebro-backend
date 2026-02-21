from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List, Optional

from app.models import EventDB, EventType, EventSeverity
from app.dto.event_dto import EventCreate, EventResponse, EventFilter


class EventService:
    """Service for event operations"""

    @staticmethod
    async def create_event(db: AsyncSession, event_data: EventCreate) -> EventResponse:
        """Create a new event"""
        event = EventDB(
            event_type=EventType(event_data.event_type),
            severity=EventSeverity(event_data.severity),
            title=event_data.title,
            description=event_data.description,
            event_metadata=event_data.event_metadata,
            user_id=event_data.user_id,
            resource_id=event_data.resource_id,
        )
        db.add(event)
        await db.commit()
        await db.refresh(event)
        return EventResponse.model_validate(event)

    @staticmethod
    async def get_event(db: AsyncSession, event_id: str) -> Optional[EventResponse]:
        """Get a single event by ID"""
        result = await db.execute(select(EventDB).where(EventDB.id == event_id))
        event = result.scalar_one_or_none()
        return EventResponse.model_validate(event) if event else None

    @staticmethod
    async def get_events(db: AsyncSession, filters: EventFilter) -> List[EventResponse]:
        """Get events with filtering and pagination"""
        query = select(EventDB)

        # Apply filters
        conditions = []
        if filters.event_type:
            conditions.append(EventDB.event_type == EventType(filters.event_type))
        if filters.severity:
            conditions.append(EventDB.severity == EventSeverity(filters.severity))
        if filters.user_id:
            conditions.append(EventDB.user_id == filters.user_id)
        if filters.resource_id:
            conditions.append(EventDB.resource_id == filters.resource_id)
        if filters.start_date:
            conditions.append(EventDB.created_at >= filters.start_date)
        if filters.end_date:
            conditions.append(EventDB.created_at <= filters.end_date)

        if conditions:
            query = query.where(and_(*conditions))

        # Order by created_at descending (most recent first)
        query = query.order_by(EventDB.created_at.desc())

        # Apply pagination
        query = query.limit(filters.limit).offset(filters.offset)

        result = await db.execute(query)
        events = result.scalars().all()
        return [EventResponse.model_validate(event) for event in events]

    @staticmethod
    async def get_event_count(db: AsyncSession, filters: EventFilter) -> int:
        """Get total count of events matching filters"""
        query = select(func.count(EventDB.id))

        # Apply same filters as get_events
        conditions = []
        if filters.event_type:
            conditions.append(EventDB.event_type == EventType(filters.event_type))
        if filters.severity:
            conditions.append(EventDB.severity == EventSeverity(filters.severity))
        if filters.user_id:
            conditions.append(EventDB.user_id == filters.user_id)
        if filters.resource_id:
            conditions.append(EventDB.resource_id == filters.resource_id)
        if filters.start_date:
            conditions.append(EventDB.created_at >= filters.start_date)
        if filters.end_date:
            conditions.append(EventDB.created_at <= filters.end_date)

        if conditions:
            query = query.where(and_(*conditions))

        result = await db.execute(query)
        return result.scalar_one()

    @staticmethod
    async def log_event(
        db: AsyncSession,
        event_type: str,
        title: str,
        description: Optional[str] = None,
        severity: str = "info",
        metadata: dict = None,
        user_id: Optional[str] = None,
        resource_id: Optional[str] = None,
    ) -> EventResponse:
        """Convenience method to log an event"""
        event_data = EventCreate(
            event_type=event_type,
            severity=severity,
            title=title,
            description=description,
            event_metadata=metadata or {},
            user_id=user_id,
            resource_id=resource_id,
        )
        return await EventService.create_event(db, event_data)
