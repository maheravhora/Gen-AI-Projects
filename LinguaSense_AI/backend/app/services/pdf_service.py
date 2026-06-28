"""
LinguaSense AI — PDF Text Extraction Service.

Uses pdfplumber for reliable text extraction from PDF files.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Tuple

import pdfplumber

logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_path: str | Path) -> Tuple[str, int]:
    """
    Extract all text from a PDF file.

    Parameters
    ----------
    pdf_path : str | Path
        Path to the PDF file.

    Returns
    -------
    (extracted_text, page_count)
    """
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {path}")

    all_text: list[str] = []
    page_count = 0

    try:
        with pdfplumber.open(str(path)) as pdf:
            page_count = len(pdf.pages)

            for i, page in enumerate(pdf.pages):
                try:
                    text = page.extract_text()
                    if text:
                        all_text.append(text.strip())
                except Exception as exc:
                    logger.warning("Failed to extract text from page %d: %s", i + 1, exc)
                    continue

    except Exception as exc:
        logger.error("PDF extraction failed for %s: %s", path, exc, exc_info=True)
        raise RuntimeError(f"Failed to process PDF: {exc}") from exc

    combined = "\n\n".join(all_text)
    return combined, page_count
