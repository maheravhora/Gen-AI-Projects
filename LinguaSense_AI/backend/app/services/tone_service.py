"""
LinguaSense AI — Tone Adaptation Service.

Provides light textual cues / transformations to nudge the source text
towards a requested tone before it hits the translation model.
"""

from __future__ import annotations

import re
from typing import Optional, Tuple

# ──────────────────────────────────────────────────────────────────────────────
# Tone adaptation rules
# ──────────────────────────────────────────────────────────────────────────────

_INFORMAL_CONTRACTIONS = {
    "i'm": "I am",
    "you're": "you are",
    "we're": "we are",
    "they're": "they are",
    "he's": "he is",
    "she's": "she is",
    "it's": "it is",
    "can't": "cannot",
    "won't": "will not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "hasn't": "has not",
    "haven't": "have not",
    "hadn't": "had not",
    "wouldn't": "would not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "ain't": "is not",
    "gonna": "going to",
    "wanna": "want to",
    "gotta": "got to",
    "lemme": "let me",
    "kinda": "kind of",
    "sorta": "sort of",
}

_FORMAL_SUBSTITUTIONS = {
    r"\bget\b": "obtain",
    r"\bgot\b": "received",
    r"\bbuy\b": "purchase",
    r"\bbig\b": "significant",
    r"\bfix\b": "resolve",
    r"\bhelp\b": "assist",
    r"\bstart\b": "commence",
    r"\bend\b": "conclude",
    r"\btry\b": "attempt",
    r"\bneed\b": "require",
    r"\bask\b": "inquire",
    r"\btell\b": "inform",
    r"\bshow\b": "demonstrate",
    r"\bgive\b": "provide",
    r"\buse\b": "utilize",
}

_SIMPLE_SUBSTITUTIONS = {
    r"\butilize\b": "use",
    r"\bcommence\b": "start",
    r"\bterminate\b": "end",
    r"\bfacilitate\b": "help",
    r"\bimplement\b": "do",
    r"\binquire\b": "ask",
    r"\bpurchase\b": "buy",
    r"\bobtain\b": "get",
    r"\bdemonstrate\b": "show",
    r"\badditionally\b": "also",
    r"\bfurthermore\b": "also",
    r"\bconsequently\b": "so",
    r"\btherefore\b": "so",
    r"\bhowever\b": "but",
    r"\bnevertheless\b": "but",
    r"\bapproximate(ly)?\b": "about",
    r"\bsufficient\b": "enough",
    r"\bnumerous\b": "many",
}


def _expand_contractions(text: str) -> str:
    """Expand common English contractions."""
    result = text
    for contraction, expansion in _INFORMAL_CONTRACTIONS.items():
        pattern = re.compile(re.escape(contraction), re.IGNORECASE)
        result = pattern.sub(expansion, result)
    return result


def _apply_substitutions(text: str, subs: dict) -> str:
    """Apply regex substitutions from a mapping."""
    result = text
    for pattern, replacement in subs.items():
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
    return result


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def adapt_tone(text: str, tone: Optional[str] = None) -> Tuple[str, str]:
    """
    Adapt *text* to the requested *tone*.

    Returns
    -------
    (adapted_text, tone_label)
        The transformed text and a human-readable tone label.
    """
    if not tone or not text.strip():
        return text, "neutral"

    tone_lower = tone.strip().lower()

    if tone_lower in ("formal", "professional"):
        adapted = _expand_contractions(text)
        adapted = _apply_substitutions(adapted, _FORMAL_SUBSTITUTIONS)
        # Ensure sentences start with uppercase
        adapted = ". ".join(s.strip().capitalize() for s in adapted.split(". ") if s.strip())
        return adapted, tone_lower

    if tone_lower == "academic":
        adapted = _expand_contractions(text)
        adapted = _apply_substitutions(adapted, _FORMAL_SUBSTITUTIONS)
        return adapted, "academic"

    if tone_lower == "friendly":
        # Keep contractions, soften formality
        adapted = _apply_substitutions(text, _SIMPLE_SUBSTITUTIONS)
        return adapted, "friendly"

    if tone_lower == "simple":
        adapted = _apply_substitutions(text, _SIMPLE_SUBSTITUTIONS)
        # Break very long sentences
        sentences = re.split(r"(?<=[.!?])\s+", adapted)
        simplified: list[str] = []
        for sentence in sentences:
            if len(sentence.split()) > 20:
                parts = sentence.split(",")
                simplified.extend(p.strip().capitalize() + "." for p in parts if p.strip())
            else:
                simplified.append(sentence)
        adapted = " ".join(simplified)
        return adapted, "simple"

    return text, tone_lower


def get_tone_description(tone: Optional[str]) -> str:
    """Return a human-readable description of the tone."""
    descriptions = {
        "formal": "Formal and respectful language suitable for official communication",
        "professional": "Professional business language with clear and precise wording",
        "friendly": "Warm, approachable, and conversational tone",
        "academic": "Scholarly language suitable for academic papers and research",
        "simple": "Plain, easy-to-understand language with short sentences",
        "neutral": "Standard, balanced tone without specific stylistic adjustments",
    }
    if not tone:
        return descriptions["neutral"]
    return descriptions.get(tone.lower(), descriptions["neutral"])
