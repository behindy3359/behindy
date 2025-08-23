from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import logging
from datetime import datetime

from providers.llm_provider import LLMProviderFactory
from services.story_service import StoryService
from models.request_models import StoryGenerationRequest, StoryContinueRequest
from models.response_models import StoryGenerationResponse, StoryContinueResponse, OptionData
from utils.rate_limiter import RateLimiter

from models.batch_models import BatchStoryRequest, BatchStoryResponse
from services.batch_story_service import BatchStoryService


# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱
app = FastAPI(
    title="Behindy AI Server",
    description="지하철 스토리 생성용 게이트웨이",
    version="2.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
story_service = StoryService()
rate_limiter = RateLimiter()

# ===== 헬스체크 및 상태 =====

@app.get("/")
async def root():
    """기본 헬스 체크"""
    provider = LLMProviderFactory.get_provider()
    
    return {
        "message": "Behindy AI Server (Enhanced)",
        "status": "healthy",
        "provider": provider.get_provider_name(),
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    provider = LLMProviderFactory.get_provider()
    available_providers = LLMProviderFactory.get_available_providers()
    
    return {
        "status": "healthy",
        "current_provider": provider.get_provider_name(),
        "available_providers": available_providers,
        "supported_stations": len(story_service.get_supported_stations()),
        "total_requests": rate_limiter.get_total_requests(),
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
            "openai_model": os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            "claude_model": os.getenv("CLAUDE_MODEL", "claude-3-haiku"),
            "local_model": os.getenv("LOCAL_LLM_MODEL", "llama2:7b")
        }
    }

# ===== 스토리 생성 API =====

@app.post("/generate-story", response_model=StoryGenerationResponse)
async def generate_story(request: StoryGenerationRequest, http_request: Request):
    """새로운 스토리 생성 (실제 LLM 사용)"""
    try:
        # Rate Limiting
        client_ip = http_request.client.host
        rate_limiter.check_rate_limit(client_ip)
        
        logger.info(f"스토리 생성 요청: {request.station_name} ({request.line_number}호선) - Provider: {LLMProviderFactory.get_provider().get_provider_name()}")
        
        # 스토리 생성 (실제 LLM 또는 Mock)
        response = await story_service.generate_story(request)
        
        logger.info(f"스토리 생성 완료: {response.story_title}")
        return response
        
    except HTTPException:
        raise  # Rate limit 오류는 그대로 전달
    except Exception as e:
        logger.error(f"스토리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류: {str(e)}")

@app.post("/continue-story", response_model=StoryContinueResponse)
async def continue_story(request: StoryContinueRequest, http_request: Request):
    """스토리 진행 (실제 LLM 사용)"""
    try:
        # Rate Limiting
        client_ip = http_request.client.host
        rate_limiter.check_rate_limit(client_ip)
        
        logger.info(f"스토리 진행 요청: {request.station_name}, 선택: {request.previous_choice}")
        
        # 스토리 진행
        response = await story_service.continue_story(request)
        
        logger.info(f"스토리 진행 완료: {len(response.options)}개 선택지")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"스토리 진행 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 진행 중 오류: {str(e)}")

# ===== 메타데이터 API =====

@app.get("/stations")
async def get_supported_stations():
    """지원되는 역 목록"""
    stations = story_service.get_supported_stations()
    return {
        "stations": stations,
        "total_count": len(stations),
        "supported_lines": [1, 2, 3, 4]
    }

@app.get("/popular-stations")
async def get_popular_stations():
    """인기 역 통계"""
    popular = story_service.get_popular_stations()
    return {
        "popular_stations": popular,
        "total_requests": rate_limiter.get_total_requests()
    }

# ===== 테스트 API =====

@app.post("/test-provider")
async def test_provider(test_request: Dict[str, Any]):
    """Provider 테스트용 엔드포인트"""
    try:
        provider = LLMProviderFactory.get_provider()
        
        # 간단한 테스트 요청
        test_story = await provider.generate_story(
            "테스트 스토리를 생성해주세요.",
            station_name="강남",
            line_number=2,
            character_health=80,
            character_sanity=80
        )
        
        return {
            "provider": provider.get_provider_name(),
            "status": "success",
            "test_result": test_story,
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
        "local_llm_url": os.getenv("LOCAL_LLM_URL", "http://localhost:11434"),
        "request_limits": {
            "per_hour": os.getenv("REQUEST_LIMIT_PER_HOUR", "100"),
            "per_day": os.getenv("REQUEST_LIMIT_PER_DAY", "1000")
        }
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
        
        logger.info("=" * 50)
        logger.info("🚀 Behindy AI Server 시작")
        logger.info(f"📡 현재 Provider: {provider.get_provider_name()}")
        logger.info(f"🔧 사용 가능한 Providers: {available}")
        logger.info(f"🎯 지원 역 개수: {len(story_service.get_supported_stations())}")
        logger.info("=" * 50)
        
    except Exception as e:
        logger.error(f"초기화 중 오류: {str(e)}")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 서비스 초기화에 추가
batch_story_service = BatchStoryService()

# ===== 배치 스토리 생성 API (Spring Boot 전용) =====

@app.post("/generate-complete-story", response_model=BatchStoryResponse)
async def generate_complete_story(request: BatchStoryRequest, http_request: Request):
    """Spring Boot 배치 시스템용 완전한 스토리 생성"""
    try:
        # 내부 API 키 검증
        api_key = http_request.headers.get("X-Internal-API-Key")
        if api_key != "behindy-internal-2024-secret-key":
            raise HTTPException(status_code=403, detail="Unauthorized internal API access")
        
        logger.info(f"배치 스토리 생성 요청: {request.station_name}역 ({request.line_number}호선)")
        
        # 완전한 스토리 생성
        response = await batch_story_service.generate_complete_story(request)
        
        logger.info(f"배치 스토리 생성 완료: {response.story_title} ({len(response.pages)}페이지)")
        return response
        
    except HTTPException:
        raise  # 인증 오류는 그대로 전달
    except Exception as e:
        logger.error(f"배치 스토리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류: {str(e)}")

@app.post("/validate-story-structure")
async def validate_story_structure(validation_request: Dict[str, Any], http_request: Request):
    """스토리 구조 검증 (내부 API)"""
    try:
        # 내부 API 키 검증
        api_key = http_request.headers.get("X-Internal-API-Key")
        if api_key != "behindy-internal-2024-secret-key":
            raise HTTPException(status_code=403, detail="Unauthorized internal API access")
        
        logger.info("스토리 구조 검증 요청")
        
        validation_result = await batch_story_service.validate_story_structure(
            validation_request.get("story_data", {})
        )
        
        return validation_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"구조 검증 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"검증 중 오류: {str(e)}")

@app.get("/batch/system-status")
async def get_batch_system_status(http_request: Request):
    """배치 시스템 상태 (내부 API)"""
    try:
        # 내부 API 키 검증 (선택적)
        api_key = http_request.headers.get("X-Internal-API-Key")
        
        provider = LLMProviderFactory.get_provider()
        available_providers = LLMProviderFactory.get_available_providers()
        
        return {
            "ai_server_status": "healthy",
            "current_provider": provider.get_provider_name(),
            "available_providers": available_providers,
            "batch_service_ready": True,
            "supported_stations": len(story_service.get_supported_stations()),
            "quality_stats": story_service.get_quality_stats(),
            "rate_limit_status": {
                "total_requests": rate_limiter.get_total_requests(),
                "hit_rate": "N/A"
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"배치 시스템 상태 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"상태 조회 중 오류: {str(e)}")