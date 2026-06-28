"""
LinguaSense AI — History Router.

Endpoints:
  GET    /history        — List translation history (paginated, filterable)
  POST   /favorite       — Toggle favorite on a history record
  DELETE /history/{id}   — Delete a history record
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import history_controller
from app.database.connection import get_db
from app.models.schemas import (
    ErrorResponse,
    FavoriteRequest,
    HistoryItem,
    HistoryResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["History"])


@router.get(
    "/history",
    response_model=HistoryResponse,
    summary="Get translation history",
)
async def get_history(
    search: Optional[str] = Query(None, description="Search in source/translated text"),
    source_lang: Optional[str] = Query(None, description="Filter by source language"),
    target_lang: Optional[str] = Query(None, description="Filter by target language"),
    favorites_only: bool = Query(False, description="Only show favorites"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> HistoryResponse:
    try:
        return await history_controller.get_history(
            db,
            search=search,
            source_lang=source_lang,
            target_lang=target_lang,
            favorites_only=favorites_only,
            page=page,
            page_size=page_size,
        )
    except Exception as exc:
        logger.exception("Error fetching history")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {exc}",
        )


@router.post(
    "/favorite",
    response_model=HistoryItem,
    responses={404: {"model": ErrorResponse}},
    summary="Toggle favorite on a history record",
)
async def toggle_favorite(
    request: FavoriteRequest,
    db: AsyncSession = Depends(get_db),
) -> HistoryItem:
    try:
        result = await history_controller.toggle_favorite(db, request)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"History record {request.history_id} not found",
            )
        return result
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error toggling favorite")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to toggle favorite: {exc}",
        )


@router.delete(
    "/history/{history_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}},
    summary="Delete a history record",
)
async def delete_history(
    history_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        deleted = await history_controller.delete_history(db, history_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"History record {history_id} not found",
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error deleting history")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete history: {exc}",
        )
