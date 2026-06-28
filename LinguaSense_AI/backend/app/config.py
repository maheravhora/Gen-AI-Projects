"""
LinguaSense AI — Application Configuration.

Loads settings from environment variables with sensible defaults.
Uses pydantic-settings for validated, type-safe configuration.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings

# Resolve project root (backend/ directory)
_BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Centralised application settings loaded from env / .env file."""

    # ── General ──────────────────────────────────────────────────────────
    APP_NAME: str = "LinguaSense AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Server ───────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── CORS ─────────────────────────────────────────────────────────────
    CORS_ORIGINS: str = "*"

    # ── Database ─────────────────────────────────────────────────────────
    DB_PATH: str = str(_BACKEND_DIR / "data" / "linguasense.db")

    # ── Translation Model ────────────────────────────────────────────────
    MODEL_NAME: str = "facebook/nllb-200-distilled-600M"
    MODEL_MAX_LENGTH: int = 512
    MODEL_DEVICE: str = "cpu"

    # ── Whisper (STT) ────────────────────────────────────────────────────
    WHISPER_MODEL_SIZE: str = "base"
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"

    # ── EasyOCR ──────────────────────────────────────────────────────────
    OCR_LANGUAGES: str = "en"
    OCR_GPU: bool = False

    # ── Grammar ──────────────────────────────────────────────────────────
    GRAMMAR_LANGUAGE: str = "en-US"

    # ── File handling ────────────────────────────────────────────────────
    UPLOAD_DIR: str = str(_BACKEND_DIR / "uploads")
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_AUDIO_EXTENSIONS: str = ".wav,.mp3,.ogg,.flac,.m4a,.webm"
    ALLOWED_IMAGE_EXTENSIONS: str = ".png,.jpg,.jpeg,.bmp,.tiff,.webp"
    ALLOWED_PDF_EXTENSIONS: str = ".pdf"

    # ── Logging ──────────────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"

    # ── Derived helpers ──────────────────────────────────────────────────
    @property
    def cors_origin_list(self) -> List[str]:
        """Return CORS origins as a list."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def database_url(self) -> str:
        """SQLAlchemy-compatible async SQLite URL."""
        return f"sqlite+aiosqlite:///{self.DB_PATH}"

    @property
    def upload_path(self) -> Path:
        """Ensure the upload directory exists and return its Path."""
        p = Path(self.UPLOAD_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def data_path(self) -> Path:
        """Ensure the data directory (for DB) exists and return its Path."""
        p = Path(self.DB_PATH).parent
        p.mkdir(parents=True, exist_ok=True)
        return p

    model_config = {
        "env_file": str(_BACKEND_DIR / ".env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached singleton accessor for application settings."""
    return Settings()
