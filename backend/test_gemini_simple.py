import asyncio
from google import genai
from google.genai import types
import os

# Test direct Gemini API call
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"), http_options={"timeout": 300}
)


def test_simple():
    print("Testing simple Gemini API call...")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say hello in JSON format with a 'message' field",
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=100,
                response_mime_type="application/json",
            ),
        )
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    test_simple()
