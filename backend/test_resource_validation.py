"""
Test script to verify resource validation works correctly
"""

import asyncio
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.resource_validator import (
    is_valid_url,
    is_placeholder_url,
    validate_resource,
    validate_and_filter_resources,
)


def test_url_validation():
    """Test URL format validation"""
    print("Testing URL validation...")

    # Valid URLs
    assert is_valid_url(
        "https://youtube.com/watch?v=123"
    ), "YouTube URL should be valid"
    assert is_valid_url("https://developer.mozilla.org/docs"), "MDN URL should be valid"
    assert is_valid_url("http://example.com"), "HTTP URL should be valid"

    # Invalid URLs
    assert not is_valid_url("not-a-url"), "Plain text should be invalid"
    assert not is_valid_url("ftp://invalid.com"), "FTP URL should be invalid"
    assert not is_valid_url(""), "Empty string should be invalid"

    print("[PASS] URL validation tests passed")


def test_placeholder_detection():
    """Test placeholder URL detection"""
    print("\nTesting placeholder detection...")

    # Placeholder URLs
    assert is_placeholder_url(
        "https://example.com/test"
    ), "example.com should be detected"
    assert is_placeholder_url(
        "https://placeholder-url.com/image.jpg"
    ), "placeholder-url.com should be detected"
    assert is_placeholder_url(
        "http://www.example.org/page"
    ), "example.org should be detected"

    # Real URLs
    assert not is_placeholder_url(
        "https://youtube.com/watch"
    ), "YouTube should not be placeholder"
    assert not is_placeholder_url(
        "https://developer.mozilla.org"
    ), "MDN should not be placeholder"

    print("[PASS] Placeholder detection tests passed")


def test_resource_validation():
    """Test resource object validation"""
    print("\nTesting resource validation...")

    # Valid resource
    valid_resource = {
        "title": "Python Tutorial",
        "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
        "type": "video",
    }
    assert validate_resource(valid_resource), "Valid resource should pass"

    # Invalid - placeholder URL
    invalid_placeholder = {
        "title": "Test",
        "url": "https://example.com/test",
        "type": "article",
    }
    assert not validate_resource(invalid_placeholder), "Placeholder URL should fail"

    # Invalid - missing fields
    invalid_missing = {"title": "Test", "type": "article"}
    assert not validate_resource(invalid_missing), "Missing URL should fail"

    # Invalid - bad URL format
    invalid_format = {"title": "Test", "url": "not-a-url", "type": "article"}
    assert not validate_resource(invalid_format), "Bad URL format should fail"

    print("[PASS] Resource validation tests passed")


def test_filter_resources():
    """Test filtering a list of resources"""
    print("\nTesting resource filtering...")

    resources = [
        {
            "title": "Valid YouTube Video",
            "url": "https://www.youtube.com/watch?v=123",
            "type": "video",
        },
        {
            "title": "Invalid Placeholder",
            "url": "https://example.com/fake",
            "type": "article",
        },
        {
            "title": "Valid MDN Article",
            "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            "type": "article",
        },
        {"title": "Invalid Format", "url": "not-a-url", "type": "article"},
    ]

    filtered = validate_and_filter_resources(resources)

    assert len(filtered) == 2, f"Should have 2 valid resources, got {len(filtered)}"
    assert (
        filtered[0]["title"] == "Valid YouTube Video"
    ), "First resource should be YouTube"
    assert filtered[1]["title"] == "Valid MDN Article", "Second resource should be MDN"

    print(
        f"[PASS] Resource filtering tests passed (filtered {len(resources) - len(filtered)} invalid resources)"
    )


async def test_course_generation():
    """Test that course generation produces valid resources"""
    print("\nTesting course generation with validation...")

    try:
        from app.services.ai_service import generate_course_content

        print("Generating test course...")
        data = await generate_course_content(
            topic="Python Basics",
            goal="Learn Python fundamentals",
            duration_weeks=2,
            additional_info="",
        )

        print(f"Course generated: {data['title']}")

        # Check resources in all lessons
        total_resources = 0
        invalid_resources = 0

        for module in data["modules"]:
            for lesson in module["lessons"]:
                resources = lesson.get("resources", [])
                total_resources += len(resources)

                for resource in resources:
                    url = resource.get("url", "")

                    # Check for placeholder URLs
                    if "example.com" in url or "placeholder" in url.lower():
                        invalid_resources += 1
                        print(
                            f"  [WARN] Invalid resource found: {resource['title']} - {url}"
                        )
                    else:
                        print(f"  [OK] Valid resource: {resource['title']} - {url}")

        print(f"\nTotal resources: {total_resources}")
        print(f"Invalid resources: {invalid_resources}")

        if invalid_resources == 0:
            print("[PASS] Course generation test passed - all resources are valid!")
        else:
            print(
                f"[WARN] Course generation test found {invalid_resources} invalid resources"
            )

    except Exception as e:
        print(f"[FAIL] Course generation test failed: {e}")
        import traceback

        traceback.print_exc()


def main():
    """Run all tests"""
    print("=" * 60)
    print("Resource Validator Test Suite")
    print("=" * 60)

    # Run synchronous tests
    test_url_validation()
    test_placeholder_detection()
    test_resource_validation()
    test_filter_resources()

    # Run async course generation test
    print("\n" + "=" * 60)
    asyncio.run(test_course_generation())

    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
