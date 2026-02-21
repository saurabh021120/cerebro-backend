# AI Tutor Implementation & Debugging Log

## Overview
This document details the issues encountered during the implementation of the AI Tutor feature in the LearnAI platform and how they were resolved. This serves as a reference for future debugging and development.

## Issues Log

### 1. Frontend API Endpoint Mismatch
**Issue:**
- The frontend was making a request to `http://localhost:8000/api/tutor/chat`.
- The backend API router was defined as `router = APIRouter(prefix="/chat")` and the endpoint as `@router.post("/tutor")`.
- This resulted in a **404 Not Found** error because the correct URL structure is `PREFIX + ENDPOINT`.

**Resolution:**
- Updated `frontend/src/pages/AITutor.jsx` to call the correct endpoint:
  ```javascript
  // OLD
  const response = await axios.post(`${API}/tutor/chat`, { ... });
  
  // NEW
  const response = await axios.post(`${API}/chat/tutor`, { ... });
  ```

### 2. Async SQLAlchemy - "greenlet_spawn" Error
**Issue:**
- The application crashed with `greenlet_spawn has not been called` when trying to access `course.modules` or `module.lessons`.
- This happens when SQLAlchemy tries to "lazy load" related data (like modules/lessons) inside a thread (where `await` cannot be used) or outside of the async session context.
- The `get_tutor_response` function was trying to access these relationships after the initial query but before passing data to the Gemini thread.

**Resolution:**
- Implemented **eager loading** using `selectinload` to fetch all course data (course -> modules -> lessons) in a single async query.
- This ensures all data is available immediately without needing further database queries.
  ```python
  # backend/app/services/tutor_service.py
  from sqlalchemy.orm import selectinload
  
  result = await db.execute(
      select(CourseDB)
      .where(CourseDB.id == course_id)
      .options(
          selectinload(CourseDB.modules).selectinload(ModuleDB.lessons)
      )
  )
  ```

### 3. Gemini API Model Version Error (404)
**Issue:**
- The backend received a **404 Not Found** error from the Google Gemini API.
- The error message was `models/gemini-2.0-flash-exp is not found`.
- This was due to using an experimental model version that was either deprecated or not available in the API key's region.
- Initial attempt to use `gemini-1.5-flash` also failed.

**Resolution:**
- Verified available models using a test script.
- Switched to the consistently working model version: `gemini-2.5-flash`.
  ```python
  # backend/app/services/tutor_service.py
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
  ```

### 4. Pydantic Model Attribute Error
**Issue:**
- The error `'ChatMessage' object has no attribute 'get'` occurred during request processing.
- The `conversation_history` passed from the frontend is automatically converted by FastAPI/Pydantic into a list of `ChatMessage` objects.
- The code was trying to access properties using dictionary syntax `msg.get("role")`, which works for dicts but not for Pydantic models.

**Resolution:**
- Updated the code to handle both dictionary and object access patterns, ensuring robustness.
  ```python
  # backend/app/services/tutor_service.py
  if isinstance(msg, dict):
      role = msg.get("role", "user")
      content = msg.get("content", "")
  else:
      role = getattr(msg, "role", "user")
      content = getattr(msg, "content", "")
  ```

## Summary
The AI Tutor feature is now fully operational. The key takeaways are:
1. Always verify API route prefixes vs frontend calls.
2. Use eager loading (`selectinload`) for async SQLAlchemy queries when deep relationships are needed.
3. Verify external API model versions script-wise before implementation.
4. Be aware of Pydantic model conversion in FastAPI endpoints (objects vs dicts).
