"""
LinguaSense AI — Pydantic Request / Response Schemas.

Every API endpoint has explicit request and response models with
full validation, examples, and documentation.
"""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ══════════════════════════════════════════════════════════════════════════════
# Translation
# ══════════════════════════════════════════════════════════════════════════════

class TranslationRequest(BaseModel):
    """Request body for the /translate endpoint."""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_lang: str = Field(
        default="auto",
        description="Source language name, ISO code, or 'auto' for detection",
    )
    target_lang: str = Field(..., min_length=1, description="Target language name or ISO code")
    tone: Optional[str] = Field(
        default=None,
        description="Desired tone: formal, professional, friendly, academic, simple",
    )
    context: Optional[str] = Field(
        default=None,
        max_length=200,
        description="Optional context hint for the translation",
    )
    correct_grammar: bool = Field(
        default=True,
        description="Run grammar correction on source text before translating",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "text": "Hello, how are you?",
                    "source_lang": "auto",
                    "target_lang": "spanish",
                    "tone": "formal",
                    "context": "business email",
                    "correct_grammar": True,
                }
            ]
        }
    }


class QualityMetrics(BaseModel):
    """Translation quality sub-model."""
    translation_confidence: float = Field(default=0.0, ge=0, le=100)
    grammar_quality: float = Field(default=100.0, ge=0, le=100)
    context_match: float = Field(default=0.0, ge=0, le=100)
    fluency: float = Field(default=0.0, ge=0, le=100)
    naturalness: float = Field(default=0.0, ge=0, le=100)
    overall_quality: float = Field(default=0.0, ge=0, le=100)


class GrammarCorrection(BaseModel):
    """Single grammar correction entry."""
    original: str
    corrected: str
    rule: str
    message: str


class TranslationResponse(BaseModel):
    """Full response from the /translate endpoint."""
    translated_text: str
    source_lang: str
    target_lang: str
    confidence: float = Field(default=0.0, ge=0, le=100)
    grammar_corrections: List[GrammarCorrection] = Field(default_factory=list)
    emotion: Optional[str] = None
    tone_score: Optional[str] = None
    context_info: Optional[str] = None
    explanation: Optional[str] = None
    alternatives: List[Dict[str, str]] = Field(default_factory=list)
    quality_metrics: QualityMetrics = Field(default_factory=QualityMetrics)
    word_count: int = 0
    char_count: int = 0
    processing_time: float = 0.0


# ══════════════════════════════════════════════════════════════════════════════
# Language Detection
# ══════════════════════════════════════════════════════════════════════════════

class LanguageDetectionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class DetectedLanguage(BaseModel):
    language: str
    confidence: float
    nllb_code: Optional[str] = None


class LanguageDetectionResponse(BaseModel):
    detected_language: str
    confidence: float
    nllb_code: Optional[str] = None
    all_detected: List[DetectedLanguage] = Field(default_factory=list)


# ══════════════════════════════════════════════════════════════════════════════
# Grammar
# ══════════════════════════════════════════════════════════════════════════════

class GrammarRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(default="en-US")


class GrammarResponse(BaseModel):
    original_text: str
    corrected_text: str
    corrections: List[GrammarCorrection] = Field(default_factory=list)
    is_correct: bool = True


# ══════════════════════════════════════════════════════════════════════════════
# Emotion
# ══════════════════════════════════════════════════════════════════════════════

class EmotionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    all_emotions: Dict[str, float] = Field(default_factory=dict)


# ══════════════════════════════════════════════════════════════════════════════
# Speech
# ══════════════════════════════════════════════════════════════════════════════

class SpeechToTextResponse(BaseModel):
    text: str
    language: Optional[str] = None
    confidence: float = 0.0
    duration: Optional[float] = None


class TextToSpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(default="en")
    slow: bool = Field(default=False)


# ══════════════════════════════════════════════════════════════════════════════
# OCR
# ══════════════════════════════════════════════════════════════════════════════

class OcrResponse(BaseModel):
    text: str
    confidence: float = 0.0
    language: Optional[str] = None
    word_count: int = 0


# ══════════════════════════════════════════════════════════════════════════════
# PDF
# ══════════════════════════════════════════════════════════════════════════════

class PdfResponse(BaseModel):
    text: str
    page_count: int = 0
    word_count: int = 0
    char_count: int = 0


# ══════════════════════════════════════════════════════════════════════════════
# History
# ══════════════════════════════════════════════════════════════════════════════

class HistoryItem(BaseModel):
    id: int
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    tone: Optional[str] = None
    context: Optional[str] = None
    confidence: float = 0.0
    emotion: Optional[str] = None
    created_at: datetime.datetime
    is_favorite: bool = False

    model_config = {"from_attributes": True}


class HistoryResponse(BaseModel):
    items: List[HistoryItem] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
    total_pages: int = 0


class FavoriteRequest(BaseModel):
    history_id: int = Field(..., gt=0)
    is_favorite: bool = Field(default=True)


# ══════════════════════════════════════════════════════════════════════════════
# Generic
# ══════════════════════════════════════════════════════════════════════════════

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = ""
    models_loaded: Dict[str, bool] = Field(default_factory=dict)
