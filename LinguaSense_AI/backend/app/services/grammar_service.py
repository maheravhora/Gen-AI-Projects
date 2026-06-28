"""
LinguaSense AI — Grammar Correction Service.

Uses ``language_tool_python`` for rule-based grammar checking.
The LanguageTool Java server is started lazily on first use.
"""

from __future__ import annotations

import logging
import threading
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

_tool: Any = None
_lock = threading.Lock()
_loaded = False


def is_grammar_loaded() -> bool:
    return _loaded


def _get_tool(language: str = "en-US") -> Any:
    """Lazy-load the LanguageTool instance."""
    global _tool, _loaded

    if _tool is not None:
        return _tool

    with _lock:
        if _tool is not None:
            return _tool

        import language_tool_python

        logger.info("Starting LanguageTool server for '%s' …", language)
        _tool = language_tool_python.LanguageTool(language)
        _loaded = True
        logger.info("LanguageTool ready.")
        return _tool


def check_grammar(
    text: str,
    language: str = "en-US",
) -> Tuple[str, List[Dict[str, str]], bool]:
    """
    Check and correct grammar in *text*.

    Returns
    -------
    (corrected_text, corrections_list, is_correct)
    """
    if not text or not text.strip():
        return text, [], True

    try:
        tool = _get_tool(language)
        matches = tool.check(text)

        corrections: List[Dict[str, str]] = []
        for match in matches:
            offset = match.offset
            length = match.errorLength
            original_fragment = text[offset : offset + length]
            replacement = match.replacements[0] if match.replacements else original_fragment

            corrections.append({
                "original": original_fragment,
                "corrected": replacement,
                "rule": match.ruleId or "UNKNOWN",
                "message": match.message or "",
            })

        corrected_text = language_tool_python_correct(text, matches)
        is_correct = len(corrections) == 0

        return corrected_text, corrections, is_correct

    except Exception as exc:
        logger.error("Grammar check failed: %s", exc, exc_info=True)
        return text, [], True


def language_tool_python_correct(text: str, matches: list) -> str:
    """Apply LanguageTool matches to produce corrected text."""
    try:
        import language_tool_python
        return language_tool_python.utils.correct(text, matches)
    except Exception:
        # Manual fallback
        offset_shift = 0
        corrected = text
        for match in sorted(matches, key=lambda m: m.offset):
            if not match.replacements:
                continue
            start = match.offset + offset_shift
            end = start + match.errorLength
            replacement = match.replacements[0]
            corrected = corrected[:start] + replacement + corrected[end:]
            offset_shift += len(replacement) - match.errorLength
        return corrected
