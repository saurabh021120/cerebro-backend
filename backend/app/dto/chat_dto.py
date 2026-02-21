from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    """Chat message DTO"""

    role: str
    content: str


class TutorChatRequest(BaseModel):
    """Tutor chat request DTO"""

    course_id: str
    message: str
    conversation_history: List[ChatMessage] = []
