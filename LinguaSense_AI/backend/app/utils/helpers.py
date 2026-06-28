"""
LinguaSense AI — Utility Helpers.

Common utility functions used across the application:
timing decorator, file cleanup, safe JSON parsing, etc.
"""

from __future__ import annotations

import asyncio
import functools
import logging
import os
import time
import uuid
from pathlib import Path
from typing import Any, Callable, Optional, TypeVar

logger = logging.getLogger(__name__)

F = TypeVar("F", bound=Callable[..., Any])


# ──────────────────────────────────────────────────────────────────────────────
# Timing
# ──────────────────────────────────────────────────────────────────────────────

def timed(func: F) -> F:
    """Decorator that logs execution time of sync / async functions."""

    if asyncio.iscoroutinefunction(func):
        @functools.wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            start = time.perf_counter()
            result = await func(*args, **kwargs)
            elapsed = time.perf_counter() - start
            logger.info("%s executed in %.3fs", func.__qualname__, elapsed)
            return result
        return async_wrapper  # type: ignore[return-value]
    else:
        @functools.wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            start = time.perf_counter()
            result = func(*args, **kwargs)
            elapsed = time.perf_counter() - start
            logger.info("%s executed in %.3fs", func.__qualname__, elapsed)
            return result
        return sync_wrapper  # type: ignore[return-value]


def measure_time() -> float:
    """Return current perf_counter value for manual timing."""
    return time.perf_counter()


# ──────────────────────────────────────────────────────────────────────────────
# File helpers
# ──────────────────────────────────────────────────────────────────────────────

def generate_unique_filename(extension: str = "") -> str:
    """Generate a UUID-based unique filename with the given extension."""
    ext = extension if extension.startswith(".") else f".{extension}" if extension else ""
    return f"{uuid.uuid4().hex}{ext}"


def safe_delete_file(filepath: Optional[str | Path]) -> bool:
    """
    Delete a file if it exists.  Returns True on success, False otherwise.
    Never raises.
    """
    if filepath is None:
        return False
    try:
        path = Path(filepath)
        if path.exists() and path.is_file():
            path.unlink()
            logger.debug("Deleted file: %s", path)
            return True
    except OSError as exc:
        logger.warning("Failed to delete %s: %s", filepath, exc)
    return False


def cleanup_files(*filepaths: Optional[str | Path]) -> None:
    """Best-effort cleanup of multiple temporary files."""
    for fp in filepaths:
        safe_delete_file(fp)


def validate_file_extension(filename: str, allowed_extensions: str) -> bool:
    """
    Check whether *filename* has one of the allowed extensions.

    ``allowed_extensions`` is a comma-separated string like ".wav,.mp3,.ogg".
    """
    ext = Path(filename).suffix.lower()
    allowed = {e.strip().lower() for e in allowed_extensions.split(",")}
    return ext in allowed


def get_file_size_mb(filepath: str | Path) -> float:
    """Return file size in megabytes."""
    return os.path.getsize(filepath) / (1024 * 1024)


# ──────────────────────────────────────────────────────────────────────────────
# Text helpers
# ──────────────────────────────────────────────────────────────────────────────

def truncate_text(text: str, max_length: int = 500) -> str:
    """Truncate text to *max_length* characters, appending '…' if needed."""
    if len(text) <= max_length:
        return text
    return text[: max_length - 1] + "…"


def word_count(text: str) -> int:
    """Return the number of whitespace-delimited words."""
    return len(text.split())


def char_count(text: str) -> int:
    """Return the character count (excluding leading/trailing whitespace)."""
    return len(text.strip())


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    """Clamp *value* between *low* and *high*."""
    return max(low, min(high, value))
