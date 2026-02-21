import asyncio
import sys

sys.path.insert(0, ".")

from app.database import get_db
from app.services.course_service import CourseService
from app.dto import CourseCreateRequest


async def test():
    try:
        async for session in get_db():
            req = CourseCreateRequest(
                topic="Web Development",
                goal="Career transition",
                duration_weeks=1,
                additional_info="Give video resources only. I am trying to switch from SDE - 1 to SDE - 2. Focus on DSA, System Design (HLD + LLD)",
            )
            print("Creating course...")
            course = await CourseService.create_course(session, req)
            print(f"Success! Course ID: {course.id}")
            print(f"Title: {course.title}")
            print(f"Modules: {len(course.modules)}")
            break
    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test())
