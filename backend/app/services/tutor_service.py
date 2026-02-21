import asyncio
import requests
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import CourseDB, ModuleDB
from app.config import settings


def _generate_tutor_response(
    system_prompt: str, user_prompt: str, max_retries: int = 3
) -> str:
    """Generate tutor response using Gemini API (returns plain text, not JSON)"""

    GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

    payload = {
        "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.95,
            "topK": 40,
            "maxOutputTokens": 2048,
            # Note: No responseMimeType - we want plain text for tutor responses
        },
    }

    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"{GEMINI_API_URL}?key={settings.GEMINI_API_KEY}",
                json=payload,
                timeout=60,
            )

            if response.status_code == 200:
                result = response.json()
                if "candidates" in result and len(result["candidates"]) > 0:
                    candidate = result["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        parts = candidate["content"]["parts"]
                        complete_text = "".join(part.get("text", "") for part in parts)
                        if complete_text:
                            return complete_text

                raise ValueError("Unexpected response format from Gemini API")
            else:
                error_msg = (
                    f"API returned status {response.status_code}: {response.text[:500]}"
                )
                print(f"Attempt {attempt + 1}/{max_retries} failed: {error_msg}")

                if attempt == max_retries - 1:
                    raise Exception(error_msg)

        except Exception as e:
            print(f"Attempt {attempt + 1}/{max_retries} failed: {str(e)}")
            if attempt == max_retries - 1:
                raise

    raise Exception("Failed to generate tutor response after all retries")


async def get_tutor_response(
    db: AsyncSession,
    course_id: str,
    message: str,
    conversation_history: List[Dict[str, str]],
) -> str:
    """Generate AI tutor response using Gemini API with course context"""

    # Fetch course details BEFORE threading (async DB operations must happen in async context)
    # Eagerly load relationships to avoid lazy loading issues in thread

    result = await db.execute(
        select(CourseDB)
        .where(CourseDB.id == course_id)
        .options(selectinload(CourseDB.modules).selectinload(ModuleDB.lessons))
    )
    course = result.scalar_one_or_none()

    if not course:
        raise ValueError(f"Course with ID {course_id} not found")

    # Build course context from modules and lessons
    course_context = f"Course: {course.title}\n"
    course_context += f"Description: {course.description}\n"
    course_context += f"Difficulty: {course.difficulty}\n\n"

    if course.modules:
        course_context += "Course Content:\n"
        for module in course.modules:
            course_context += f"\nModule {module.order}: {module.title}\n"
            course_context += f"{module.description}\n"

            if module.lessons:
                for lesson in module.lessons:
                    course_context += f"  - Lesson {lesson.order}: {lesson.title}\n"
                    # Include a snippet of lesson content (first 500 chars)
                    if lesson.content:
                        content_snippet = (
                            lesson.content[:500] + "..."
                            if len(lesson.content) > 500
                            else lesson.content
                        )
                        course_context += f"    {content_snippet}\n"

    # Build conversation history for context
    history_text = ""
    if conversation_history:
        history_text = "\n\nPrevious conversation:\n"
        for msg in conversation_history[
            -5:
        ]:  # Only include last 5 messages for context
            # Handle both dicts and Pydantic objects
            if isinstance(msg, dict):
                role = msg.get("role", "user")
                content = msg.get("content", "")
            else:
                role = getattr(msg, "role", "user")
                content = getattr(msg, "content", "")

            history_text += f"{role.capitalize()}: {content}\n"

    # Create system prompt for the tutor
    system_prompt = f"""You are an expert AI tutor helping students learn about "{course.title}".

Your role:
- Answer questions clearly and concisely
- Explain concepts from the course material
- Provide examples and analogies to aid understanding
- Encourage critical thinking
- Be patient and supportive
- Reference specific lessons or modules when relevant

Course Information:
{course_context}

Guidelines:
- Keep responses focused and educational
- Use markdown formatting for better readability
- Break down complex topics into digestible parts
- Ask follow-up questions to check understanding
- If a question is outside the course scope, gently redirect to course topics
"""

    user_prompt = f"""{history_text}

Student's question: {message}

Provide a helpful, educational response as their AI tutor."""

    # Generate response using Gemini API (in thread to avoid blocking)
    response = await asyncio.to_thread(
        _generate_tutor_response, system_prompt, user_prompt, max_retries=3
    )

    return response
