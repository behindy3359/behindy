"""
압축된 AI 서버 메인 파일
핵심 기능만 포함 - Mock 데이터 + Spring Boot 호환
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import logging
from datetime import datetime

# Mock 템플릿 import
from templates.mock_templates import MockStoryGenerator

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱
app = FastAPI(
    title="Behindy AI Server",
    description="지하철 스토리 생성 서버 (간단 버전)",
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

# Mock 생성기
story_service = MockStoryGenerator()

# ===== Request/Response 모델 =====

class StoryGenerationRequest(BaseModel):
    station_name: str
    line_number: int
    character_health: int
    character_sanity: int
    theme_preference: Optional[str] = None

class StoryContinueRequest(BaseModel):
    station_name: str
    line_number: int
    character_health: int
    character_sanity: int
    previous_choice: str
    story_context: Optional[str] = None

class OptionData(BaseModel):
    content: str
    effect: str
    amount: int
    effect_preview: str

class StoryGenerationResponse(BaseModel):
    story_title: str
    page_content: str
    options: List[OptionData]
    estimated_length: int
    difficulty: str
    theme: str
    station_name: str
    line_number: int

class StoryContinueResponse(BaseModel):
    page_content: str
    options: List[OptionData]
    is_last_page: bool

# ===== API 엔드포인트 =====

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "message": "Behindy AI Server (Simple)",
        "status": "healthy",
        "provider": "mock",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    return {
        "status": "healthy",
        "provider": "Mock Provider",
        "timestamp": datetime.now().isoformat(),
        "available_stations": len(story_service.STATION_CONFIG) if hasattr(story_service, 'STATION_CONFIG') else 12
    }

@app.post("/generate-story", response_model=StoryGenerationResponse)
async def generate_story(request: StoryGenerationRequest):
    """새로운 스토리 생성"""
    try:
        logger.info(f"스토리 생성 요청: {request.station_name} ({request.line_number}호선)")
        
        # Mock 스토리 생성
        story_data = story_service.generate_story(
            request.station_name, 
            request.character_health, 
            request.character_sanity
        )
        
        # 응답 형식 변환
        return StoryGenerationResponse(
            story_title=story_data["story_title"],
            page_content=story_data["page_content"],
            options=[OptionData(**opt) for opt in story_data["options"]],
            estimated_length=story_data["estimated_length"],
            difficulty=story_data["difficulty"],
            theme=story_data["theme"],
            station_name=story_data["station_name"],
            line_number=story_data["line_number"]
        )
        
    except Exception as e:
        logger.error(f"스토리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 생성 중 오류: {str(e)}")

@app.post("/continue-story", response_model=StoryContinueResponse)
async def continue_story(request: StoryContinueRequest):
    """스토리 진행"""
    try:
        logger.info(f"스토리 진행 요청: {request.station_name}, 선택: {request.previous_choice}")
        
        # Mock 스토리 진행
        continuation_data = story_service.continue_story(
            request.previous_choice,
            request.station_name,
            request.character_health,
            request.character_sanity
        )
        
        return StoryContinueResponse(
            page_content=continuation_data["page_content"],
            options=[OptionData(**opt) for opt in continuation_data["options"]],
            is_last_page=continuation_data["is_last_page"]
        )
        
    except Exception as e:
        logger.error(f"스토리 진행 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"스토리 진행 중 오류: {str(e)}")

@app.get("/stations")
async def get_supported_stations():
    """지원되는 역 목록"""
    from templates.mock_templates import STATION_CONFIG
    
    return [
        {
            "station_name": station,
            "line_number": config["line"],
            "theme": config["theme"].value
        }
        for station, config in STATION_CONFIG.items()
    ]

# ===== 서버 실행 =====

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)