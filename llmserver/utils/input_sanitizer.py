"""
프롬프트 인젝션 방어를 위한 입력 살균
"""

import re
import logging

logger = logging.getLogger(__name__)

# 위험한 패턴 목록
DANGEROUS_PATTERNS = [
    r"ignore.*previous.*instructions?",
    r"disregard.*above",
    r"forget.*instructions?",
    r"system.*prompt",
    r"you.*are.*now",
    r"act.*as",
    r"pretend.*you.*are",
    r"role.*play",
    r"<script",
    r"javascript:",
    r"onerror=",
    r"onclick=",
]

# 허용할 문자 패턴 (한글, 영문, 숫자, 기본 구두점)
ALLOWED_PATTERN = re.compile(r'^[가-힣a-zA-Z0-9\s.,!?\'"\-()]+$')

def sanitize_input(text: str, max_length: int = 500) -> str:
    """
    입력 텍스트를 살균하여 프롬프트 인젝션 방지

    Args:
        text: 살균할 입력 텍스트
        max_length: 최대 허용 길이

    Returns:
        살균된 텍스트

    Raises:
        ValueError: 위험한 패턴이 감지되거나 허용되지 않는 문자가 포함된 경우
    """
    if not text:
        return ""

    # 1. 길이 제한
    if len(text) > max_length:
        logger.warning(f"입력 길이 초과: {len(text)} > {max_length}")
        text = text[:max_length]

    # 2. 위험한 패턴 검사
    text_lower = text.lower()
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            logger.error(f"위험한 패턴 감지: {pattern}")
            raise ValueError("입력에 허용되지 않는 패턴이 포함되어 있습니다.")

    # 3. 허용된 문자만 포함 확인
    if not ALLOWED_PATTERN.match(text):
        logger.error(f"허용되지 않는 문자 포함: {text}")
        # 허용된 문자만 필터링
        text = re.sub(r'[^가-힣a-zA-Z0-9\s.,!?\'"\\-()]', '', text)
        logger.info(f"문자 필터링 후: {text}")

    # 4. 공백 정규화
    text = ' '.join(text.split())

    return text.strip()


def sanitize_station_name(station_name: str) -> str:
    """역 이름 살균 (한글, 영문, 숫자만 허용)"""
    if not station_name:
        raise ValueError("역 이름은 필수입니다.")

    # 한글, 영문, 숫자만 허용
    sanitized = re.sub(r'[^가-힣a-zA-Z0-9]', '', station_name)

    if not sanitized:
        raise ValueError("유효한 역 이름이 아닙니다.")

    if len(sanitized) > 50:
        raise ValueError("역 이름이 너무 깁니다.")

    return sanitized


def sanitize_choice(choice: str) -> str:
    """선택지 살균"""
    return sanitize_input(choice, max_length=200)
