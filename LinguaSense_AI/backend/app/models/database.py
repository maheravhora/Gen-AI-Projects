"""
LinguaSense AI — SQLAlchemy ORM Models.
"""

from __future__ import annotations

import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class TranslationHistory(Base):
    """Stores every translation request and its results."""

    __tablename__ = "translation_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_text: Mapped[str] = mapped_column(Text, nullable=False)
    translated_text: Mapped[str] = mapped_column(Text, nullable=False)
    source_lang: Mapped[str] = mapped_column(String(50), nullable=False)
    target_lang: Mapped[str] = mapped_column(String(50), nullable=False)
    tone: Mapped[str | None] = mapped_column(String(50), nullable=True, default=None)
    context: Mapped[str | None] = mapped_column(String(200), nullable=True, default=None)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    emotion: Mapped[str | None] = mapped_column(String(50), nullable=True, default=None)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    is_favorite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return (
            f"<TranslationHistory id={self.id} "
            f"{self.source_lang}→{self.target_lang} "
            f"fav={self.is_favorite}>"
        )
