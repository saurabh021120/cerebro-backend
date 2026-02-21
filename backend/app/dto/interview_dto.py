from pydantic import BaseModel
from typing import List
from .chat_dto import ChatMessage


class InterviewStartRequest(BaseModel):
    """Interview start request DTO"""

    topic: str
    difficulty: str = "intermediate"


class InterviewResponseRequest(BaseModel):
    """Interview response request DTO"""

    session_id: str
    answer: str
    conversation_history: List[ChatMessage] = []
