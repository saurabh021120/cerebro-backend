import sys

sys.path.insert(0, ".")
from app.config import settings
from google import genai
from google.genai import types

# Test simple API call
client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={"timeout": 60})

try:
    print("Testing simple Gemini API call...")
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents="Say 'Hello World' in JSON format with a 'message' field",
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
