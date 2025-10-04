"""
JSON 형식 로깅 유틸리티
"""
import logging
import json
from datetime import datetime
from typing import Any, Dict


class JsonFormatter(logging.Formatter):
    """JSON 형식으로 로그 메시지를 포맷팅"""

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }

        # 추가 컨텍스트 정보
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id

        # 예외 정보 추가
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)

        # 추가 필드
        if hasattr(record, 'extra_fields'):
            log_data.update(record.extra_fields)

        return json.dumps(log_data, ensure_ascii=False)


def setup_json_logging(app_name: str = "behindy-ai-server", level: int = logging.INFO):
    """JSON 로깅 설정"""

    # 루트 로거 설정
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # 기존 핸들러 제거
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # JSON 포맷 핸들러 추가
    json_handler = logging.StreamHandler()
    json_handler.setFormatter(JsonFormatter())
    root_logger.addHandler(json_handler)

    return root_logger
