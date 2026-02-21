import requests
import json

url = "http://localhost:8000/api/courses/generate"
payload = {
    "topic": "gstreamer",
    "goal": "Academic requirements",
    "duration_weeks": 1,
    "additional_info": "",
}

print("Testing course generation API...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print("\nSending request...\n")

try:
    response = requests.post(url, json=payload, timeout=300)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"\nResponse Body:")

    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(response.text)

except requests.exceptions.Timeout:
    print("ERROR: Request timed out after 300 seconds")
except requests.exceptions.ConnectionError as e:
    print(f"ERROR: Connection error - {e}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
