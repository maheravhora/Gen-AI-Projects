"""
LinguaSense AI — OCR Controller.

Handles image upload, validates file, delegates to OCR service, and
returns structured results.
"""

from __future__ import annotations

import logging
from pathlib import Path

from fastapi import UploadFile

from app.config import get_settings
from app.models.schemas import OcrResponse
from app.services import ocr_service
from app.utils.helpers import (
    cleanup_files,
    generate_unique_filename,
    get_file_size_mb,
    validate_file_extension,
    word_count,
)

logger = logging.getLogger(__name__)
_settings = get_settings()


async def process_ocr(file: UploadFile) -> OcrResponse:
    """Process an uploaded image and return extracted text."""
    filename = file.filename or "image.png"

    if not validate_file_extension(filename, _settings.ALLOWED_IMAGE_EXTENSIONS):
        raise ValueError(
            f"Unsupported image format. Allowed: {_settings.ALLOWED_IMAGE_EXTENSIONS}"
        )

    upload_dir = _settings.upload_path
    ext = Path(filename).suffix
    temp_name = generate_unique_filename(ext)
    temp_path = upload_dir / temp_name

    try:
        content = await file.read()
        temp_path.write_bytes(content)

        size_mb = get_file_size_mb(temp_path)
        if size_mb > _settings.MAX_FILE_SIZE_MB:
            raise ValueError(
                f"File too large ({size_mb:.1f} MB). "
                f"Max: {_settings.MAX_FILE_SIZE_MB} MB."
            )

        ocr_langs = [l.strip() for l in _settings.OCR_LANGUAGES.split(",")]
        text, confidence = ocr_service.extract_text_from_image(
            temp_path,
            languages=ocr_langs,
            gpu=_settings.OCR_GPU,
        )

        return OcrResponse(
            text=text,
            confidence=confidence,
            language=_settings.OCR_LANGUAGES,
            word_count=word_count(text),
        )

    finally:
        cleanup_files(temp_path)
