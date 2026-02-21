"""
LearnAI Backend Server Entry Point

This file serves as the entry point for the FastAPI application.
The actual application logic is organized in the 'app' package with
proper separation of concerns following LLD principles.

To run the server:
    uvicorn server:app --reload
"""

from app import app

__all__ = ["app"]
