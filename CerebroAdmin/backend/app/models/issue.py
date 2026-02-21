from sqlalchemy import Column, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
import enum

from app.database import Base


class IssueStatus(str, enum.Enum):
    """Issue status values"""

    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IssuePriority(str, enum.Enum):
    """Issue priority levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IssueCategory(str, enum.Enum):
    """Issue categories"""

    BUG = "bug"
    FEATURE_REQUEST = "feature_request"
    PERFORMANCE = "performance"
    SECURITY = "security"
    UI_UX = "ui_ux"
    DATA_INTEGRITY = "data_integrity"
    API = "api"
    OTHER = "other"


class IssueDB(Base):
    """Issue database model for tracking system issues"""

    __tablename__ = "issues"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    description = Column(Text)
    status = Column(
        Enum(IssueStatus), default=IssueStatus.OPEN, nullable=False, index=True
    )
    priority = Column(
        Enum(IssuePriority), default=IssuePriority.MEDIUM, nullable=False, index=True
    )
    category = Column(
        Enum(IssueCategory), default=IssueCategory.OTHER, nullable=False, index=True
    )
    reporter = Column(Text)
    assignee = Column(Text)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    resolved_at = Column(DateTime(timezone=True))

    def __repr__(self):
        return f"<Issue {self.title} [{self.status}]>"
