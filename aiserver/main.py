# aiserver/main.py
"""
FastAPI AI Server for Behindy Game
LLM Provider 추상화 기반 스토리 생성 서버
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime
import logging

from providers.llm_provider import LLMProviderFactory
from models.request_models import StoryGenerationRequest, StoryContinueRequest
from models.response_models import StoryGenerationResponse, StoryContinueResponse
from services.story_service import StoryService
from services.cache_service import CacheService
from utils.rate_limiter import RateLimiter
from config.settings import Settings

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI(
    title="Behindy AI Story Server",
    description="지하철 노선도 기반 텍스트 어드벤처 게임 스토리 생성 서버",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용, 운영시에는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 전역 설정
settings = Settings()
story_service = StoryService()
cache_service = CacheService()
rate_limiter = RateLimiter()

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "message": "Behindy AI Server",
        "status": "healthy",
        "provider": settings.AI_PROVIDER,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    provider = LLMProviderFactory.get_provider()
    return {
        "status": "healthy",
        "provider": provider.get_provider_name(),
        "cache_status": cache_service.is_healthy(),
        "rate_limit_status": rate_limiter.get_status(),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate-story", response_model=StoryGenerationResponse)
async def generate_story(
    request: StoryGenerationRequest,
    rate_limit_check = Depends(rate_limiter.check_rate_limit)
):
    """새로운 스토리 생성"""
    try:
        logger.info(f"스토리 생성 요청: {request.station_name} ({request.line_number}호선)")
        
        # 캐시 확인
        cache_key = f"story:{request.station_name}:{request.line_number}"
        cached_story = cache_service.get_story(cache_key)
        
        if cached_story and settings.USE_CACHE:
            logger.info("캐시에서 스토리 반환")
            return cached_story
        
        # 스토리 생성
        story = await story_service.generate_story(request)
        
        # 캐시 저장
        if settings.USE_CACHE:
            cache_service.save_story(cache_key, story, ttl=settings.CACHE_TTL)
        
        return story
        
    except Exception as e:
        logger.error(f"스토리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류 발생: {str(e)}")

@app.post("/continue-story", response_model=StoryContinueResponse)
async def continue_story(
    request: StoryContinueRequest,
    rate_limit_check = Depends(rate_limiter.check_rate_limit)
):
    """스토리 진행"""
    try:
        logger.info(f"스토리 진행 요청: {request.station_name}, 선택: {request.previous_choice}")
        
        # 스토리 진행
        continuation = await story_service.continue_story(request)
        
        return continuation
        
    except Exception as e:
        logger.error(f"스토리 진행 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 진행 중 오류 발생: {str(e)}")

@app.get("/stations")
async def get_supported_stations():
    """지원되는 역 목록 반환"""
    return story_service.get_supported_stations()

@app.get("/stats")
async def get_stats():
    """사용 통계"""
    return {
        "total_requests": rate_limiter.get_total_requests(),
        "cache_hit_rate": cache_service.get_hit_rate(),
        "popular_stations": story_service.get_popular_stations(),
        "timestamp": datetime.now().isoformat()
    }