"""
LinguaSense AI — PDF Controller.

Handles PDF upload, validates file, extracts text, and returns
structured results.
"""

from __future__ import annotations

import logging
from pathlib import Path

from fastapi import UploadFile

from app.config import get_settings
from app.models.schemas import PdfResponse
from app.services import pdf_service
from app.utils.helpers import (
    char_count,
    cleanup_files,
    generate_unique_filename,
    get_file_size_mb,
    validate_file_extension,
    word_count,
)

logger = logging.getLogger(__name__)
_settings = get_settings()


async def process_pdf(file: UploadFile) -> PdfResponse:
    """Process an uploaded PDF and return extracted text."""
    filename = file.filename or "document.pdf"

    if not validate_file_extension(filename, _settings.ALLOWED_PDF_EXTENSIONS):
        raise ValueError(
            f"Unsupported file format. Only PDF files are allowed."
        )

    upload_dir = _settings.upload_path
    temp_name = generate_unique_filename(".pdf")
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

        text, page_count = pdf_service.extract_text_from_pdf(temp_path)

        return PdfResponse(
            text=text,
            page_count=page_count,
            word_count=word_count(text),
            char_count=char_count(text),
        )

    finally:
        cleanup_files(temp_path)
