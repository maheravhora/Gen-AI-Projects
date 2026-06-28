"""
LinguaSense AI — Voice Router.

Endpoints:
  POST /speech-to-text   — Upload audio → transcribed text
  POST /text-to-speech   — Text → downloadable MP3 audio
"""

from __future__ import annotations

import logging
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.controllers import voice_controller
from app.models.schemas import SpeechToTextResponse, TextToSpeechRequest
from app.utils.helpers import cleanup_files

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Voice"])


@router.post(
    "/speech-to-text",
    response_model=SpeechToTextResponse,
    summary="Transcribe audio to text",
)
async def speech_to_text(
    file: UploadFile = File(..., description="Audio file (wav, mp3, ogg, flac, m4a, webm)"),
) -> SpeechToTextResponse:
    try:
        return await voice_controller.process_speech_to_text(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("Speech-to-text error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech-to-text failed: {exc}",
        )


@router.post(
    "/text-to-speech",
    summary="Convert text to speech (returns MP3)",
    responses={
        200: {
            "content": {"audio/mpeg": {}},
            "description": "MP3 audio file",
        }
    },
)
async def text_to_speech(request: TextToSpeechRequest):
    audio_path: Path | None = None
    try:
        audio_path = await voice_controller.process_text_to_speech(request)
        return FileResponse(
            path=str(audio_path),
            media_type="audio/mpeg",
            filename="speech.mp3",
            background=None,  # We handle cleanup via middleware
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("Text-to-speech error")
        # Clean up on error
        if audio_path:
            cleanup_files(audio_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Text-to-speech failed: {exc}",
        )
