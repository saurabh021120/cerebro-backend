import sys

sys.path.insert(0, ".")

from google import genai
from app.config import settings

# List available models
client = genai.Client(api_key=settings.GEMINI_API_KEY)

print("Available Gemini models:")
print("=" * 60)

try:
    models = client.models.list()
    for model in models:
        print(f"Model: {model.name}")
        print(
            f"Display name: {model.display_name if hasattr(model, 'display_name') else 'N/A'}"
        )
        print()
except Exception as e:
    print(f"Error: {e}")
    import traceback

    traceback.print_exc()
