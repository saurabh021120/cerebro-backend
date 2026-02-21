import sys

sys.path.insert(0, ".")
from app.services.ai_service import generate_course_content
from app.services.course_service import CourseService
from app.dto import CourseCreateRequest
from app.database import get_session
import asyncio


async def test_full_flow():
    """Test the complete course creation flow including database"""
    try:
        # Create a test request
        req = CourseCreateRequest(
            topic="Python Testing",
            goal="Learn unit testing",
            duration_weeks=1,
            additional_info="",
        )

        print("Testing full course creation flow...")

        # Get database session
        async for session in get_session():
            result = await CourseService.create_course(session, req)
            print(f"✅ SUCCESS!")
            print(f"Course ID: {result.id}")
            print(f"Title: {result.title}")
            print(f"Modules: {len(result.modules)}")
            break

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_full_flow())
