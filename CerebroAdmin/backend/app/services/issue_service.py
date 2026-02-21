from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import datetime, timezone

from app.models import IssueDB, IssueStatus, IssuePriority, IssueCategory
from app.dto.issue_dto import IssueCreate, IssueUpdate, IssueResponse, IssueFilter


class IssueService:
    """Service for issue management operations"""

    @staticmethod
    async def create_issue(db: AsyncSession, issue_data: IssueCreate) -> IssueResponse:
        """Create a new issue"""
        issue = IssueDB(
            title=issue_data.title,
            description=issue_data.description,
            priority=IssuePriority(issue_data.priority),
            category=IssueCategory(issue_data.category),
            reporter=issue_data.reporter,
            status=IssueStatus.OPEN,
        )
        db.add(issue)
        await db.commit()
        await db.refresh(issue)
        return IssueResponse.model_validate(issue)

    @staticmethod
    async def get_issue(db: AsyncSession, issue_id: str) -> Optional[IssueResponse]:
        """Get a single issue by ID"""
        result = await db.execute(select(IssueDB).where(IssueDB.id == issue_id))
        issue = result.scalar_one_or_none()
        return IssueResponse.model_validate(issue) if issue else None

    @staticmethod
    async def get_issues(db: AsyncSession, filters: IssueFilter) -> List[IssueResponse]:
        """Get issues with filtering and pagination"""
        query = select(IssueDB)

        # Apply filters
        conditions = []
        if filters.status:
            conditions.append(IssueDB.status == IssueStatus(filters.status))
        if filters.priority:
            conditions.append(IssueDB.priority == IssuePriority(filters.priority))
        if filters.category:
            conditions.append(IssueDB.category == IssueCategory(filters.category))
        if filters.assignee:
            conditions.append(IssueDB.assignee == filters.assignee)

        if conditions:
            query = query.where(and_(*conditions))

        # Order by priority (critical first) then created_at
        query = query.order_by(IssueDB.priority.desc(), IssueDB.created_at.desc())

        # Apply pagination
        query = query.limit(filters.limit).offset(filters.offset)

        result = await db.execute(query)
        issues = result.scalars().all()
        return [IssueResponse.model_validate(issue) for issue in issues]

    @staticmethod
    async def update_issue(
        db: AsyncSession, issue_id: str, issue_data: IssueUpdate
    ) -> Optional[IssueResponse]:
        """Update an existing issue"""
        result = await db.execute(select(IssueDB).where(IssueDB.id == issue_id))
        issue = result.scalar_one_or_none()

        if not issue:
            return None

        # Update fields if provided
        if issue_data.title is not None:
            issue.title = issue_data.title
        if issue_data.description is not None:
            issue.description = issue_data.description
        if issue_data.status is not None:
            new_status = IssueStatus(issue_data.status)
            issue.status = new_status
            # Set resolved_at when status changes to resolved
            if new_status == IssueStatus.RESOLVED and not issue.resolved_at:
                issue.resolved_at = datetime.now(timezone.utc)
        if issue_data.priority is not None:
            issue.priority = IssuePriority(issue_data.priority)
        if issue_data.category is not None:
            issue.category = IssueCategory(issue_data.category)
        if issue_data.assignee is not None:
            issue.assignee = issue_data.assignee

        await db.commit()
        await db.refresh(issue)
        return IssueResponse.model_validate(issue)

    @staticmethod
    async def delete_issue(db: AsyncSession, issue_id: str) -> bool:
        """Delete an issue"""
        result = await db.execute(select(IssueDB).where(IssueDB.id == issue_id))
        issue = result.scalar_one_or_none()

        if not issue:
            return False

        await db.delete(issue)
        await db.commit()
        return True
