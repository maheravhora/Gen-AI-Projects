"""
LinguaSense AI — FastAPI Main Entry Point.

Configures:
  1. Lifespan event handlers (database tables creation, model pre-caching)
  2. CORS middleware for frontend connection
  3. API Router with prefix /api
  4. Static file hosting for uploaded files / audios
"""

from __future__ import annotations

import contextlib
import logging
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database.connection import create_tables, dispose_engine
from app.routers import history, ocr, pdf, translation, voice

# Setup logging
settings = get_settings()
# Ensure upload directory exists before app.mount checks it
settings.upload_path

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handles startup (DB creation) and shutdown (engine disposal) events."""
    logger.info("Starting up LinguaSense AI backend...")
    
    # ── Database Setup ────────────────────────────────────────────────────────
    try:
        # Create SQLite tables
        # Also need to import models so they are registered on Base.metadata
        from app.models.database import TranslationHistory
        await create_tables()
    except Exception as e:
        logger.exception("Failed to initialize database tables")
        raise e

    # Ensure upload directory exists
    settings.upload_path

    yield

    logger.info("Shutting down LinguaSense AI backend...")
    await dispose_engine()


# ── Create FastAPI App ────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Context-aware translation and AI analysis assistant",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Files (Uploads/Downloads/Audios) ──────────────────────────────────
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

# ── Router Registration ───────────────────────────────────────────────────────
# API prefix /api
app.include_router(translation.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(ocr.router, prefix="/api")
app.include_router(pdf.router, prefix="/api")
app.include_router(history.router, prefix="/api")


@app.get("/health", tags=["General"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}
