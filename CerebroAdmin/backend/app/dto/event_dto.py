from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class EventCreate(BaseModel):
    """DTO for creating a new event"""

    event_type: str
    severity: str = "info"
    title: str
    description: Optional[str] = None
    event_metadata: Dict[str, Any] = Field(default_factory=dict)
    user_id: Optional[str] = None
    resource_id: Optional[str] = None


class EventResponse(BaseModel):
    """DTO for event response"""

    id: UUID
    event_type: str
    severity: str
    title: str
    description: Optional[str]
    event_metadata: Dict[str, Any]
    user_id: Optional[str]
    resource_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class EventFilter(BaseModel):
    """DTO for filtering events"""

    event_type: Optional[str] = None
    severity: Optional[str] = None
    user_id: Optional[str] = None
    resource_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 50
    offset: int = 0
