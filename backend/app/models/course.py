from sqlalchemy import Column, Text, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database import Base


class CourseDB(Base):
    """Course database model"""

    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text)
    description = Column(Text)
    topic = Column(Text)
    goal = Column(Text)
    duration_weeks = Column(Integer)
    difficulty = Column(Text)
    thumbnail = Column(Text)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    modules = relationship(
        "ModuleDB", cascade="all, delete-orphan", back_populates="course"
    )


class ModuleDB(Base):
    """Module database model"""

    __tablename__ = "modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"))
    title = Column(Text)
    description = Column(Text)
    order = Column(Integer)

    course = relationship("CourseDB", back_populates="modules")
    lessons = relationship(
        "LessonDB", cascade="all, delete-orphan", back_populates="module"
    )
    quiz = relationship(
        "QuizDB", cascade="all, delete-orphan", uselist=False, back_populates="module"
    )


class LessonDB(Base):
    """Lesson database model"""

    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"))
    title = Column(Text)
    content = Column(Text)
    duration_minutes = Column(Integer)
    order = Column(Integer)
    resources = Column(JSON)

    module = relationship("ModuleDB", back_populates="lessons")
