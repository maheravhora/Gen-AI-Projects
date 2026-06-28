"""
LinguaSense AI — Translation Controller.

Orchestrates the full translation pipeline:
  1. Language detection
  2. Grammar correction
  3. Emotion detection
  4. Tone adaptation
  5. Translation
  6. Generate alternatives (3 tones)
  7. Quality metrics computation
  8. Explanation generation
  9. Save to history
"""

from __future__ import annotations

import logging
import time
from typing import Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import crud
from app.models.schemas import (
    GrammarCorrection,
    QualityMetrics,
    TranslationRequest,
    TranslationResponse,
)
from app.services import (
    emotion_service,
    explanation_service,
    grammar_service,
    language_detection,
    tone_service,
    translation_service,
)
from app.utils.helpers import char_count, clamp, word_count
from app.utils.language_codes import get_language_name, get_nllb_code

logger = logging.getLogger(__name__)


async def run_translation_pipeline(
    request: TranslationRequest,
    db: AsyncSession,
) -> TranslationResponse:
    """
    Execute the complete translation pipeline and return a fully
    populated ``TranslationResponse``.
    """
    start_time = time.perf_counter()

    source_text = request.text.strip()
    target_lang = request.target_lang.strip()
    tone = request.tone
    context = request.context

    # ── Step 1: Language detection ───────────────────────────────────────
    if request.source_lang.lower() == "auto":
        iso_code, det_confidence, nllb_src = language_detection.detect_language(source_text)
        if nllb_src is None:
            nllb_src = "eng_Latn"
        source_lang_code = nllb_src
        source_lang_name = get_language_name(nllb_src)
    else:
        source_lang_code = get_nllb_code(request.source_lang)
        if source_lang_code is None:
            source_lang_code = "eng_Latn"
        source_lang_name = get_language_name(source_lang_code)

    target_lang_code = get_nllb_code(target_lang)
    if target_lang_code is None:
        raise ValueError(f"Unsupported target language: {target_lang}")
    target_lang_name = get_language_name(target_lang_code)

    # ── Step 2: Grammar correction ───────────────────────────────────────
    grammar_corrections: List[GrammarCorrection] = []
    corrected_text = source_text
    grammar_quality = 100.0

    if request.correct_grammar:
        try:
            corrected_text, corrections_raw, is_correct = grammar_service.check_grammar(
                source_text
            )
            grammar_corrections = [
                GrammarCorrection(
                    original=c["original"],
                    corrected=c["corrected"],
                    rule=c["rule"],
                    message=c["message"],
                )
                for c in corrections_raw
            ]
            if corrections_raw:
                # Penalise quality based on number of corrections
                grammar_quality = max(
                    30.0,
                    100.0 - len(corrections_raw) * 8.0,
                )
        except Exception as exc:
            logger.warning("Grammar check skipped: %s", exc)
            corrected_text = source_text

    # ── Step 3: Emotion detection ────────────────────────────────────────
    try:
        emotion_label, emotion_conf, all_emotions = emotion_service.detect_emotion(
            source_text
        )
    except Exception as exc:
        logger.warning("Emotion detection failed: %s", exc)
        emotion_label = "neutral"
        emotion_conf = 0.0

    # ── Step 4: Tone adaptation ──────────────────────────────────────────
    text_to_translate = corrected_text
    tone_label = "neutral"
    if tone:
        try:
            text_to_translate, tone_label = tone_service.adapt_tone(
                corrected_text, tone
            )
        except Exception as exc:
            logger.warning("Tone adaptation failed: %s", exc)

    # ── Step 5: Translation ──────────────────────────────────────────────
    try:
        translated_text, confidence = translation_service.translate_text(
            text_to_translate,
            source_lang_code,
            target_lang_code,
        )
    except Exception as exc:
        logger.error("Translation failed: %s", exc, exc_info=True)
        raise RuntimeError(f"Translation failed: {exc}") from exc

    # ── Step 6: Generate alternatives ────────────────────────────────────
    alternatives: List[Dict[str, str]] = []
    try:
        alternatives = translation_service.generate_alternatives(
            corrected_text,
            source_lang_code,
            target_lang_code,
            current_tone=tone,
        )
    except Exception as exc:
        logger.warning("Alternative generation failed: %s", exc)

    # ── Step 7: Quality metrics ──────────────────────────────────────────
    quality_metrics = _compute_quality_metrics(
        confidence=confidence,
        grammar_quality=grammar_quality,
        context=context,
        source_text=source_text,
        translated_text=translated_text,
    )

    # ── Step 8: Explanation ──────────────────────────────────────────────
    explanation = ""
    try:
        corrections_for_explain = [
            {"original": g.original, "corrected": g.corrected}
            for g in grammar_corrections
        ]
        explanation = explanation_service.generate_explanation(
            source_text=source_text,
            translated_text=translated_text,
            source_lang=source_lang_name,
            target_lang=target_lang_name,
            tone=tone_label if tone_label != "neutral" else None,
            context=context,
            emotion=emotion_label,
            grammar_corrections=corrections_for_explain,
        )
    except Exception as exc:
        logger.warning("Explanation generation failed: %s", exc)

    # ── Step 9: Save to history ──────────────────────────────────────────
    try:
        await crud.create_history(
            db,
            source_text=source_text,
            translated_text=translated_text,
            source_lang=source_lang_name,
            target_lang=target_lang_name,
            tone=tone_label,
            context=context,
            confidence=confidence,
            emotion=emotion_label,
        )
    except Exception as exc:
        logger.warning("Failed to save translation history: %s", exc)

    processing_time = round(time.perf_counter() - start_time, 3)

    # ── Build response ───────────────────────────────────────────────────
    context_info = None
    if context:
        context_info = f"Translation optimized for: {context}"

    return TranslationResponse(
        translated_text=translated_text,
        source_lang=source_lang_name,
        target_lang=target_lang_name,
        confidence=confidence,
        grammar_corrections=grammar_corrections,
        emotion=emotion_label,
        tone_score=tone_label,
        context_info=context_info,
        explanation=explanation,
        alternatives=alternatives,
        quality_metrics=quality_metrics,
        word_count=word_count(translated_text),
        char_count=char_count(translated_text),
        processing_time=processing_time,
    )


def _compute_quality_metrics(
    confidence: float,
    grammar_quality: float,
    context: Optional[str],
    source_text: str,
    translated_text: str,
) -> QualityMetrics:
    """Compute a set of translation quality metrics (0-100 each)."""

    # Context match — bonus if context was provided
    context_match = 75.0 if context else 50.0

    # Fluency heuristic — based on output length sanity
    src_words = max(len(source_text.split()), 1)
    tgt_words = max(len(translated_text.split()), 1)
    ratio = tgt_words / src_words
    if 0.5 <= ratio <= 2.0:
        fluency = min(95.0, confidence * 1.05)
    elif 0.3 <= ratio <= 3.0:
        fluency = min(85.0, confidence * 0.9)
    else:
        fluency = min(60.0, confidence * 0.7)

    # Naturalness — slight randomness around confidence
    naturalness = clamp(confidence * 0.95 + 5.0, 0.0, 100.0)

    # Overall — weighted average
    overall = clamp(
        confidence * 0.30
        + grammar_quality * 0.20
        + context_match * 0.15
        + fluency * 0.20
        + naturalness * 0.15,
        0.0,
        100.0,
    )

    return QualityMetrics(
        translation_confidence=round(confidence, 2),
        grammar_quality=round(grammar_quality, 2),
        context_match=round(context_match, 2),
        fluency=round(fluency, 2),
        naturalness=round(naturalness, 2),
        overall_quality=round(overall, 2),
    )
