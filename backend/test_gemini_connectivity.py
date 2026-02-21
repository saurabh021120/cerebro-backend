import sys

sys.path.insert(0, ".")

from google import genai
from google.genai import types
from app.config import settings
import time


# Test 1: Very simple API call
def test_simple_call():
    print("=" * 60)
    print("TEST 1: Simple 'Hello World' API call")
    print("=" * 60)

    try:
        client = genai.Client(
            api_key=settings.GEMINI_API_KEY, http_options={"timeout": 30}
        )

        start_time = time.time()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say 'Hello World'",
            config=types.GenerateContentConfig(
                max_output_tokens=50,
            ),
        )
        elapsed = time.time() - start_time

        print(f"✅ SUCCESS! (took {elapsed:.2f}s)")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


# Test 2: JSON response
def test_json_response():
    print("\n" + "=" * 60)
    print("TEST 2: Simple JSON response")
    print("=" * 60)

    try:
        client = genai.Client(
            api_key=settings.GEMINI_API_KEY, http_options={"timeout": 30}
        )

        start_time = time.time()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Return a JSON object with one field 'message' set to 'test'",
            config=types.GenerateContentConfig(
                max_output_tokens=100,
                response_mime_type="application/json",
            ),
        )
        elapsed = time.time() - start_time

        print(f"✅ SUCCESS! (took {elapsed:.2f}s)")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False


# Test 3: Slightly larger response
def test_larger_response():
    print("\n" + "=" * 60)
    print("TEST 3: Larger JSON response (course-like structure)")
    print("=" * 60)

    try:
        client = genai.Client(
            api_key=settings.GEMINI_API_KEY, http_options={"timeout": 60}
        )

        start_time = time.time()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="""Create a simple JSON object with this structure:
{
  "title": "Test Course",
  "modules": [
    {
      "title": "Module 1",
      "lessons": [
        {"title": "Lesson 1", "content": "Brief content"}
      ]
    }
  ]
}""",
            config=types.GenerateContentConfig(
                max_output_tokens=500,
                response_mime_type="application/json",
            ),
        )
        elapsed = time.time() - start_time

        print(f"✅ SUCCESS! (took {elapsed:.2f}s)")
        print(f"Response length: {len(response.text)} characters")
        print(f"Response preview: {response.text[:200]}...")
        return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\nGEMINI API CONNECTIVITY TEST\n")

    results = []
    results.append(("Simple Call", test_simple_call()))
    results.append(("JSON Response", test_json_response()))
    results.append(("Larger Response", test_larger_response()))

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")

    all_passed = all(r[1] for r in results)
    if all_passed:
        print("\n[PASS] All tests passed! Gemini API is working.")
        print("The timeout issue is likely due to request complexity.")
    else:
        print("\n[FAIL] Some tests failed. There's a connectivity issue.")
