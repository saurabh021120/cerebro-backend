from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dto import Course, CourseCreateRequest
from app.services import CourseService
from app.api.dependencies import get_db

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("/generate", response_model=Course)
async def generate_course(
    req: CourseCreateRequest, session: AsyncSession = Depends(get_db)
):
    """Generate a new course using AI"""
    return await CourseService.create_course(session, req)


@router.get("", response_model=List[Course])
async def get_courses(session: AsyncSession = Depends(get_db)):
    """Get all courses"""
    return await CourseService.get_all_courses(session)


@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str, session: AsyncSession = Depends(get_db)):
    """Get a specific course by ID"""
    return await CourseService.get_course_by_id(session, course_id)


@router.delete("/{course_id}")
async def delete_course(course_id: str, session: AsyncSession = Depends(get_db)):
    """Delete a course"""
    return await CourseService.delete_course(session, course_id)
