import requests
import json
import asyncio
import time
from app.config import settings

# Gemini API configuration
GEMINI_API_KEY = settings.GEMINI_API_KEY
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


def _generate_content_sync(system_prompt: str, user_prompt: str, max_retries: int = 3):
    """Synchronous wrapper for Gemini API call with retry logic using requests library"""

    payload = {
        "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.95,
            "topK": 40,
            "maxOutputTokens": 8192,  # Increased to prevent truncation
            "responseMimeType": "application/json",
        },
    }

    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json=payload,
                timeout=300,  # 5 minutes timeout
            )

            if response.status_code == 200:
                result = response.json()
                # Extract the generated text from the response
                if "candidates" in result and len(result["candidates"]) > 0:
                    candidate = result["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        parts = candidate["content"]["parts"]
                        # Concatenate all parts to get the complete response
                        complete_text = "".join(part.get("text", "") for part in parts)
                        if complete_text:
                            return complete_text

                raise ValueError(
                    f"Unexpected response format: {json.dumps(result)[:500]}"
                )
            else:
                error_msg = (
                    f"API returned status {response.status_code}: {response.text[:500]}"
                )
                print(f"Attempt {attempt + 1}/{max_retries} failed: {error_msg}")

                if attempt == max_retries - 1:
                    raise Exception(error_msg)

        except requests.exceptions.Timeout as e:
            error_msg = "Request timed out"
            print(f"Attempt {attempt + 1}/{max_retries} failed: {error_msg}")

            if attempt == max_retries - 1:
                raise

        except Exception as e:
            error_msg = str(e)
            print(f"Attempt {attempt + 1}/{max_retries} failed: {error_msg}")

            if attempt == max_retries - 1:
                raise

        # Exponential backoff: wait 2^attempt seconds
        wait_time = 2**attempt
        print(f"Retrying in {wait_time} seconds...")
        time.sleep(wait_time)

    raise Exception("Failed to generate content after all retries")


async def generate_course_content(
    topic: str, goal: str, duration_weeks: int, additional_info: str
):
    """Generate course content using Google Gemini REST API"""

    system_prompt = """You are a course curriculum designer. Generate a comprehensive course structure in JSON format.

CRITICAL INSTRUCTIONS FOR RESOURCES:
1. You MUST provide real, publicly accessible URLs from reputable sources
2. DO NOT use placeholder URLs like example.com, placeholder.com, or any made-up domains
3. IMPORTANT: DO NOT include video resources unless you are 100% certain the specific YouTube video exists
   - DO NOT make up YouTube video IDs (the part after watch?v=)
4. STRONGLY PREFERRED: Use article and documentation resources which are reliable and verifiable:
5. Each resource URL must be a real, working link that users can access
6. Provide 2-3 high-quality article/documentation resources per lesson

The JSON must have this exact structure:
{
  "title": "Course Title",
  "description": "Course description",
  "difficulty": "beginner|intermediate|advanced",
  "thumbnail": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Detailed lesson content in markdown format with headers (###), bold (**text**), lists, and code examples",
          "duration_minutes": 30,
          "order": 1,
          "resources": [
            {
              "title": "Resource Title",
              "url": "https://real-working-url.com",
              "type": "article|documentation"
            }
          ]
        }
      ],
      "quiz": {
        "title": "Module Quiz",
        "questions": [
          {
            "question": "Question text?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct_answer": 0,
            "explanation": "Why this is correct"
          }
        ]
      }
    }
  ]
}
Return ONLY valid JSON, no markdown formatting or explanations."""

    user_prompt = f"""Create a comprehensive course with the following requirements:
Topic: {topic}
Goal: {goal}
Duration: {duration_weeks} weeks
Additional Info: {additional_info or 'None'}

Generate a course with modules, each with lessons and a quiz with questions.
Include practical resources and detailed lesson content."""

    # Run the synchronous API call in a thread pool
    response_text = await asyncio.to_thread(
        _generate_content_sync, system_prompt, user_prompt
    )

    try:
        # Use strict=False to handle invalid escape sequences from Gemini
        return json.loads(response_text, strict=False)
    except json.JSONDecodeError as e:
        # Log the error and response for debugging
        print(f"JSON Decode Error: {e}")
        print(f"Response text (first 500 chars): {response_text[:500]}")
        print(f"Response text (last 500 chars): {response_text[-500:]}")
        raise ValueError(f"Failed to parse Gemini response as JSON: {e}")
