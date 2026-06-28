"""
LinguaSense AI — Translation Service.

Lazy-loads the facebook/nllb-200-distilled-600M model on first use
with thread-safe locking.  All inference runs on CPU.
"""

from __future__ import annotations

import logging
import threading
from typing import Any, Dict, List, Optional, Tuple

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

from app.config import get_settings
from app.utils.language_codes import get_language_name, get_nllb_code

logger = logging.getLogger(__name__)

_settings = get_settings()

# ── Thread-safe lazy loading ─────────────────────────────────────────────────
_model: Optional[AutoModelForSeq2SeqLM] = None
_tokenizer: Optional[AutoTokenizer] = None
_lock = threading.Lock()
_model_loaded = False


def is_model_loaded() -> bool:
    """Check if the translation model has been loaded."""
    return _model_loaded


def _load_model() -> Tuple[AutoModelForSeq2SeqLM, AutoTokenizer]:
    """Load model + tokenizer inside a lock (called once)."""
    global _model, _tokenizer, _model_loaded

    if _model is not None and _tokenizer is not None:
        return _model, _tokenizer

    with _lock:
        # Double-checked locking
        if _model is not None and _tokenizer is not None:
            return _model, _tokenizer

        logger.info("Loading translation model: %s …", _settings.MODEL_NAME)
        _tokenizer = AutoTokenizer.from_pretrained(
            _settings.MODEL_NAME,
            use_fast=True,
        )
        _model = AutoModelForSeq2SeqLM.from_pretrained(
            _settings.MODEL_NAME,
            torch_dtype=torch.float32,
        )
        _model.eval()
        _model_loaded = True
        logger.info("Translation model loaded successfully.")
        return _model, _tokenizer


def _get_model_and_tokenizer() -> Tuple[AutoModelForSeq2SeqLM, AutoTokenizer]:
    """Public accessor that triggers lazy loading."""
    return _load_model()


# ──────────────────────────────────────────────────────────────────────────────
# Core translation
# ──────────────────────────────────────────────────────────────────────────────

def translate_text(
    text: str,
    source_lang: str,
    target_lang: str,
    max_length: int = 512,
) -> Tuple[str, float]:
    """
    Translate *text* from *source_lang* to *target_lang*.

    Parameters
    ----------
    text : str
        Source text to translate.
    source_lang : str
        Source NLLB flores code **or** language name / ISO code (resolved internally).
    target_lang : str
        Target NLLB flores code **or** language name / ISO code.
    max_length : int
        Maximum token length for the generated sequence.

    Returns
    -------
    (translated_text, confidence)
        The translated string and a confidence score 0-100.
    """
    model, tokenizer = _get_model_and_tokenizer()

    # Resolve codes
    src_code = get_nllb_code(source_lang)
    tgt_code = get_nllb_code(target_lang)

    if src_code is None:
        raise ValueError(f"Unsupported source language: {source_lang}")
    if tgt_code is None:
        raise ValueError(f"Unsupported target language: {target_lang}")

    # Set source language for tokenizer
    tokenizer.src_lang = src_code

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=max_length,
    )

    # Get the target language token id
    forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_code)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            forced_bos_token_id=forced_bos_token_id,
            max_new_tokens=max_length,
            num_beams=5,
            length_penalty=1.0,
            early_stopping=True,
            return_dict_in_generate=True,
            output_scores=True,
        )

    translated = tokenizer.batch_decode(
        outputs.sequences,
        skip_special_tokens=True,
    )[0]

    # ── Confidence estimation ────────────────────────────────────────────
    confidence = _compute_confidence(outputs, inputs, translated, text)

    return translated.strip(), confidence


def _compute_confidence(
    outputs: Any,
    inputs: Any,
    translated: str,
    source: str,
) -> float:
    """
    Heuristic confidence score (0-100) based on:
      - Sequence scores from beam search
      - Length ratio between source and translation
      - Whether the output is non-empty
    """
    try:
        if hasattr(outputs, "sequences_scores") and outputs.sequences_scores is not None:
            # Normalised log-probability → rough confidence
            raw_score = outputs.sequences_scores[0].item()
            # Map log-prob (typically -2…0) to 0-100
            prob = min(1.0, max(0.0, (raw_score + 3.0) / 3.0))
            base_confidence = prob * 100.0
        else:
            base_confidence = 70.0  # fallback

        # Penalise extreme length ratios
        src_len = max(len(source.split()), 1)
        tgt_len = max(len(translated.split()), 1)
        ratio = tgt_len / src_len
        if ratio > 3.0 or ratio < 0.2:
            base_confidence *= 0.8
        elif ratio > 2.0 or ratio < 0.4:
            base_confidence *= 0.9

        # Empty translation → low confidence
        if not translated.strip():
            base_confidence = 5.0

        return round(min(100.0, max(0.0, base_confidence)), 2)

    except Exception:
        logger.debug("Confidence computation fell back to default", exc_info=True)
        return 65.0


# ──────────────────────────────────────────────────────────────────────────────
# Generate alternative translations with different tones
# ──────────────────────────────────────────────────────────────────────────────

def generate_alternatives(
    text: str,
    source_lang: str,
    target_lang: str,
    current_tone: Optional[str] = None,
) -> List[Dict[str, str]]:
    """
    Generate up to 3 alternative translations with different tones.

    Since NLLB-200 doesn't natively handle tone, we prepend light
    prompt cues before translating and label the results.
    """
    tones = ["formal", "friendly", "simple"]
    if current_tone and current_tone in tones:
        tones = [t for t in tones if t != current_tone]
    tones = tones[:3]

    tone_prefixes = {
        "formal": "In formal language: ",
        "friendly": "In casual friendly language: ",
        "simple": "In simple language: ",
        "professional": "In professional language: ",
        "academic": "In academic language: ",
    }

    alternatives: List[Dict[str, str]] = []
    for tone in tones:
        try:
            prefix = tone_prefixes.get(tone, "")
            modified_text = f"{prefix}{text}" if prefix else text
            translated, conf = translate_text(modified_text, source_lang, target_lang)

            # Remove the prefix echo if model repeats it
            for p in tone_prefixes.values():
                if translated.startswith(p):
                    translated = translated[len(p):]

            alternatives.append({
                "tone": tone,
                "text": translated.strip(),
                "confidence": str(round(conf, 2)),
            })
        except Exception as exc:
            logger.warning("Alternative generation failed for tone=%s: %s", tone, exc)

    return alternatives
