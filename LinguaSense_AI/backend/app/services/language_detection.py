"""
LinguaSense AI — Language Detection Service.

Uses the ``langdetect`` library with fallback logic and
bridges ISO-639-1 codes to NLLB-200 flores codes.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional, Tuple

from langdetect import DetectorFactory, detect, detect_langs
from langdetect.lang_detect_exception import LangDetectException

from app.utils.language_codes import ISO_639_TO_NLLB, get_language_name, get_nllb_code

logger = logging.getLogger(__name__)

# Make langdetect deterministic
DetectorFactory.seed = 0


def detect_language(text: str) -> Tuple[str, float, Optional[str]]:
    """
    Detect the language of *text*.

    Returns
    -------
    (iso_code, confidence, nllb_code)
        The ISO-639-1 code, probability (0-1), and the corresponding NLLB
        flores code (or None if unmapped).
    """
    if not text or not text.strip():
        return "en", 0.0, "eng_Latn"

    try:
        results = detect_langs(text)
        if not results:
            return "en", 0.0, "eng_Latn"

        top = results[0]
        iso_code = str(top.lang)
        confidence = round(float(top.prob), 4)
        nllb_code = ISO_639_TO_NLLB.get(iso_code)

        return iso_code, confidence, nllb_code

    except LangDetectException as exc:
        logger.warning("Language detection failed: %s", exc)
        return "en", 0.0, "eng_Latn"


def detect_language_detailed(text: str) -> Dict[str, object]:
    """
    Return detailed detection results for all candidate languages.

    Returns a dict with keys:
      - detected_language  (str)  — human-readable name
      - confidence         (float)
      - nllb_code          (str | None)
      - all_detected       (list of dicts)
    """
    if not text or not text.strip():
        return {
            "detected_language": "english",
            "confidence": 0.0,
            "nllb_code": "eng_Latn",
            "all_detected": [],
        }

    try:
        results = detect_langs(text)
    except LangDetectException:
        return {
            "detected_language": "english",
            "confidence": 0.0,
            "nllb_code": "eng_Latn",
            "all_detected": [],
        }

    all_detected: List[Dict[str, object]] = []
    for r in results:
        iso = str(r.lang)
        nllb = ISO_639_TO_NLLB.get(iso)
        name = get_language_name(nllb) if nllb else iso
        all_detected.append({
            "language": name,
            "confidence": round(float(r.prob), 4),
            "nllb_code": nllb,
        })

    top = results[0]
    iso_top = str(top.lang)
    nllb_top = ISO_639_TO_NLLB.get(iso_top)
    name_top = get_language_name(nllb_top) if nllb_top else iso_top

    return {
        "detected_language": name_top,
        "confidence": round(float(top.prob), 4),
        "nllb_code": nllb_top,
        "all_detected": all_detected,
    }
