"""
LinguaSense AI — OCR Router.

Endpoints:
  POST /ocr — Upload image → extracted text
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.controllers import ocr_controller
from app.models.schemas import OcrResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["OCR"])


@router.post(
    "/ocr",
    response_model=OcrResponse,
    summary="Extract text from an image (OCR)",
)
async def extract_text_from_image(
    file: UploadFile = File(..., description="Image file (png, jpg, jpeg, bmp, tiff, webp)"),
) -> OcrResponse:
    try:
        return await ocr_controller.process_ocr(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("OCR error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {exc}",
        )
