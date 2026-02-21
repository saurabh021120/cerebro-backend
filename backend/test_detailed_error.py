import sys
import asyncio

sys.path.insert(0, ".")

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.dto import CourseCreateRequest
from app.services import CourseService


async def test():
    print("Testing course generation with detailed error logging...")

    req = CourseCreateRequest(
        topic="gstreamer",
        goal="Academic requirements",
        duration_weeks=1,
        additional_info="",
    )

    print(f"\nRequest: {req}")

    try:
        async for session in get_session():
            print("\nDatabase session created")
            print("Calling CourseService.create_course()...")

            course = await CourseService.create_course(session, req)

            print(f"\nSuccess! Course created:")
            print(f"  ID: {course.id}")
            print(f"  Title: {course.title}")
            print(f"  Modules: {len(course.modules)}")

    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}")
        print(f"Message: {str(e)}")

        import traceback

        print("\nFull traceback:")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test())
