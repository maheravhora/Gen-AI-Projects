"""
LinguaSense AI — Voice Controller.

Orchestrates speech-to-text and text-to-speech operations,
including file handling and cleanup.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from app.config import get_settings
from app.models.schemas import SpeechToTextResponse, TextToSpeechRequest
from app.services import speech_service
from app.utils.helpers import (
    cleanup_files,
    generate_unique_filename,
    get_file_size_mb,
    validate_file_extension,
)

logger = logging.getLogger(__name__)
_settings = get_settings()


async def process_speech_to_text(file: UploadFile) -> SpeechToTextResponse:
    """
    Handle an uploaded audio file, transcribe it, and clean up.
    """
    # Validate extension
    filename = file.filename or "audio.wav"
    if not validate_file_extension(filename, _settings.ALLOWED_AUDIO_EXTENSIONS):
        raise ValueError(
            f"Unsupported audio format. Allowed: {_settings.ALLOWED_AUDIO_EXTENSIONS}"
        )

    # Save upload to disk
    upload_dir = _settings.upload_path
    ext = Path(filename).suffix
    temp_name = generate_unique_filename(ext)
    temp_path = upload_dir / temp_name

    try:
        content = await file.read()
        temp_path.write_bytes(content)

        # Validate file size
        size_mb = get_file_size_mb(temp_path)
        if size_mb > _settings.MAX_FILE_SIZE_MB:
            raise ValueError(
                f"File too large ({size_mb:.1f} MB). "
                f"Max allowed: {_settings.MAX_FILE_SIZE_MB} MB."
            )

        # Transcribe
        text, language, confidence, duration = speech_service.speech_to_text(temp_path)

        return SpeechToTextResponse(
            text=text,
            language=language,
            confidence=confidence,
            duration=duration,
        )

    finally:
        cleanup_files(temp_path)


async def process_text_to_speech(request: TextToSpeechRequest) -> Path:
    """
    Generate a TTS audio file and return its path.

    The caller is responsible for streaming / cleanup.
    """
    output_path = speech_service.text_to_speech(
        text=request.text,
        language=request.language,
        slow=request.slow,
    )
    return output_path
