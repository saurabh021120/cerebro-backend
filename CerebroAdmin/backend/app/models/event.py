from sqlalchemy import Column, Text, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
import enum

from app.database import Base


class EventType(str, enum.Enum):
    """Event types for system tracking"""

    COURSE_CREATED = "course_created"
    COURSE_UPDATED = "course_updated"
    COURSE_DELETED = "course_deleted"
    COURSE_COMPLETED = "course_completed"
    QUIZ_STARTED = "quiz_started"
    QUIZ_COMPLETED = "quiz_completed"
    LESSON_VIEWED = "lesson_viewed"
    LESSON_COMPLETED = "lesson_completed"
    INTERVIEW_STARTED = "interview_started"
    INTERVIEW_COMPLETED = "interview_completed"
    CHAT_SESSION_STARTED = "chat_session_started"
    PROGRESS_UPDATED = "progress_updated"
    USER_REGISTERED = "user_registered"
    USER_LOGIN = "user_login"
    ERROR_OCCURRED = "error_occurred"
    SYSTEM_WARNING = "system_warning"


class EventSeverity(str, enum.Enum):
    """Event severity levels"""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class EventDB(Base):
    """Event database model for tracking system events"""

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(Enum(EventType), nullable=False, index=True)
    severity = Column(Enum(EventSeverity), default=EventSeverity.INFO, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    event_metadata = Column(JSON, default=dict)
    user_id = Column(Text, index=True)
    resource_id = Column(Text, index=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    def __repr__(self):
        return f"<Event {self.event_type}: {self.title}>"
