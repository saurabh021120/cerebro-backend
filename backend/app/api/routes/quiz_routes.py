from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto import QuizSubmission, QuizResult
from app.services import QuizService
from app.api.dependencies import get_db

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(
    quiz_id: str, submission: QuizSubmission, session: AsyncSession = Depends(get_db)
):
    """Submit quiz answers and get results"""
    return await QuizService.submit_quiz(session, quiz_id, submission.answers)
