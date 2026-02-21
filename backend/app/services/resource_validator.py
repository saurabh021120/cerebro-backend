"""
Resource Validator Service
Validates resource URLs to prevent invalid links in generated courses
"""

from urllib.parse import urlparse
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Known placeholder domains to filter out
PLACEHOLDER_DOMAINS = [
    "example.com",
    "example.org",
    "example.net",
    "placeholder.com",
    "placeholder-url.com",
    "test.com",
    "dummy.com",
    "sample.com",
    "tempuri.org",
    "localhost",
]

# Trusted domains for educational resources
TRUSTED_VIDEO_DOMAINS = [
    "youtube.com",
    "youtu.be",
    "vimeo.com",
    "www.youtube.com",
    "m.youtube.com",
]

TRUSTED_ARTICLE_DOMAINS = [
    "developer.mozilla.org",
    "mdn.mozilla.org",
    "wikipedia.org",
    "en.wikipedia.org",
    "github.com",
    "stackoverflow.com",
    "medium.com",
    "dev.to",
    "freecodecamp.org",
    "w3schools.com",
    "geeksforgeeks.org",
]

TRUSTED_DOC_DOMAINS = [
    "docs.python.org",
    "reactjs.org",
    "react.dev",
    "nodejs.org",
    "vuejs.org",
    "angular.io",
    "docs.microsoft.com",
    "cloud.google.com",
    "aws.amazon.com",
    "kubernetes.io",
]


def is_valid_url(url: str) -> bool:
    """
    Check if URL is properly formatted

    Args:
        url: URL string to validate

    Returns:
        True if URL has valid format, False otherwise
    """
    try:
        result = urlparse(url)
        return all(
            [
                result.scheme in ["http", "https"],
                result.netloc,
                len(result.netloc) > 3,  # Minimum domain length
            ]
        )
    except Exception as e:
        logger.debug(f"URL parsing error for '{url}': {e}")
        return False


def is_placeholder_url(url: str) -> bool:
    """
    Check if URL is a known placeholder domain

    Args:
        url: URL string to check

    Returns:
        True if URL is a placeholder, False otherwise
    """
    try:
        netloc = urlparse(url).netloc.lower()
        # Remove www. prefix for comparison
        domain = netloc.replace("www.", "")

        return any(placeholder in domain for placeholder in PLACEHOLDER_DOMAINS)
    except Exception:
        return True  # Treat malformed URLs as placeholders


def is_trusted_domain(url: str, resource_type: str) -> bool:
    """
    Check if URL is from a trusted domain for the given resource type

    Args:
        url: URL string to check
        resource_type: Type of resource (video, article, documentation)

    Returns:
        True if domain is trusted for this resource type
    """
    try:
        netloc = urlparse(url).netloc.lower()

        if resource_type == "video":
            return any(domain in netloc for domain in TRUSTED_VIDEO_DOMAINS)
        elif resource_type == "article":
            return any(domain in netloc for domain in TRUSTED_ARTICLE_DOMAINS)
        elif resource_type == "documentation":
            return any(domain in netloc for domain in TRUSTED_DOC_DOMAINS)
        else:
            # For unknown types, check all trusted domains
            all_trusted = (
                TRUSTED_VIDEO_DOMAINS + TRUSTED_ARTICLE_DOMAINS + TRUSTED_DOC_DOMAINS
            )
            return any(domain in netloc for domain in all_trusted)
    except Exception:
        return False


def validate_resource(resource: Dict) -> bool:
    """
    Validate a single resource object

    Args:
        resource: Resource dictionary with 'url', 'title', and 'type' keys

    Returns:
        True if resource is valid, False otherwise
    """
    # Check required fields
    if not all(key in resource for key in ["url", "title", "type"]):
        logger.warning(f"Resource missing required fields: {resource}")
        return False

    url = resource["url"]
    resource_type = resource.get("type", "article")

    # Check URL format
    if not is_valid_url(url):
        logger.warning(f"Invalid URL format: {url}")
        return False

    # Check for placeholder URLs
    if is_placeholder_url(url):
        logger.warning(f"Placeholder URL detected: {url}")
        return False

    # Optionally check if domain is trusted (commented out for now to be less strict)
    # if not is_trusted_domain(url, resource_type):
    #     logger.info(f"URL from untrusted domain: {url}")
    #     return False

    return True


def validate_and_filter_resources(resources: List[Dict]) -> List[Dict]:
    """
    Filter out invalid resources from a list

    Args:
        resources: List of resource dictionaries

    Returns:
        List of valid resources only
    """
    if not resources:
        return []

    valid_resources = [r for r in resources if validate_resource(r)]

    filtered_count = len(resources) - len(valid_resources)
    if filtered_count > 0:
        logger.info(f"Filtered out {filtered_count} invalid resource(s)")

    return valid_resources


def get_fallback_resources(topic: str, resource_type: str = "article") -> List[Dict]:
    """
    Get fallback resources for a topic when AI generates invalid ones

    Args:
        topic: Course/lesson topic
        resource_type: Type of resource needed

    Returns:
        List of fallback resource dictionaries
    """
    # Generic fallback resources based on common topics
    fallbacks = {
        "python": [
            {
                "title": "Python Official Documentation",
                "url": "https://docs.python.org/3/",
                "type": "documentation",
            },
            {
                "title": "Python Tutorial - W3Schools",
                "url": "https://www.w3schools.com/python/",
                "type": "article",
            },
        ],
        "javascript": [
            {
                "title": "MDN JavaScript Guide",
                "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                "type": "documentation",
            },
            {
                "title": "JavaScript.info Tutorial",
                "url": "https://javascript.info/",
                "type": "article",
            },
        ],
        "react": [
            {
                "title": "React Official Documentation",
                "url": "https://react.dev/",
                "type": "documentation",
            },
            {
                "title": "React Tutorial - FreeCodeCamp",
                "url": "https://www.freecodecamp.org/news/tag/react/",
                "type": "article",
            },
        ],
    }

    # Try to find matching fallbacks
    topic_lower = topic.lower()
    for key, resources in fallbacks.items():
        if key in topic_lower:
            return resources

    # Default fallback
    return []
