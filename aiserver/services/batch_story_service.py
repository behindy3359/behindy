"""
Spring Boot 배치 시스템용 스토리 생성 서비스
완전한 스토리 (여러 페이지 + 선택지) 생성
"""

import logging
import json
from typing import Dict, List, Any, Optional
from models.batch_models import (
    BatchStoryRequest, BatchStoryResponse, 
    BatchPageData, BatchOptionData,
    BatchValidationResponse
)
from providers.llm_provider import LLMProviderFactory
from prompt.prompt_manager import get_prompt_manager
import random

logger = logging.getLogger(__name__)

class BatchStoryService:
    """배치용 완전한 스토리 생성 서비스"""
    
    def __init__(self):
        self.provider = LLMProviderFactory.get_provider()
        self.prompt_manager = get_prompt_manager()
        
        # 스토리 길이 설정 (페이지 수)
        self.default_story_length = 5
        self.min_story_length = 3
        self.max_story_length = 8
        
    async def generate_complete_story(self, request: BatchStoryRequest) -> BatchStoryResponse:
        """완전한 스토리 생성 (Spring Boot DB 저장용)"""
        try:
            logger.info(f"완전한 스토리 생성 시작: {request.station_name}역")
            
            # 1. 기본 스토리 정보 생성
            story_info = await self._generate_story_metadata(request)
            
            # 2. 페이지별 스토리 생성
            pages = await self._generate_story_pages(request, story_info)
            
            # 3. 응답 구성
            response = BatchStoryResponse(
                story_title=story_info["story_title"],
                description=story_info["description"],
                theme=story_info["theme"],
                keywords=story_info["keywords"],
                pages=pages,
                estimated_length=len(pages),
                difficulty=story_info["difficulty"],
                station_name=request.station_name,
                line_number=request.line_number
            )
            
            logger.info(f"완전한 스토리 생성 완료: {len(pages)}페이지")
            return response
            
        except Exception as e:
            logger.error(f"완전한 스토리 생성 실패: {str(e)}")
            return self._create_fallback_complete_story(request)
    
    async def _generate_story_metadata(self, request: BatchStoryRequest) -> Dict[str, Any]:
        """스토리 메타데이터 생성"""
        try:
            # Provider 타입 결정
            provider_name = self.provider.get_provider_name().lower()
            if "mock" in provider_name:
                return self._create_mock_story_metadata(request)
            
            # 실제 LLM으로 메타데이터 생성
            metadata_prompt = f"""
{request.station_name}역을 배경으로 한 텍스트 어드벤처 게임의 메타데이터를 JSON 형식으로 생성해주세요.

반드시 다음 JSON 형식으로만 응답하세요:
{{
    "story_title": "흥미로운 제목 (20자 이내)",
    "description": "스토리 설명 (100자 이내)", 
    "theme": "테마 (미스터리/공포/모험/로맨스/코미디 중 1개)",
    "keywords": ["키워드1", "키워드2", "키워드3"],
    "difficulty": "쉬움|보통|어려움",
    "estimated_length": 5
}}

조건:
- {request.station_name}역의 특성을 반영
- {request.line_number}호선의 분위기에 맞는 테마
- 키워드는 3-5개
- 예상 길이는 3-8 사이
"""
            
            context = {
                'station_name': request.station_name,
                'line_number': request.line_number
            }
            
            result = await self.provider.generate_story(metadata_prompt, **context)
            
            # 결과 검증 및 보완
            if isinstance(result, dict) and "story_title" in result:
                return result
            else:
                logger.warning("메타데이터 생성 결과가 올바르지 않음, Mock 데이터 사용")
                return self._create_mock_story_metadata(request)
                
        except Exception as e:
            logger.error(f"메타데이터 생성 실패: {str(e)}")
            return self._create_mock_story_metadata(request)
    
    async def _generate_story_pages(self, request: BatchStoryRequest, story_info: Dict) -> List[BatchPageData]:
        """스토리 페이지들 생성"""
        target_length = story_info.get("estimated_length", 5)
        pages = []
        
        for page_num in range(1, target_length + 1):
            try:
                logger.info(f"페이지 {page_num}/{target_length} 생성 중...")
                
                page_data = await self._generate_single_page(
                    request, story_info, page_num, target_length, pages
                )
                
                if page_data:
                    pages.append(page_data)
                else:
                    logger.warning(f"페이지 {page_num} 생성 실패, 기본 페이지 사용")
                    pages.append(self._create_fallback_page(page_num, target_length))
                    
            except Exception as e:
                logger.error(f"페이지 {page_num} 생성 오류: {str(e)}")
                pages.append(self._create_fallback_page(page_num, target_length))
        
        logger.info(f"총 {len(pages)}페이지 생성 완료")
        return pages
    
    async def _generate_single_page(self, request: BatchStoryRequest, story_info: Dict, 
                                   page_num: int, total_pages: int, 
                                   previous_pages: List[BatchPageData]) -> Optional[BatchPageData]:
        """단일 페이지 생성"""
        try:
            # Mock Provider인 경우
            provider_name = self.provider.get_provider_name().lower()
            if "mock" in provider_name:
                return self._create_mock_page(request, story_info, page_num, total_pages)
            
            # 페이지 컨텍스트 준비
            context = self._prepare_page_context(request, story_info, page_num, total_pages, previous_pages)
            
            # LLM으로 페이지 생성
            page_prompt = f"""
다음 스토리의 {page_num}페이지를 생성해주세요:

**스토리 정보:**
- 제목: {story_info['story_title']}
- 테마: {story_info['theme']}
- 배경: {request.station_name}역 ({request.line_number}호선)
- 전체 길이: {total_pages}페이지 중 {page_num}페이지

**페이지 요구사항:**
- 150-300자의 흥미로운 내용
- 2-4개의 의미있는 선택지
- 선택지별 적절한 효과 (-10~+10)

JSON 형식으로만 응답하세요:
{{
    "content": "페이지 내용 (150-300자)",
    "options": [
        {{
            "content": "선택지 내용",
            "effect": "health|sanity|none",
            "amount": -5~+5,
            "effect_preview": "체력 +3"
        }}
    ]
}}
"""
            
            result = await self.provider.generate_story(page_prompt, **context)
            
            # 결과 변환
            if isinstance(result, dict) and "content" in result and "options" in result:
                options = [
                    BatchOptionData(**opt) for opt in result["options"]
                    if isinstance(opt, dict) and all(k in opt for k in ["content", "effect", "amount", "effect_preview"])
                ]
                
                if len(options) >= 2:
                    return BatchPageData(
                        content=result["content"],
                        options=options
                    )
            
            logger.warning(f"페이지 {page_num} LLM 결과가 올바르지 않음")
            return None
            
        except Exception as e:
            logger.error(f"페이지 {page_num} 생성 오류: {str(e)}")
            return None
    
    def _prepare_page_context(self, request: BatchStoryRequest, story_info: Dict,
                             page_num: int, total_pages: int, 
                             previous_pages: List[BatchPageData]) -> Dict[str, Any]:
        """페이지 생성용 컨텍스트 준비"""
        context = {
            'station_name': request.station_name,
            'line_number': request.line_number,
            'character_health': request.character_health,
            'character_sanity': request.character_sanity,
            'story_title': story_info['story_title'],
            'theme': story_info['theme'],
            'page_number': page_num,
            'total_pages': total_pages,
            'is_first_page': page_num == 1,
            'is_last_page': page_num == total_pages
        }
        
        # 이전 페이지 요약 (컨텍스트용)
        if previous_pages:
            context['previous_content'] = previous_pages[-1].content[:100] + "..."
        
        return context
    
    async def validate_story_structure(self, story_data: Dict[str, Any]) -> Dict[str, Any]:
        """스토리 구조 검증"""
        try:
            errors = []
            warnings = []
            
            # 필수 필드 검증
            required_fields = ["story_title", "description", "theme", "keywords", "pages"]
            for field in required_fields:
                if field not in story_data:
                    errors.append(f"필수 필드 누락: {field}")
            
            # 페이지 검증
            pages = story_data.get("pages", [])
            if not pages:
                errors.append("페이지가 없습니다")
            elif len(pages) < 3:
                warnings.append(f"페이지 수가 적습니다: {len(pages)}개")
            elif len(pages) > 10:
                warnings.append(f"페이지 수가 많습니다: {len(pages)}개")
            
            # 각 페이지 검증
            for i, page in enumerate(pages):
                if not isinstance(page, dict):
                    errors.append(f"페이지 {i+1} 형식 오류")
                    continue
                
                if "content" not in page:
                    errors.append(f"페이지 {i+1} 내용 누락")
                
                options = page.get("options", [])
                if len(options) < 2:
                    errors.append(f"페이지 {i+1} 선택지 부족: {len(options)}개")
                elif len(options) > 4:
                    warnings.append(f"페이지 {i+1} 선택지 과다: {len(options)}개")
                
                # 선택지 검증
                for j, option in enumerate(options):
                    if not isinstance(option, dict):
                        errors.append(f"페이지 {i+1} 선택지 {j+1} 형식 오류")
                        continue
                    
                    option_fields = ["content", "effect", "amount", "effect_preview"]
                    for field in option_fields:
                        if field not in option:
                            errors.append(f"페이지 {i+1} 선택지 {j+1} {field} 누락")
            
            return {
                "is_valid": len(errors) == 0,
                "errors": errors,
                "warnings": warnings,
                "fixed_structure": None  # 자동 수정은 추후 구현
            }
            
        except Exception as e:
            logger.error(f"구조 검증 실패: {str(e)}")
            return {
                "is_valid": False,
                "errors": [f"검증 오류: {str(e)}"],
                "warnings": [],
                "fixed_structure": None
            }
    
    # ===== Mock 데이터 생성 메서드들 =====
    
    def _create_mock_story_metadata(self, request: BatchStoryRequest) -> Dict[str, Any]:
        """Mock 스토리 메타데이터"""
        themes = ["미스터리", "공포", "모험", "로맨스", "코미디"]
        
        return {
            "story_title": f"{request.station_name}역의 {random.choice(themes)}",
            "description": f"{request.station_name}역에서 벌어지는 흥미진진한 이야기입니다.",
            "theme": random.choice(themes),
            "keywords": [
                request.station_name, 
                f"{request.line_number}호선", 
                "지하철", 
                random.choice(["신비", "모험", "우정", "성장"])
            ],
            "difficulty": random.choice(["쉬움", "보통", "어려움"]),
            "estimated_length": random.randint(4, 6)
        }
    
    def _create_mock_page(self, request: BatchStoryRequest, story_info: Dict,
                         page_num: int, total_pages: int) -> BatchPageData:
        """Mock 페이지 데이터"""
        if page_num == 1:
            content = f"{request.station_name}역에 도착한 당신. {story_info['theme']} 분위기가 감도는 이곳에서 무언가 특별한 일이 벌어질 것 같습니다."
        elif page_num == total_pages:
            content = f"마침내 {request.station_name}역의 비밀을 알아냈습니다. 이제 어떤 선택을 하시겠습니까?"
        else:
            content = f"스토리가 계속됩니다... ({page_num}/{total_pages}페이지) 상황이 점점 흥미로워지고 있습니다."
        
        # Mock 선택지들
        options = [
            BatchOptionData(
                content="적극적으로 행동한다",
                effect="health",
                amount=random.randint(-3, -1),
                effect_preview=f"체력 {random.randint(-3, -1)}"
            ),
            BatchOptionData(
                content="신중하게 관찰한다", 
                effect="sanity",
                amount=random.randint(1, 3),
                effect_preview=f"정신력 +{random.randint(1, 3)}"
            ),
            BatchOptionData(
                content="안전하게 대처한다",
                effect="none",
                amount=0,
                effect_preview="변화 없음"
            )
        ]
        
        return BatchPageData(content=content, options=options)
    
    def _create_fallback_complete_story(self, request: BatchStoryRequest) -> BatchStoryResponse:
        """전체 생성 실패시 Fallback 스토리"""
        logger.warning("Fallback 완전한 스토리 생성")
        
        # 기본 메타데이터
        metadata = self._create_mock_story_metadata(request)
        
        # 기본 3페이지
        pages = [
            self._create_fallback_page(1, 3),
            self._create_fallback_page(2, 3),
            self._create_fallback_page(3, 3)
        ]
        
        return BatchStoryResponse(
            story_title=metadata["story_title"],
            description=metadata["description"],
            theme=metadata["theme"],
            keywords=metadata["keywords"],
            pages=pages,
            estimated_length=len(pages),
            difficulty=metadata["difficulty"],
            station_name=request.station_name,
            line_number=request.line_number
        )
    
    def _create_fallback_page(self, page_num: int, total_pages: int) -> BatchPageData:
        """Fallback 페이지"""
        return BatchPageData(
            content=f"예상치 못한 상황이 발생했습니다. ({page_num}/{total_pages}페이지) 신중하게 행동해야 할 때입니다.",
            options=[
                BatchOptionData(
                    content="상황을 파악한다",
                    effect="sanity",
                    amount=2,
                    effect_preview="정신력 +2"
                ),
                BatchOptionData(
                    content="빠르게 행동한다",
                    effect="health", 
                    amount=-1,
                    effect_preview="체력 -1"
                )
            ]
        )