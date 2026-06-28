"""
LinguaSense AI — Emotion Detection Service.

Keyword / pattern-based emotion detection.  Analyses lexical cues,
punctuation patterns, and capitalization to classify text into one of
several emotion categories with a confidence score.
"""

from __future__ import annotations

import re
from typing import Dict, Tuple

# ──────────────────────────────────────────────────────────────────────────────
# Emotion keyword lexicons
# ──────────────────────────────────────────────────────────────────────────────

EMOTION_KEYWORDS: Dict[str, list[str]] = {
    "happy": [
        "happy", "joy", "glad", "cheerful", "delighted", "pleased",
        "wonderful", "fantastic", "great", "amazing", "love", "loved",
        "awesome", "brilliant", "excellent", "perfect", "excited",
        "celebrate", "congratulations", "congrats", "yay", "hurray",
        "blessed", "grateful", "thankful", "smile", "laugh", "fun",
        "enjoying", "thrilled", "ecstatic", "bliss", "sunshine",
    ],
    "sad": [
        "sad", "unhappy", "depressed", "miserable", "heartbroken",
        "grief", "sorrow", "mourning", "crying", "tears", "lonely",
        "melancholy", "devastated", "disappointed", "hopeless",
        "sorry", "regret", "miss", "missing", "gloomy", "hurt",
        "pain", "suffer", "loss", "lost", "tragic", "unfortunate",
    ],
    "angry": [
        "angry", "furious", "mad", "rage", "outraged", "annoyed",
        "irritated", "frustrated", "hate", "hatred", "disgusted",
        "enraged", "livid", "hostile", "aggressive", "resentful",
        "bitter", "infuriated", "damn", "stupid", "terrible",
        "awful", "worst", "unacceptable", "ridiculous",
    ],
    "fearful": [
        "afraid", "fear", "scared", "terrified", "anxious", "worried",
        "nervous", "panic", "dread", "horror", "alarmed", "frightened",
        "uneasy", "tense", "paranoid", "phobia", "threat", "danger",
        "creepy", "spooky", "scary",
    ],
    "surprised": [
        "surprised", "shocked", "amazed", "astonished", "stunned",
        "unexpected", "unbelievable", "incredible", "wow", "omg",
        "whoa", "really", "no way", "can't believe", "startled",
    ],
    "excited": [
        "excited", "thrilled", "eager", "pumped", "stoked",
        "enthusiastic", "passionate", "energetic", "fired up",
        "looking forward", "can't wait", "hyped", "euphoric",
    ],
    "worried": [
        "worried", "concerned", "apprehensive", "uncertain",
        "doubtful", "hesitant", "insecure", "restless", "troubled",
        "bothered", "distressed", "overwhelmed", "stressed",
    ],
    "formal": [
        "hereby", "pursuant", "regarding", "furthermore", "moreover",
        "therefore", "consequently", "accordingly", "sincerely",
        "respectfully", "esteemed", "distinguished", "acknowledge",
        "compliance", "obligation", "stipulate", "herein", "whereas",
    ],
    "neutral": [
        "okay", "fine", "alright", "normal", "average", "usual",
        "standard", "regular", "common", "typical", "moderate",
    ],
}


# ──────────────────────────────────────────────────────────────────────────────
# Punctuation / structural cues
# ──────────────────────────────────────────────────────────────────────────────

def _punctuation_signals(text: str) -> Dict[str, float]:
    """Detect emotion signals from punctuation and formatting."""
    signals: Dict[str, float] = {}

    exclamation_count = text.count("!")
    question_count = text.count("?")
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    ellipsis_count = text.count("...")

    if exclamation_count >= 3:
        signals["excited"] = 0.15
        signals["happy"] = 0.10
    elif exclamation_count >= 1:
        signals["excited"] = 0.05

    if question_count >= 2:
        signals["worried"] = 0.05
        signals["surprised"] = 0.05

    if caps_ratio > 0.5 and len(text) > 5:
        signals["angry"] = 0.15
        signals["excited"] = 0.10

    if ellipsis_count >= 2:
        signals["sad"] = 0.05
        signals["worried"] = 0.05

    # Emoji-like patterns
    happy_emoji = len(re.findall(r"[:;]-?\)", text))
    sad_emoji = len(re.findall(r"[:;]-?\(", text))
    if happy_emoji:
        signals["happy"] = signals.get("happy", 0) + 0.10
    if sad_emoji:
        signals["sad"] = signals.get("sad", 0) + 0.10

    return signals


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def detect_emotion(text: str) -> Tuple[str, float, Dict[str, float]]:
    """
    Detect the dominant emotion in *text*.

    Returns
    -------
    (emotion, confidence, all_scores)
        The top emotion label, its confidence (0-1), and scores for all
        candidate emotions.
    """
    if not text or not text.strip():
        return "neutral", 1.0, {"neutral": 1.0}

    text_lower = text.lower()
    words = set(re.findall(r"\b[a-z']+\b", text_lower))

    # Score each emotion by keyword overlap
    scores: Dict[str, float] = {}
    total_keywords_matched = 0

    for emotion, keywords in EMOTION_KEYWORDS.items():
        matched = words & set(keywords)
        # Also check multi-word phrases
        phrase_matches = sum(
            1 for kw in keywords if " " in kw and kw in text_lower
        )
        count = len(matched) + phrase_matches
        total_keywords_matched += count
        scores[emotion] = float(count)

    # Add punctuation signals
    punct_signals = _punctuation_signals(text)
    for emotion, boost in punct_signals.items():
        scores[emotion] = scores.get(emotion, 0.0) + boost * 10

    # Normalise to probabilities
    total = sum(scores.values())
    if total == 0:
        return "neutral", 0.85, {"neutral": 0.85}

    normalised: Dict[str, float] = {
        k: round(v / total, 4) for k, v in scores.items()
    }

    # Pick top emotion
    top_emotion = max(normalised, key=normalised.get)  # type: ignore[arg-type]
    top_confidence = normalised[top_emotion]

    # If confidence is very low, default to neutral
    if top_confidence < 0.15:
        top_emotion = "neutral"
        top_confidence = 0.6
        normalised["neutral"] = 0.6

    return top_emotion, round(top_confidence, 4), normalised
