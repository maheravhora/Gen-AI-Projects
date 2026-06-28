"""
LinguaSense AI — Translation Explanation Service.

Generates a concise 2-3 sentence explanation of a translation based on
context, tone, emotion, and grammar corrections applied.
"""

from __future__ import annotations

from typing import Dict, List, Optional


def generate_explanation(
    source_text: str,
    translated_text: str,
    source_lang: str,
    target_lang: str,
    tone: Optional[str] = None,
    context: Optional[str] = None,
    emotion: Optional[str] = None,
    grammar_corrections: Optional[List[Dict[str, str]]] = None,
) -> str:
    """
    Build a human-readable explanation of the translation.

    Returns a 2-3 sentence string describing what happened during
    the translation pipeline.
    """
    parts: list[str] = []

    # ── Base sentence ────────────────────────────────────────────────────
    parts.append(
        f"The text was translated from {source_lang} to {target_lang}"
        f" using the NLLB-200 neural machine translation model."
    )

    # ── Grammar ──────────────────────────────────────────────────────────
    if grammar_corrections:
        n = len(grammar_corrections)
        issues = ", ".join(
            f'"{c["original"]}" → "{c["corrected"]}"'
            for c in grammar_corrections[:3]
        )
        if n == 1:
            parts.append(
                f"One grammar correction was applied before translation: {issues}."
            )
        else:
            extra = f" (and {n - 3} more)" if n > 3 else ""
            parts.append(
                f"{n} grammar corrections were applied before translation: "
                f"{issues}{extra}."
            )

    # ── Tone ─────────────────────────────────────────────────────────────
    if tone:
        tone_descriptions = {
            "formal": "adapted to use formal, respectful language",
            "professional": "adjusted for professional business communication",
            "friendly": "softened to a warm, conversational style",
            "academic": "refined for scholarly or academic usage",
            "simple": "simplified for clarity and ease of understanding",
        }
        desc = tone_descriptions.get(tone.lower(), f"adjusted to a {tone} style")
        parts.append(f"The output was {desc}.")

    # ── Emotion ──────────────────────────────────────────────────────────
    if emotion and emotion != "neutral":
        parts.append(
            f"The source text was detected as having a \"{emotion}\" emotional tone, "
            f"which may influence nuance in the translation."
        )

    # ── Context ──────────────────────────────────────────────────────────
    if context:
        parts.append(
            f"The context \"{context}\" was considered to ensure the translation "
            f"fits the intended usage scenario."
        )

    # Limit to 2-3 sentences total (take first 3)
    explanation = " ".join(parts[:4])
    return explanation
