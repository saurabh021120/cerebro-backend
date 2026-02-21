import asyncio
import sys

sys.path.insert(0, ".")

from app.database import engine, get_db
from app.services.course_service import CourseService
from app.dto import CourseCreateRequest


async def test_db():
    print("Testing database connection...")
    try:
        async with engine.connect() as conn:
            print("[OK] Database connection successful!")
    except Exception as e:
        print(f"[FAIL] Database connection failed: {e}")
        return

    print("\nTesting course creation...")
    try:
        async for session in get_db():
            req = CourseCreateRequest(
                topic="Test Topic",
                goal="Test Goal",
                duration_weeks=2,
                additional_info="",
            )
            course = await CourseService.create_course(session, req)
            print(f"[OK] Course created successfully! ID: {course.id}")
            break
    except Exception as e:
        print(f"[FAIL] Course creation failed: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_db())
