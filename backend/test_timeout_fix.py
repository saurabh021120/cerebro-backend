import sys

sys.path.insert(0, ".")
from app.services.ai_service import generate_course_content
import asyncio
import time


async def test():
    start = time.time()
    result = await generate_course_content("Python Basics", "Learn fundamentals", 1, "")
    elapsed = time.time() - start
    print(f"Success! Generated in {elapsed:.2f}s")
    print(f'Title: {result["title"]}')
    print(f'Modules: {len(result["modules"])}')
    print(f'Total lessons: {sum(len(m["lessons"]) for m in result["modules"])}')


if __name__ == "__main__":
    asyncio.run(test())
