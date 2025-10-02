from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import logging
from datetime import datetime
import uuid
from contextvars import ContextVar

from providers.llm_provider import LLMProviderFactory
from services.story_service import StoryService
from utils.rate_limiter import RateLimiter
from utils.api_auth import verify_internal_api_key, is_internal_request

from models.batch_models import BatchStoryRequest, BatchStoryResponse
from services.batch_story_service import BatchStoryService

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")
if not INTERNAL_API_KEY:
    raise RuntimeError("INTERNAL_API_KEY 환경변수가 설정되지 않았습니다.")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request ID 컨텍스트 변수
request_id_var = ContextVar("request_id", default=None)

app = FastAPI(
    title="Behindy AI Server",
    description="스토리 생성 서버",
    version="3.0.0"
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Internal-API-Key"],
)

logger.info(" FastAPI 서비스 초기화")

logger.info(" BatchStoryService 초기화 중...")
batch_story_service = BatchStoryService()
logger.info(f" BatchStoryService 초기화 완료: {batch_story_service}")

logger.info(" RateLimiter 초기화 중...")
rate_limiter = RateLimiter()
logger.info(f" RateLimiter 초기화 완료: {rate_limiter}")

# Provider 전역 인스턴스 (세션 재사용용)
_provider_instance = None

def get_provider_instance():
    """Get singleton provider instance for session reuse"""
    global _provider_instance
    if _provider_instance is None:
        _provider_instance = LLMProviderFactory.get_provider()
        logger.info(f"Created provider instance: {_provider_instance.get_provider_name()}")
    return _provider_instance

MAX_REQUEST_SIZE = int(os.getenv("MAX_REQUEST_SIZE", "1048576"))  # 1MB

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Request ID 추적 미들웨어"""
    request_id = str(uuid.uuid4())
    request_id_var.set(request_id)

    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id

    return response

@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")

    if content_length and int(content_length) > MAX_REQUEST_SIZE:
        logger.warning(f" 요청 크기 초과: {content_length} > {MAX_REQUEST_SIZE}")
        return {"error": "요청 크기가 너무 큽니다.", "status_code": 413}

    response = await call_next(request)
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = request_id_var.get()
    logger.info(f"[{request_id}] 들어오는 요청: {request.method} {request.url}")
    logger.info(f"[{request_id}] 클라이언트 IP: {request.client.host}")
    logger.info(f"[{request_id}] 헤더: {dict(request.headers)}")

    response = await call_next(request)

    logger.info(f"[{request_id}] 응답 상태: {response.status_code}")
    return response


@app.on_event("startup")
async def startup_event():
    """Initialize provider on startup"""
    logger.info("Starting up AI server...")
    provider = get_provider_instance()
    logger.info(f"Provider ready: {provider.get_provider_name()}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down AI server...")
    global _provider_instance
    if _provider_instance and hasattr(_provider_instance, 'close'):
        await _provider_instance.close()
        logger.info("Provider session closed")

@app.get("/")
async def root():
    """기본 헬스 체크"""
    provider = get_provider_instance()

    return {
        "message": "Behindy AI Server (Simplified)",
        "status": "healthy",
        "provider": provider.get_provider_name(),
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0",
        "endpoints": ["generate-complete-story", "health", "providers"]
    }

@app.get("/health")
async def health_check():
    """Enhanced health check with detailed system status"""
    try:
        provider = get_provider_instance()
        available_providers = LLMProviderFactory.get_available_providers()

        # Check provider connection health
        provider_health = "healthy"
        try:
            if hasattr(provider, '_session') and provider._session:
                if provider._session.closed:
                    provider_health = "session_closed"
                    logger.warning("Provider session is closed, will recreate on next request")
        except Exception as e:
            logger.error(f"Error checking provider health: {e}")
            provider_health = "unknown"

        health_status = {
            "status": "healthy",
            "current_provider": provider.get_provider_name(),
            "provider_health": provider_health,
            "available_providers": available_providers,
            "connection_pooling": {
                "enabled": hasattr(provider, '_session'),
                "session_active": hasattr(provider, '_session') and provider._session and not provider._session.closed
            },
            "rate_limiter": {
                "total_requests": rate_limiter.get_total_requests(),
                "status": "active"
            },
            "timestamp": datetime.now().isoformat(),
            "uptime_check": "ok",
            "version": "3.0.0"
        }

        return health_status

    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/providers")
async def get_providers_status():
    """Provider 상태 확인"""
    available_providers = LLMProviderFactory.get_available_providers()
    current_provider = LLMProviderFactory.get_provider()
    
    return {
        "current": current_provider.get_provider_name(),
        "available": available_providers,
        "settings": {
            "ai_provider": os.getenv("AI_PROVIDER", "mock"),
            "openai_model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            "claude_model": os.getenv("CLAUDE_MODEL", "claude-3-haiku"),
        }
    }

@app.post("/generate-complete-story", response_model=BatchStoryResponse)
async def generate_complete_story(request: BatchStoryRequest, http_request: Request):
    try:
        api_key = http_request.headers.get("X-Internal-API-Key")
        if api_key == INTERNAL_API_KEY:
            logger.info(" 내부 API 키 인증 성공")
            request_mode = "BATCH"
        else:
            logger.info(" 일반 API 호출")
            request_mode = "PUBLIC"
        
        request_id = request_id_var.get()
        logger.info(f"[{request_id}] " + "=" * 40)

        if request_mode == "PUBLIC":
            client_ip = http_request.client.host
            logger.info(f"[{request_id}] Rate Limiting 체크 시작 (IP: {client_ip})")
            rate_limiter.check_rate_limit(client_ip)
            logger.info(f"[{request_id}] Rate Limiting 통과")
        else:
            logger.info(f"[{request_id}] Rate Limiting 건너뜀")

        response = await batch_story_service.generate_complete_story(request)

        logger.info(f"[{request_id}] 스토리 생성 완료: {response.story_title}")
        logger.info(f"[{request_id}] " + "=" * 40)
        
        return response
        
    except HTTPException as e:
        logger.error(f" HTTPException 발생:")
        logger.error(f"  상태코드: {e.status_code}")
        logger.error(f"  상세 내용: {e.detail}")
        raise  # Rate limit 오류는 그대로 전달
    except Exception as e:
        logger.error(f" 스토리 생성 실패:")
        logger.error(f"  오류 타입: {type(e).__name__}")
        logger.error(f"  오류 메시지: {str(e)}")
        logger.error(f"  스택 트레이스:", exc_info=True)
        
        # 🆕 에러 발생시 fallback 응답
        logger.warning("⚠️ 에러 발생으로 fallback 응답 생성")
        return BatchStoryResponse(
            story_title=f"{request.station_name}역의 이야기",
            description=f"{request.station_name}역에서 벌어지는 흥미진진한 모험",
            theme="미스터리",
            keywords=[request.station_name, f"{request.line_number}호선", "지하철"],
            pages=[
                BatchPageData(
                    content=f"{request.station_name}역에서 예상치 못한 일이 벌어집니다. 어떻게 하시겠습니까?",
                    options=[
                        BatchOptionData(
                            content="신중하게 행동한다",
                            effect="sanity",
                            amount=2,
                            effect_preview="정신력 +2"
                        ),
                        BatchOptionData(
                            content="빠르게 대응한다",
                            effect="health", 
                            amount=-1,
                            effect_preview="체력 -1"
                        )
                    ]
                )
            ],
            estimated_length=1,
            difficulty="보통",
            station_name=request.station_name,
            line_number=request.line_number
        )

# ===== 관리 및 디버깅 API =====

@app.post("/validate-story-structure")
async def validate_story_structure(validation_request: Dict[str, Any], http_request: Request):
    """스토리 구조 검증 (내부 API)"""
    try:
        # 내부 API 키 검증
        api_key = http_request.headers.get("X-Internal-API-Key")
        if api_key != INTERNAL_API_KEY:
            raise HTTPException(status_code=403, detail="Unauthorized internal API access")
        
        logger.info("스토리 구조 검증 요청")
        
        validation_result = await batch_story_service.validate_story_structure(
            validation_request.get("story_data", {})
        )
        
        return validation_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"구조 검증 실패: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="스토리 구조 검증 실패")

@app.get("/batch/system-status")
async def get_batch_system_status(http_request: Request):
    """배치 시스템 상태 (내부/공개 API)"""
    try:
        # 내부 API 키 확인 (선택적)
        api_key = http_request.headers.get("X-Internal-API-Key")
        is_internal = api_key == INTERNAL_API_KEY
        
        provider = LLMProviderFactory.get_provider()
        available_providers = LLMProviderFactory.get_available_providers()
        
        status = {
            "ai_server_status": "healthy",
            "current_provider": provider.get_provider_name(),
            "available_providers": available_providers,
            "batch_service_ready": True,
            "rate_limit_status": {
                "total_requests": rate_limiter.get_total_requests(),
                "hit_rate": "N/A"
            },
            "timestamp": datetime.now().isoformat(),
            "simplified_mode": True,
            "version": "3.0.0"
        }
        
        # 내부 요청인 경우 더 상세한 정보 제공
        if is_internal:
            status["internal_mode"] = True
            status["api_endpoints"] = ["generate-complete-story"]
        
        return status
        
    except Exception as e:
        logger.error(f"배치 시스템 상태 조회 실패: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="시스템 상태 조회 실패")

# ===== 테스트 API =====

@app.post("/test-provider")
async def test_provider(test_request: Dict[str, Any]):
    """Provider 테스트용 엔드포인트"""
    try:
        provider = LLMProviderFactory.get_provider()
        
        logger.info(" Provider 테스트 시작")
        logger.info(f"  현재 Provider: {provider.get_provider_name()}")
        logger.info(f"  테스트 요청: {test_request}")
        
        # 간단한 테스트 스토리 생성 요청
        test_request_obj = BatchStoryRequest(
            station_name=test_request.get("station_name", "강남"),
            line_number=test_request.get("line_number", 2),
            character_health=80,
            character_sanity=80,
            story_type="TEST"
        )
        
        test_result = await batch_story_service.generate_complete_story(test_request_obj)
        
        return {
            "provider": provider.get_provider_name(),
            "status": "success",
            "test_result": {
                "title": test_result.story_title,
                "theme": test_result.theme,
                "pages": len(test_result.pages)
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Provider 테스트 실패: {str(e)}")
        return {
            "provider": "unknown",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# ===== 환경 설정 API =====

@app.get("/config")
async def get_config():
    """현재 환경 설정 확인"""
    return {
        "ai_provider": os.getenv("AI_PROVIDER", "mock"),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "claude_configured": bool(os.getenv("CLAUDE_API_KEY")),
        "request_limits": {
            "per_hour": os.getenv("REQUEST_LIMIT_PER_HOUR", "100"),
            "per_day": os.getenv("REQUEST_LIMIT_PER_DAY", "1000")
        },
        "simplified_mode": True,
        "active_endpoints": [
            "/generate-complete-story",
            "/health", 
            "/providers",
            "/batch/system-status"
        ]
    }

# ===== 에러 핸들러 =====

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP 오류: {exc.status_code} - {exc.detail}")
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"일반 오류: {str(exc)}")
    return {
        "error": "내부 서버 오류가 발생했습니다.",
        "status_code": 500,
        "timestamp": datetime.now().isoformat()
    }

# ===== 서버 실행 =====

if __name__ == "__main__":
    import uvicorn
    
    # 시작시 Provider 상태 로깅
    try:
        provider = LLMProviderFactory.get_provider()
        available = LLMProviderFactory.get_available_providers()
        
        logger.info("=" * 60)
        logger.info(" Behindy AI Server 시작 (Simplified)")
        logger.info(f" 현재 Provider: {provider.get_provider_name()}")
        logger.info(f" 사용 가능한 Providers: {available}")
        logger.info(" 활성화된 엔드포인트:")
        logger.info("  - POST /generate-complete-story (통합 스토리 생성)")
        logger.info("  - GET  /health (헬스체크)")
        logger.info("  - GET  /providers (Provider 상태)")
        logger.info("  - GET  /batch/system-status (시스템 상태)")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"초기화 중 오류: {str(e)}")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)