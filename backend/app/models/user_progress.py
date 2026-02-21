from sqlalchemy import Column, Integer, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database import Base


class UserProgressDB(Base):
    """User progress database model"""

    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True))
    completed_lessons = Column(ARRAY(UUID(as_uuid=True)), default=[])
    quiz_scores = Column(JSON, default={})
    xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_activity = Column(DateTime(timezone=True))
