# """
# FastAPI AI Server for Behindy Game
# LLM Provider 추상화 기반 스토리 생성 서버
# """

# from fastapi import FastAPI, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional, List
# import os
# from datetime import datetime
# import logging

# from providers.llm_provider import LLMProviderFactory
# from models.request_models import StoryGenerationRequest, StoryContinueRequest
# from models.response_models import StoryGenerationResponse, StoryContinueResponse
# from services.story_service import StoryService
# from services.cache_service import CacheService
# from utils.rate_limiter import RateLimiter
# from config.settings import Settings

# # 로깅 설정
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # FastAPI 앱 생성
# app = FastAPI(
#     title="Behindy AI Story Server",
#     description="지하철 노선도 기반 텍스트 어드벤처 게임 스토리 생성 서버",
#     version="1.0.0"
# )

# # CORS 설정
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 개발용, 운영시에는 특정 도메인으로 제한
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 전역 설정
# settings = Settings()
# story_service = StoryService()
# cache_service = CacheService()
# rate_limiter = RateLimiter()

# @app.get("/")
# async def root():
#     """헬스 체크"""
#     return {
#         "message": "Behindy AI Server",
#         "status": "healthy",
#         "provider": settings.AI_PROVIDER,
#         "timestamp": datetime.now().isoformat()
#     }

# @app.get("/health")
# async def health_check():
#     """상세 헬스 체크"""
#     provider = LLMProviderFactory.get_provider()
#     return {
#         "status": "healthy",
#         "provider": provider.get_provider_name(),
#         "cache_status": cache_service.is_healthy(),
#         "rate_limit_status": rate_limiter.get_status(),
#         "timestamp": datetime.now().isoformat()
#     }

# @app.post("/generate-story", response_model=StoryGenerationResponse)
# async def generate_story(
#     request: StoryGenerationRequest,
#     rate_limit_check = Depends(rate_limiter.check_rate_limit)
# ):
#     """새로운 스토리 생성"""
#     try:
#         logger.info(f"스토리 생성 요청: {request.station_name} ({request.line_number}호선)")
        
#         # 캐시 확인
#         cache_key = f"story:{request.station_name}:{request.line_number}"
#         cached_story = cache_service.get_story(cache_key)
        
#         if cached_story and settings.USE_CACHE:
#             logger.info("캐시에서 스토리 반환")
#             return cached_story
        
#         # 스토리 생성
#         story = await story_service.generate_story(request)
        
#         # 캐시 저장
#         if settings.USE_CACHE:
#             cache_service.save_story(cache_key, story, ttl=settings.CACHE_TTL)
        
#         return story
        
#     except Exception as e:
#         logger.error(f"스토리 생성 실패: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류 발생: {str(e)}")

# @app.post("/continue-story", response_model=StoryContinueResponse)
# async def continue_story(
#     request: StoryContinueRequest,
#     rate_limit_check = Depends(rate_limiter.check_rate_limit)
# ):
#     """스토리 진행"""
#     try:
#         logger.info(f"스토리 진행 요청: {request.station_name}, 선택: {request.previous_choice}")
        
#         # 스토리 진행
#         continuation = await story_service.continue_story(request)
        
#         return continuation
        
#     except Exception as e:
#         logger.error(f"스토리 진행 실패: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"스토리 진행 중 오류 발생: {str(e)}")

# @app.get("/stations")
# async def get_supported_stations():
#     """지원되는 역 목록 반환"""
#     return story_service.get_supported_stations()

# @app.get("/stats")
# async def get_stats():
#     """사용 통계"""
#     return {
#         "total_requests": rate_limiter.get_total_requests(),
#         "cache_hit_rate": cache_service.get_hit_rate(),
#         "popular_stations": story_service.get_popular_stations(),
#         "timestamp": datetime.now().isoformat()
#     }
# aiserver/main.py - 최소 동작 버전
"""
FastAPI AI Server for Behindy Game - 최소 동작 버전
누락된 모듈들 없이 기본 기능만 제공
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import random
import logging

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Request/Response 모델들 ===

class StoryGenerationRequest(BaseModel):
    station_name: str = Field(..., description="현재 역 이름")
    line_number: int = Field(..., ge=1, le=4, description="노선 번호 (1-4)")
    character_health: int = Field(..., ge=0, le=100, description="캐릭터 체력")
    character_sanity: int = Field(..., ge=0, le=100, description="캐릭터 정신력")
    theme_preference: Optional[str] = Field(None, description="선호 테마")

class StoryContinueRequest(BaseModel):
    station_name: str = Field(..., description="현재 역 이름")
    line_number: int = Field(..., ge=1, le=4, description="노선 번호")
    character_health: int = Field(..., ge=0, le=100, description="캐릭터 체력")
    character_sanity: int = Field(..., ge=0, le=100, description="캐릭터 정신력")
    previous_choice: str = Field(..., description="이전 선택")
    story_context: Optional[str] = Field(None, description="스토리 맥락")

class OptionData(BaseModel):
    content: str
    effect: str  # "HEALTH", "SANITY"
    amount: int
    effect_preview: str  # "체력 -10", "정신력 +5"

class StoryGenerationResponse(BaseModel):
    story_title: str
    page_content: str
    options: List[OptionData]
    estimated_length: int
    difficulty: str  # "쉬움", "보통", "어려움"
    theme: str
    station_name: str
    line_number: int

class StoryContinueResponse(BaseModel):
    page_content: str
    options: List[OptionData]
    is_last_page: bool

# === Mock 데이터 생성기 (내장) ===

class SimpleMockGenerator:
    """간단한 Mock 스토리 생성기"""
    
    STATION_THEMES = {
        "강남": "도시의 화려함 속 숨겨진 비밀",
        "홍대입구": "젊음과 열정이 넘치는 거리",
        "명동": "쇼핑과 관광의 중심지",
        "신촌": "대학가의 활기찬 분위기",
        "이태원": "다국적 문화가 어우러진 곳",
        "압구정": "럭셔리와 세련됨의 상징",
        "여의도": "금융가의 치열한 경쟁",
        "가산디지털단지": "IT 기업들의 메카"
    }
    
    def generate_story(self, station_name: str, character_health: int, character_sanity: int) -> dict:
        """기본 스토리 생성"""
        theme_desc = self.STATION_THEMES.get(station_name, "신비로운 지하철역")
        
        return {
            "story_title": f"{station_name}역의 신비한 만남",
            "page_content": f"""
            {station_name}역 플랫폼에 도착한 당신은 {theme_desc}을 느낍니다.
            
            갑자기 이상한 소음이 들려옵니다. 다른 승객들은 아무것도 눈치채지 못한 것 같습니다.
            
            당신의 현재 상태:
            - 체력: {character_health}/100
            - 정신력: {character_sanity}/100
            
            어떻게 행동하시겠습니까?
            """.strip(),
            "options": [
                {
                    "content": "소음의 출처를 찾아본다",
                    "effect": "SANITY",
                    "amount": -5,
                    "effect_preview": "정신력 -5"
                },
                {
                    "content": "다른 승객에게 물어본다",
                    "effect": "HEALTH", 
                    "amount": 0,
                    "effect_preview": "변화 없음"
                },
                {
                    "content": "무시하고 기차를 기다린다",
                    "effect": "HEALTH",
                    "amount": 5,
                    "effect_preview": "체력 +5"
                }
            ],
            "estimated_length": random.randint(10, 20),
            "difficulty": random.choice(["쉬움", "보통", "어려움"]),
            "theme": "미스터리",
            "station_name": station_name,
            "line_number": random.randint(1, 4)
        }
    
    def continue_story(self, previous_choice: str, station_name: str, 
                      character_health: int, character_sanity: int) -> dict:
        """스토리 진행"""
        
        if "소음" in previous_choice:
            content = "당신은 조심스럽게 소음의 출처를 찾아 나섭니다. 구석진 곳에서 이상한 빛이 새어나오는 것을 발견합니다."
        elif "승객" in previous_choice:
            content = "옆에 있던 승객에게 물어보니, 그들도 뭔가 이상하다고 느꼈다고 합니다. 함께 조사해보기로 합니다."
        else:
            content = "무시하려 했지만, 소음이 점점 커집니다. 이제 다른 승객들도 눈치채기 시작합니다."
        
        return {
            "page_content": content + f"\n\n현재 상태 - 체력: {character_health}/100, 정신력: {character_sanity}/100",
            "options": [
                {
                    "content": "더 깊이 조사한다",
                    "effect": "SANITY",
                    "amount": -10,
                    "effect_preview": "정신력 -10"
                },
                {
                    "content": "안전한 곳으로 피한다",
                    "effect": "HEALTH",
                    "amount": 5,
                    "effect_preview": "체력 +5"
                }
            ],
            "is_last_page": random.choice([True, False])
        }

# 전역 인스턴스
mock_generator = SimpleMockGenerator()

# === API 엔드포인트들 ===

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "message": "Behindy AI Server",
        "status": "healthy",
        "provider": "Simple Mock Provider",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    return {
        "status": "healthy",
        "provider": "Simple Mock Provider",
        "cache_status": True,
        "rate_limit_status": {"active_clients": 0, "total_requests": 0},
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate-story", response_model=StoryGenerationResponse)
async def generate_story(request: StoryGenerationRequest):
    """새로운 스토리 생성"""
    try:
        logger.info(f"스토리 생성 요청: {request.station_name} ({request.line_number}호선)")
        
        # Mock 스토리 생성
        story_data = mock_generator.generate_story(
            request.station_name, 
            request.character_health, 
            request.character_sanity
        )
        
        return StoryGenerationResponse(**story_data)
        
    except Exception as e:
        logger.error(f"스토리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류 발생: {str(e)}")

@app.post("/continue-story", response_model=StoryContinueResponse)
async def continue_story(request: StoryContinueRequest):
    """스토리 진행"""
    try:
        logger.info(f"스토리 진행 요청: {request.station_name}, 선택: {request.previous_choice}")
        
        # Mock 스토리 진행
        continuation_data = mock_generator.continue_story(
            request.previous_choice,
            request.station_name,
            request.character_health,
            request.character_sanity
        )
        
        return StoryContinueResponse(**continuation_data)
        
    except Exception as e:
        logger.error(f"스토리 진행 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 진행 중 오류 발생: {str(e)}")

@app.get("/stations")
async def get_supported_stations():
    """지원되는 역 목록 반환"""
    return [
        {
            "station_name": station,
            "line_number": random.randint(1, 4),
            "theme": "미스터리",
            "difficulty": "보통"
        }
        for station in SimpleMockGenerator.STATION_THEMES.keys()
    ]

@app.get("/stats")
async def get_stats():
    """사용 통계"""
    return {
        "total_requests": random.randint(0, 100),
        "cache_hit_rate": 0.85,
        "popular_stations": list(SimpleMockGenerator.STATION_THEMES.keys())[:3],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)