from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class IssueCreate(BaseModel):
    """DTO for creating a new issue"""

    title: str
    description: Optional[str] = None
    priority: str = "medium"
    category: str = "other"
    reporter: Optional[str] = None


class IssueUpdate(BaseModel):
    """DTO for updating an issue"""

    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assignee: Optional[str] = None


class IssueResponse(BaseModel):
    """DTO for issue response"""

    id: UUID
    title: str
    description: Optional[str]
    status: str
    priority: str
    category: str
    reporter: Optional[str]
    assignee: Optional[str]
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


class IssueFilter(BaseModel):
    """DTO for filtering issues"""

    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assignee: Optional[str] = None
    limit: int = 50
    offset: int = 0
