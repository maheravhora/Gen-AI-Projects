"""
LinguaSense AI — OCR Service.

Uses EasyOCR for text extraction from images.
The reader is lazy-loaded on first use with thread-safe locking.
"""

from __future__ import annotations

import logging
import threading
from pathlib import Path
from typing import Any, List, Optional, Tuple

logger = logging.getLogger(__name__)

_reader: Any = None
_lock = threading.Lock()
_loaded = False


def is_ocr_loaded() -> bool:
    return _loaded


def _get_reader(languages: Optional[List[str]] = None, gpu: bool = False) -> Any:
    """Lazy-load the EasyOCR reader."""
    global _reader, _loaded

    if _reader is not None:
        return _reader

    with _lock:
        if _reader is not None:
            return _reader

        import easyocr

        langs = languages or ["en"]
        logger.info("Loading EasyOCR reader for languages: %s (GPU=%s) …", langs, gpu)
        _reader = easyocr.Reader(langs, gpu=gpu)
        _loaded = True
        logger.info("EasyOCR reader loaded.")
        return _reader


def extract_text_from_image(
    image_path: str | Path,
    languages: Optional[List[str]] = None,
    gpu: bool = False,
) -> Tuple[str, float]:
    """
    Extract text from an image file.

    Parameters
    ----------
    image_path : str | Path
        Path to the image file.
    languages : list[str] | None
        Languages to detect (EasyOCR format, e.g. ["en", "fr"]).
    gpu : bool
        Whether to use GPU for inference.

    Returns
    -------
    (extracted_text, average_confidence)
    """
    reader = _get_reader(languages, gpu)
    path_str = str(image_path)

    if not Path(path_str).exists():
        raise FileNotFoundError(f"Image file not found: {path_str}")

    results = reader.readtext(path_str)

    if not results:
        return "", 0.0

    text_parts: List[str] = []
    confidences: List[float] = []

    for detection in results:
        # Each detection: (bbox, text, confidence)
        _, text, confidence = detection
        text_parts.append(text)
        confidences.append(float(confidence))

    combined_text = " ".join(text_parts)
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

    return combined_text.strip(), round(avg_confidence * 100, 2)
