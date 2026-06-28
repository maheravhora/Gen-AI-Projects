"""
LinguaSense AI — Async SQLAlchemy Database Connection.

Provides an async engine and session factory for SQLite via aiosqlite.
"""

from __future__ import annotations

import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

logger = logging.getLogger(__name__)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


# ── Engine & session factory (created once at module level) ──────────────────

_settings = get_settings()
# Ensure the data directory exists before creating the engine
_settings.data_path  # triggers mkdir

engine = create_async_engine(
    _settings.database_url,
    echo=_settings.DEBUG,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ── Dependency ---────────────────────────────────────────────────────────────

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async DB session."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ── Table creation helper ────────────────────────────────────────────────────

async def create_tables() -> None:
    """Create all ORM tables if they don't exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables verified / created.")


async def dispose_engine() -> None:
    """Gracefully dispose of the database engine."""
    await engine.dispose()
    logger.info("Database engine disposed.")
