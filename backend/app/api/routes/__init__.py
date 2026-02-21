from .course_routes import router as course_router
from .quiz_routes import router as quiz_router
from .chat_routes import router as chat_router
from .interview_routes import router as interview_router
from .progress_routes import router as progress_router

__all__ = [
    "course_router",
    "quiz_router",
    "chat_router",
    "interview_router",
    "progress_router",
]
