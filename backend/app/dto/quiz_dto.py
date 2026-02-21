from pydantic import BaseModel
from typing import List, Dict, Any


class QuizQuestion(BaseModel):
    """Quiz question DTO"""

    id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class Quiz(BaseModel):
    """Quiz DTO"""

    id: str
    title: str
    questions: List[QuizQuestion]


class QuizSubmission(BaseModel):
    """Quiz submission DTO"""

    answers: Dict[str, int]


class QuizResult(BaseModel):
    """Quiz result DTO"""

    score: int
    total: int
    percentage: float
    passed: bool
    feedback: List[Dict[str, Any]]
