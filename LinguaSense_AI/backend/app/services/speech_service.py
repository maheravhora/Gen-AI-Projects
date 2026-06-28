"""
LinguaSense AI — Speech Service.

- **STT**: Uses ``faster-whisper`` (CTranslate2) for speech-to-text on CPU.
- **TTS**: Uses ``gTTS`` (Google Text-to-Speech) for text-to-speech.

Both heavy objects are lazy-loaded with thread-safe locking.
"""

from __future__ import annotations

import io
import logging
import threading
import tempfile
from pathlib import Path
from typing import Any, Optional, Tuple

from app.config import get_settings

logger = logging.getLogger(__name__)

_settings = get_settings()

# ── STT (faster-whisper) ─────────────────────────────────────────────────────
_whisper_model: Any = None
_whisper_lock = threading.Lock()
_whisper_loaded = False


def is_whisper_loaded() -> bool:
    return _whisper_loaded


def _get_whisper_model() -> Any:
    """Lazy-load the faster-whisper model."""
    global _whisper_model, _whisper_loaded

    if _whisper_model is not None:
        return _whisper_model

    with _whisper_lock:
        if _whisper_model is not None:
            return _whisper_model

        from faster_whisper import WhisperModel

        logger.info(
            "Loading faster-whisper model '%s' (device=%s, compute=%s) …",
            _settings.WHISPER_MODEL_SIZE,
            _settings.WHISPER_DEVICE,
            _settings.WHISPER_COMPUTE_TYPE,
        )
        _whisper_model = WhisperModel(
            _settings.WHISPER_MODEL_SIZE,
            device=_settings.WHISPER_DEVICE,
            compute_type=_settings.WHISPER_COMPUTE_TYPE,
        )
        _whisper_loaded = True
        logger.info("faster-whisper model loaded.")
        return _whisper_model


def speech_to_text(audio_path: str | Path) -> Tuple[str, Optional[str], float, Optional[float]]:
    """
    Transcribe an audio file to text.

    Returns
    -------
    (text, language, confidence, duration_seconds)
    """
    path = Path(audio_path)
    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {path}")

    model = _get_whisper_model()

    segments, info = model.transcribe(
        str(path),
        beam_size=5,
        best_of=5,
        vad_filter=True,
    )

    text_parts: list[str] = []
    confidences: list[float] = []

    for segment in segments:
        text_parts.append(segment.text.strip())
        if hasattr(segment, "avg_logprob"):
            # Convert log-prob to rough confidence
            import math
            prob = math.exp(segment.avg_logprob)
            confidences.append(min(1.0, max(0.0, prob)))

    full_text = " ".join(text_parts)
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0.5
    language = info.language if hasattr(info, "language") else None
    duration = info.duration if hasattr(info, "duration") else None

    return full_text.strip(), language, round(avg_confidence * 100, 2), duration


# ── TTS (gTTS) ───────────────────────────────────────────────────────────────

def text_to_speech(
    text: str,
    language: str = "en",
    slow: bool = False,
    output_path: Optional[str | Path] = None,
) -> Path:
    """
    Convert text to speech and save as MP3.

    Parameters
    ----------
    text : str
        The text to synthesize.
    language : str
        BCP-47 language code for gTTS (e.g. "en", "fr", "es").
    slow : bool
        Whether to speak slowly.
    output_path : str | Path | None
        Where to write the MP3.  If None, a temp file is created.

    Returns
    -------
    Path to the generated MP3 file.
    """
    from gtts import gTTS

    if not text.strip():
        raise ValueError("Cannot synthesize empty text")

    tts = gTTS(text=text, lang=language, slow=slow)

    if output_path:
        out = Path(output_path)
    else:
        out = Path(_settings.UPLOAD_DIR) / f"tts_{id(text) & 0xFFFFFFFF:08x}.mp3"
        out.parent.mkdir(parents=True, exist_ok=True)

    tts.save(str(out))
    logger.info("TTS audio saved to %s", out)
    return out
