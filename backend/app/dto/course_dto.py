from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class Resource(BaseModel):
    """Resource DTO"""

    title: str
    url: str
    type: str


class Lesson(BaseModel):
    """Lesson DTO"""

    id: str
    title: str
    content: str
    resources: List[Resource]
    duration_minutes: int
    order: int


class QuizQuestion(BaseModel):
    """Quiz Question DTO"""

    id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: Optional[str] = None


class Quiz(BaseModel):
    """Quiz DTO"""

    id: str
    title: str
    questions: List[QuizQuestion]
    passing_score: Optional[int] = 80


class Module(BaseModel):
    """Module DTO"""

    id: str
    title: str
    description: str
    lessons: List[Lesson]
    quiz: Optional[Quiz] = None
    order: int


class Course(BaseModel):
    """Course DTO"""

    model_config = ConfigDict(extra="ignore")

    id: str
    title: str
    description: str
    topic: str
    goal: str
    duration_weeks: int
    difficulty: str
    thumbnail: str
    modules: List[Module]
    created_at: str


class CourseCreateRequest(BaseModel):
    """Course creation request DTO"""

    topic: str
    goal: str
    duration_weeks: int
    additional_info: Optional[str] = ""
