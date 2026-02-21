from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto import TutorChatRequest
from app.api.dependencies import get_db
from app.services.tutor_service import get_tutor_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/tutor")
async def tutor_chat(req: TutorChatRequest, session: AsyncSession = Depends(get_db)):
    """Chat with AI tutor - provides intelligent responses based on course content"""
    try:
        response = await get_tutor_response(
            db=session,
            course_id=req.course_id,
            message=req.message,
            conversation_history=req.conversation_history,
        )
        return {"response": response}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate response: {str(e)}"
        )
