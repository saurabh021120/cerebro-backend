import sys

sys.path.insert(0, ".")
from app.config import settings
import requests

# List available models
API_KEY = settings.GEMINI_API_KEY
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    print("Listing available Gemini models...")
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        models = response.json()
        print("\nAvailable models that support generateContent:")
        for model in models.get("models", []):
            if "generateContent" in model.get("supportedGenerationMethods", []):
                print(f"  - {model['name']}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")
