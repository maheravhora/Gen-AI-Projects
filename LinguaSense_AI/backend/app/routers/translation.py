"""
LinguaSense AI — Translation Router.

Endpoints:
  POST /translate         — Full translation pipeline
  POST /detect-language   — Language detection only
  POST /grammar           — Grammar check only
  POST /emotion           — Emotion detection only
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import translation_controller
from app.database.connection import get_db
from app.models.schemas import (
    EmotionRequest,
    EmotionResponse,
    ErrorResponse,
    GrammarCorrection,
    GrammarRequest,
    GrammarResponse,
    LanguageDetectionRequest,
    LanguageDetectionResponse,
    TranslationRequest,
    TranslationResponse,
)
from app.services import emotion_service, grammar_service, language_detection

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Translation"])


# ──────────────────────────────────────────────────────────────────────────────
# POST /translate
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/translate",
    response_model=TranslationResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    summary="Translate text (full pipeline)",
)
async def translate(
    request: TranslationRequest,
    db: AsyncSession = Depends(get_db),
) -> TranslationResponse:
    """
    Run the full translation pipeline:
    detect language → grammar check → emotion detect → tone adapt →
    translate → alternatives → quality metrics → explanation → save history.
    """
    try:
        return await translation_controller.run_translation_pipeline(request, db)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception("Unexpected error in /translate")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during translation.",
        )


# ──────────────────────────────────────────────────────────────────────────────
# POST /detect-language
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/detect-language",
    response_model=LanguageDetectionResponse,
    summary="Detect the language of text",
)
async def detect_language(
    request: LanguageDetectionRequest,
) -> LanguageDetectionResponse:
    try:
        result = language_detection.detect_language_detailed(request.text)
        return LanguageDetectionResponse(
            detected_language=result["detected_language"],
            confidence=result["confidence"],
            nllb_code=result["nllb_code"],
            all_detected=result["all_detected"],
        )
    except Exception as exc:
        logger.exception("Language detection error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Language detection failed: {exc}",
        )


# ──────────────────────────────────────────────────────────────────────────────
# POST /grammar
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/grammar",
    response_model=GrammarResponse,
    summary="Check grammar of text",
)
async def check_grammar(request: GrammarRequest) -> GrammarResponse:
    try:
        corrected, corrections_raw, is_correct = grammar_service.check_grammar(
            request.text,
            language=request.language,
        )
        corrections = [
            GrammarCorrection(
                original=c["original"],
                corrected=c["corrected"],
                rule=c["rule"],
                message=c["message"],
            )
            for c in corrections_raw
        ]
        return GrammarResponse(
            original_text=request.text,
            corrected_text=corrected,
            corrections=corrections,
            is_correct=is_correct,
        )
    except Exception as exc:
        logger.exception("Grammar check error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grammar check failed: {exc}",
        )


# ──────────────────────────────────────────────────────────────────────────────
# POST /emotion
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/emotion",
    response_model=EmotionResponse,
    summary="Detect emotion in text",
)
async def detect_emotion(request: EmotionRequest) -> EmotionResponse:
    try:
        emotion, confidence, all_emotions = emotion_service.detect_emotion(
            request.text
        )
        return EmotionResponse(
            emotion=emotion,
            confidence=confidence,
            all_emotions=all_emotions,
        )
    except Exception as exc:
        logger.exception("Emotion detection error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Emotion detection failed: {exc}",
        )
