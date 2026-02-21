import asyncio
import sys

sys.path.insert(0, ".")

from app.database import engine
from sqlalchemy import text


async def check_data():
    async with engine.connect() as conn:
        # Get the most recent course
        result = await conn.execute(
            text(
                """
            SELECT 
                c.id as course_id,
                c.title as course_title,
                COUNT(DISTINCT m.id) as module_count,
                COUNT(DISTINCT l.id) as lesson_count,
                COUNT(DISTINCT q.id) as quiz_count
            FROM courses c
            LEFT JOIN modules m ON m.course_id = c.id
            LEFT JOIN lessons l ON l.module_id = m.id
            LEFT JOIN quizzes q ON q.module_id = m.id
            WHERE c.created_at = (SELECT MAX(created_at) FROM courses)
            GROUP BY c.id, c.title
        """
            )
        )

        row = result.fetchone()
        if row:
            print(f"Course: {row.course_title}")
            print(f"Modules: {row.module_count}")
            print(f"Lessons: {row.lesson_count}")
            print(f"Quizzes: {row.quiz_count}")
        else:
            print("No courses found")


if __name__ == "__main__":
    asyncio.run(check_data())
