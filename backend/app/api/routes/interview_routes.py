from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto import InterviewStartRequest, InterviewResponseRequest
from app.services import InterviewService
from app.api.dependencies import get_db

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start")
async def start_interview(
    req: InterviewStartRequest, session: AsyncSession = Depends(get_db)
):
    """Start a new interview session"""
    return await InterviewService.start_interview(session, req.topic, req.difficulty)


@router.post("/respond")
async def respond_interview(
    req: InterviewResponseRequest, session: AsyncSession = Depends(get_db)
):
    """Submit an interview answer"""
    return await InterviewService.process_interview_response(
        session, req.session_id, req.answer, req.conversation_history
    )
