"""
LinguaSense AI — CRUD Operations for TranslationHistory.

All operations are async-first and use the injected AsyncSession.
"""

from __future__ import annotations

import logging
import math
from typing import List, Optional, Tuple

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import TranslationHistory

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Create
# ──────────────────────────────────────────────────────────────────────────────

async def create_history(
    db: AsyncSession,
    *,
    source_text: str,
    translated_text: str,
    source_lang: str,
    target_lang: str,
    tone: Optional[str] = None,
    context: Optional[str] = None,
    confidence: float = 0.0,
    emotion: Optional[str] = None,
) -> TranslationHistory:
    """Insert a new translation history record."""
    record = TranslationHistory(
        source_text=source_text,
        translated_text=translated_text,
        source_lang=source_lang,
        target_lang=target_lang,
        tone=tone,
        context=context,
        confidence=confidence,
        emotion=emotion,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    logger.info("Created history record id=%s", record.id)
    return record


# ──────────────────────────────────────────────────────────────────────────────
# Read
# ──────────────────────────────────────────────────────────────────────────────

async def get_history(
    db: AsyncSession,
    *,
    search: Optional[str] = None,
    source_lang: Optional[str] = None,
    target_lang: Optional[str] = None,
    favorites_only: bool = False,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[TranslationHistory], int]:
    """
    Retrieve paginated translation history with optional filters.

    Returns (items, total_count).
    """
    stmt = select(TranslationHistory)
    count_stmt = select(func.count(TranslationHistory.id))

    # ── Filters ──
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            TranslationHistory.source_text.ilike(pattern)
            | TranslationHistory.translated_text.ilike(pattern)
        )
        count_stmt = count_stmt.where(
            TranslationHistory.source_text.ilike(pattern)
            | TranslationHistory.translated_text.ilike(pattern)
        )

    if source_lang:
        stmt = stmt.where(TranslationHistory.source_lang == source_lang)
        count_stmt = count_stmt.where(TranslationHistory.source_lang == source_lang)

    if target_lang:
        stmt = stmt.where(TranslationHistory.target_lang == target_lang)
        count_stmt = count_stmt.where(TranslationHistory.target_lang == target_lang)

    if favorites_only:
        stmt = stmt.where(TranslationHistory.is_favorite.is_(True))
        count_stmt = count_stmt.where(TranslationHistory.is_favorite.is_(True))

    # ── Count ──
    total_result = await db.execute(count_stmt)
    total: int = total_result.scalar_one()

    # ── Pagination ──
    offset = (max(1, page) - 1) * page_size
    stmt = (
        stmt
        .order_by(TranslationHistory.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    result = await db.execute(stmt)
    items = list(result.scalars().all())

    return items, total


async def get_history_by_id(
    db: AsyncSession,
    history_id: int,
) -> Optional[TranslationHistory]:
    """Fetch a single history record by primary key."""
    result = await db.execute(
        select(TranslationHistory).where(TranslationHistory.id == history_id)
    )
    return result.scalar_one_or_none()


async def get_favorites(
    db: AsyncSession,
    *,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[TranslationHistory], int]:
    """Convenience wrapper — returns only favorited records."""
    return await get_history(db, favorites_only=True, page=page, page_size=page_size)


# ──────────────────────────────────────────────────────────────────────────────
# Update
# ──────────────────────────────────────────────────────────────────────────────

async def toggle_favorite(
    db: AsyncSession,
    history_id: int,
    is_favorite: bool,
) -> Optional[TranslationHistory]:
    """Set the is_favorite flag for a history record."""
    await db.execute(
        update(TranslationHistory)
        .where(TranslationHistory.id == history_id)
        .values(is_favorite=is_favorite)
    )
    await db.flush()
    return await get_history_by_id(db, history_id)


# ──────────────────────────────────────────────────────────────────────────────
# Delete
# ──────────────────────────────────────────────────────────────────────────────

async def delete_history(
    db: AsyncSession,
    history_id: int,
) -> bool:
    """Delete a history record. Returns True if a row was removed."""
    result = await db.execute(
        delete(TranslationHistory).where(TranslationHistory.id == history_id)
    )
    await db.flush()
    deleted = result.rowcount > 0  # type: ignore[union-attr]
    if deleted:
        logger.info("Deleted history record id=%s", history_id)
    return deleted


async def delete_all_history(db: AsyncSession) -> int:
    """Delete ALL history records. Returns count of rows removed."""
    result = await db.execute(delete(TranslationHistory))
    await db.flush()
    count: int = result.rowcount  # type: ignore[assignment]
    logger.info("Deleted %d history records", count)
    return count
