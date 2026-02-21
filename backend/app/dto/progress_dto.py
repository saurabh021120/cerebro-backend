from pydantic import BaseModel


class ProgressUpdate(BaseModel):
    """Progress update DTO"""

    course_id: str
    module_id: str
    lesson_id: str
    completed: bool
