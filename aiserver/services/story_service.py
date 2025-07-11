"""
스토리 생성 서비스
"""

from typing import Dict, List
from models.request_models import StoryGenerationRequest, StoryContinueRequest
from models.response_models import StoryGenerationResponse, StoryContinueResponse, OptionData
from providers.llm_provider import LLMProviderFactory
import logging

logger = logging.getLogger(__name__)

class StoryService:
    def __init__(self):
        self.request_count = {}
        self.popular_stations = {}
    
    async def generate_story(self, request: StoryGenerationRequest) -> StoryGenerationResponse:
        """새로운 스토리 생성"""
        provider = LLMProviderFactory.get_provider()
        
        # 통계 업데이트
        station_key = f"{request.station_name}_{request.line_number}"
        self.popular_stations[station_key] = self.popular_stations.get(station_key, 0) + 1
        
        # 프롬프트 생성 (실제 LLM용)
        prompt = self._create_generation_prompt(request)
        
        # 스토리 생성
        story_data = await provider.generate_story(
            prompt,
            station_name=request.station_name,
            line_number=request.line_number,
            character_health=request.character_health,
            character_sanity=request.character_sanity
        )
        
        # 응답 형식으로 변환
        return StoryGenerationResponse(
            story_title=story_data["story_title"],
            page_content=story_data["page_content"],
            options=[OptionData(**opt) for opt in story_data["options"]],
            estimated_length=story_data["estimated_length"],
            difficulty=story_data["difficulty"],
            theme=story_data["theme"],
            station_name=story_data.get("station_name", request.station_name),
            line_number=story_data.get("line_number", request.line_number)
        )
    
    async def continue_story(self, request: StoryContinueRequest) -> StoryContinueResponse:
        """스토리 진행"""
        provider = LLMProviderFactory.get_provider()
        
        # Mock Provider인 경우 특별 처리
        if provider.get_provider_name() == "Mock Provider":
            from templates.mock_templates import MockStoryGenerator
            generator = MockStoryGenerator()
            
            continuation_data = generator.continue_story(
                request.previous_choice,
                request.station_name,
                request.character_health,
                request.character_sanity
            )
        else:
            # 실제 LLM Provider 처리
            prompt = self._create_continuation_prompt(request)
            continuation_data = await provider.generate_story(prompt, **request.dict())
        
        return StoryContinueResponse(
            page_content=continuation_data["page_content"],
            options=[OptionData(**opt) for opt in continuation_data["options"]],
            is_last_page=continuation_data.get("is_last_page", False)
        )
    
    def _create_generation_prompt(self, request: StoryGenerationRequest) -> str:
        """스토리 생성용 프롬프트 생성"""
        return f"""
        지하철 {request.line_number}호선 {request.station_name}역을 배경으로 한 텍스트 어드벤처 게임 스토리를 생성해주세요.
        
        캐릭터 상태:
        - 체력: {request.character_health}/100
        - 정신력: {request.character_sanity}/100
        
        요구사항:
        1. 흥미로운 스토리 제목
        2. 몰입감 있는 오프닝 내용 (200자 내외)
        3. 2-4개의 선택지 (각각 체력/정신력 변화 포함)
        4. 난이도와 테마 분류
        """
    
    def _create_continuation_prompt(self, request: StoryContinueRequest) -> str:
        """스토리 진행용 프롬프트 생성"""
        return f"""
        이전 선택: {request.previous_choice}
        현재 상황: {request.story_context or ""}
        
        캐릭터 상태:
        - 체력: {request.character_health}/100
        - 정신력: {request.character_sanity}/100
        
        위 상황을 바탕으로 스토리를 자연스럽게 이어가주세요.
        """
    
    def get_supported_stations(self) -> List[Dict]:
        """지원 역 목록"""
        from templates.mock_templates import STATION_CONFIG
        
        return [
            {
                "station_name": station,
                "line_number": config["line"],
                "theme": config["theme"].value,
                "difficulty": config["difficulty"].value
            }
            for station, config in STATION_CONFIG.items()
        ]
    
    def get_popular_stations(self) -> Dict:
        """인기 역 통계"""
        return dict(sorted(self.popular_stations.items(), key=lambda x: x[1], reverse=True)[:10])