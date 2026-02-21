import sys

sys.path.insert(0, ".")
from app.config import settings
import requests
import json

# Test Gemini API using requests library directly
API_KEY = settings.GEMINI_API_KEY
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [
        {"parts": [{"text": "Say 'Hello World' in JSON format with a 'message' field"}]}
    ],
    "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 50,
        "responseMimeType": "application/json",
    },
}

try:
    print("Testing Gemini API with requests library...")
    response = requests.post(url, json=payload, timeout=60)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success! Response: {json.dumps(result, indent=2)[:300]}")
    else:
        print(f"Error Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
    import traceback

    traceback.print_exc()
