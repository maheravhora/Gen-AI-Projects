"""
LinguaSense AI — PDF Router.

Endpoints:
  POST /pdf — Upload PDF → extracted text
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.controllers import pdf_controller
from app.models.schemas import PdfResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["PDF"])


@router.post(
    "/pdf",
    response_model=PdfResponse,
    summary="Extract text from a PDF document",
)
async def extract_text_from_pdf(
    file: UploadFile = File(..., description="PDF file"),
) -> PdfResponse:
    try:
        return await pdf_controller.process_pdf(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc),
        )
    except Exception as exc:
        logger.exception("PDF extraction error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF processing failed: {exc}",
        )
