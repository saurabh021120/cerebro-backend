from sqlalchemy import Column, Text, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class QuizDB(Base):
    """Quiz database model"""

    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"))
    title = Column(Text)

    module = relationship("ModuleDB", back_populates="quiz")
    questions = relationship(
        "QuizQuestionDB", cascade="all, delete-orphan", back_populates="quiz"
    )


class QuizQuestionDB(Base):
    """Quiz question database model"""

    __tablename__ = "quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"))
    question = Column(Text)
    options = Column(JSON)
    correct_answer = Column(Integer)
    explanation = Column(Text)

    quiz = relationship("QuizDB", back_populates="questions")
