import sys

sys.path.insert(0, ".")
from app.services.ai_service import generate_course_content
import asyncio
import json


async def test():
    try:
        print("Testing course generation...")
        result = await generate_course_content(
            "JavaScript", "Learn web development", 1, ""
        )
        print(f"Success!")
        print(f"Title: {result['title']}")
        print(f"Modules: {len(result['modules'])}")
        print(f"First module: {result['modules'][0]['title']}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test())
