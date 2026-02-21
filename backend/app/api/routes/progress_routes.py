from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto import ProgressUpdate
from app.services import ProgressService
from app.api.dependencies import get_db

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("")
async def update_progress(req: ProgressUpdate, session: AsyncSession = Depends(get_db)):
    """Update user progress"""
    return await ProgressService.update_progress(
        session, req.course_id, req.module_id, req.lesson_id, req.completed
    )


@router.get("/{course_id}")
async def get_progress(course_id: str, session: AsyncSession = Depends(get_db)):
    """Get user progress for a course"""
    return await ProgressService.get_progress(session, course_id)
