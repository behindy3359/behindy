"""
API 인증 유틸리티
"""

import os
import logging
from typing import Optional
from fastapi import Header, HTTPException

logger = logging.getLogger(__name__)

# 환경변수에서 API 키 로드
PUBLIC_API_KEY = os.getenv("PUBLIC_API_KEY")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")


def verify_public_api_key(x_api_key: Optional[str] = Header(None)) -> str:
    """
    공개 API 키 검증

    Args:
        x_api_key: X-API-Key 헤더 값

    Returns:
        검증된 API 키

    Raises:
        HTTPException: 인증 실패시
    """
    if not PUBLIC_API_KEY:
        # API 키가 설정되지 않은 경우 개발 환경으로 간주하고 통과
        logger.warning("⚠️ PUBLIC_API_KEY가 설정되지 않았습니다. 개발 모드로 동작합니다.")
        return "dev-mode"

    if not x_api_key:
        logger.warning("❌ API 키가 제공되지 않았습니다.")
        raise HTTPException(
            status_code=401,
            detail="API 키가 필요합니다. X-API-Key 헤더를 포함해주세요."
        )

    if x_api_key != PUBLIC_API_KEY:
        logger.warning(f"❌ 잘못된 공개 API 키: {x_api_key[:8]}...")
        raise HTTPException(
            status_code=403,
            detail="유효하지 않은 API 키입니다."
        )

    logger.info("✅ 공개 API 키 인증 성공")
    return x_api_key


def verify_internal_api_key(x_internal_api_key: Optional[str] = Header(None)) -> str:
    """
    내부 API 키 검증 (배치 작업 등)

    Args:
        x_internal_api_key: X-Internal-API-Key 헤더 값

    Returns:
        검증된 내부 API 키

    Raises:
        HTTPException: 인증 실패시
    """
    if not INTERNAL_API_KEY:
        logger.error("❌ INTERNAL_API_KEY가 설정되지 않았습니다.")
        raise HTTPException(
            status_code=500,
            detail="서버 설정 오류: 내부 API 키가 설정되지 않았습니다."
        )

    if not x_internal_api_key:
        logger.warning("❌ 내부 API 키가 제공되지 않았습니다.")
        raise HTTPException(
            status_code=401,
            detail="내부 API 접근 권한이 필요합니다."
        )

    if x_internal_api_key != INTERNAL_API_KEY:
        logger.warning(f"❌ 잘못된 내부 API 키: {x_internal_api_key[:8]}...")
        raise HTTPException(
            status_code=403,
            detail="유효하지 않은 내부 API 키입니다."
        )

    logger.info("✅ 내부 API 키 인증 성공")
    return x_internal_api_key


def is_internal_request(x_internal_api_key: Optional[str] = Header(None)) -> bool:
    """
    내부 요청인지 확인 (인증 실패시 False 반환)

    Args:
        x_internal_api_key: X-Internal-API-Key 헤더 값

    Returns:
        내부 요청 여부
    """
    if not INTERNAL_API_KEY or not x_internal_api_key:
        return False

    return x_internal_api_key == INTERNAL_API_KEY
