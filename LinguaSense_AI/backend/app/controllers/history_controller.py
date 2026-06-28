"""
LinguaSense AI — History Controller.

Orchestrates CRUD operations for translation history with
pagination support.
"""

from __future__ import annotations

import logging
import math
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import crud
from app.models.schemas import FavoriteRequest, HistoryItem, HistoryResponse

logger = logging.getLogger(__name__)


async def get_history(
    db: AsyncSession,
    *,
    search: Optional[str] = None,
    source_lang: Optional[str] = None,
    target_lang: Optional[str] = None,
    favorites_only: bool = False,
    page: int = 1,
    page_size: int = 20,
) -> HistoryResponse:
    """Retrieve paginated history with optional filters."""
    items, total = await crud.get_history(
        db,
        search=search,
        source_lang=source_lang,
        target_lang=target_lang,
        favorites_only=favorites_only,
        page=page,
        page_size=page_size,
    )

    total_pages = math.ceil(total / page_size) if page_size > 0 else 0

    return HistoryResponse(
        items=[HistoryItem.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


async def toggle_favorite(
    db: AsyncSession,
    request: FavoriteRequest,
) -> Optional[HistoryItem]:
    """Toggle the favorite status of a history record."""
    record = await crud.toggle_favorite(
        db,
        history_id=request.history_id,
        is_favorite=request.is_favorite,
    )
    if record is None:
        return None
    return HistoryItem.model_validate(record)


async def delete_history(
    db: AsyncSession,
    history_id: int,
) -> bool:
    """Delete a history record by ID."""
    return await crud.delete_history(db, history_id)
