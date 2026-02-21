import asyncio
import sys

sys.path.insert(0, ".")

from app.database import get_db
from app.services.course_service import CourseService


async def test():
    try:
        async for session in get_db():
            courses = await CourseService.get_all_courses(session)
            print(f"Found {len(courses)} courses")
            if courses:
                print(f"First course: {courses[0].title}")
                print(f"Modules: {len(courses[0].modules)}")
                if courses[0].modules:
                    print(f"First module: {courses[0].modules[0].title}")
                    print(
                        f"Lessons in first module: {len(courses[0].modules[0].lessons)}"
                    )
            break
    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test())
