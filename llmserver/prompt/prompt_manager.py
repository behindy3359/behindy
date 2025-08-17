"""
프롬프트 관리자 - 외부 파일 분리
llmserver/prompts/prompt_manager.py
"""

from typing import Dict, Any
import os
import json
from pathlib import Path

class PromptManager:
    """프롬프트 외부 파일 관리자"""
    
    def __init__(self):
        self.prompts_dir = Path(__file__).parent
        self.story_prompts = self._load_story_prompts()
        self.validation_prompts = self._load_validation_prompts()
        self.evaluation_prompts = self._load_evaluation_prompts()
    
    def _load_story_prompts(self) -> Dict[str, str]:
        """스토리 생성 프롬프트 로딩"""
        try:
            openai_path = self.prompts_dir / "story_generation_openai.txt"
            claude_path = self.prompts_dir / "story_generation_claude.txt"
            
            return {
                "openai": self._read_prompt_file(openai_path),
                "claude": self._read_prompt_file(claude_path)
            }
        except Exception as e:
            return self._get_default_story_prompts()
    
    def _load_validation_prompts(self) -> Dict[str, str]:
        """JSON 검증 프롬프트 로딩"""
        try:
            openai_path = self.prompts_dir / "json_validation_openai.txt"
            claude_path = self.prompts_dir / "json_validation_claude.txt"
            
            return {
                "openai": self._read_prompt_file(openai_path),
                "claude": self._read_prompt_file(claude_path)
            }
        except Exception as e:
            return self._get_default_validation_prompts()
    
    def _load_evaluation_prompts(self) -> Dict[str, str]:
        """품질 평가 프롬프트 로딩"""
        try:
            openai_path = self.prompts_dir / "quality_evaluation_openai.txt"
            claude_path = self.prompts_dir / "quality_evaluation_claude.txt"
            
            return {
                "openai": self._read_prompt_file(openai_path),
                "claude": self._read_prompt_file(claude_path)
            }
        except Exception as e:
            return self._get_default_evaluation_prompts()
    
    def _read_prompt_file(self, file_path: Path) -> str:
        """프롬프트 파일 읽기"""
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        else:
            raise FileNotFoundError(f"프롬프트 파일 없음: {file_path}")
    
    def get_story_prompt(self, provider: str) -> str:
        """스토리 생성 프롬프트 반환"""
        return self.story_prompts.get(provider, self.story_prompts.get("openai", ""))
    
    def get_validation_prompt(self, provider: str) -> str:
        """JSON 검증 프롬프트 반환"""
        return self.validation_prompts.get(provider, self.validation_prompts.get("openai", ""))
    
    def get_evaluation_prompt(self, provider: str) -> str:
        """품질 평가 프롬프트 반환"""
        return self.evaluation_prompts.get(provider, self.evaluation_prompts.get("openai", ""))
    
    def reload_prompts(self):
        """프롬프트 파일 다시 로딩"""
        self.story_prompts = self._load_story_prompts()
        self.validation_prompts = self._load_validation_prompts()
        self.evaluation_prompts = self._load_evaluation_prompts()
    
    def create_user_prompt(self, context: Dict[str, Any], prompt_type: str = "generation") -> str:
        """사용자 프롬프트 생성"""
        if prompt_type == "generation":
            return self._create_generation_user_prompt(context)
        elif prompt_type == "continuation":
            return self._create_continuation_user_prompt(context)
        else:
            return ""
    
    def _create_generation_user_prompt(self, context: Dict[str, Any]) -> str:
        """스토리 생성용 사용자 프롬프트"""
        station_name = context.get('station_name', '강남')
        line_number = context.get('line_number', 2)
        health = context.get('character_health', 80)
        sanity = context.get('character_sanity', 80)
        
        return f"""스토리 생성 요청:

📍 **역 정보**
- 역명: {station_name}역
- 노선: {line_number}호선

👤 **캐릭터 상태**
- 체력: {health}/100
- 정신력: {sanity}/100

{station_name}역을 배경으로 한 흥미진진한 텍스트 어드벤처 게임의 시작 부분을 JSON 형식으로 생성해주세요."""
    
    def _create_continuation_user_prompt(self, context: Dict[str, Any]) -> str:
        """스토리 진행용 사용자 프롬프트"""
        station_name = context.get('station_name', '강남')
        line_number = context.get('line_number', 2)
        health = context.get('character_health', 80)
        sanity = context.get('character_sanity', 80)
        previous_choice = context.get('previous_choice', '')
        story_context = context.get('story_context', '')
        
        return f"""이전 스토리에서 "{previous_choice}" 선택의 결과로 스토리를 이어가주세요.

현재 상황:
- 위치: {station_name}역 ({line_number}호선)
- 캐릭터 상태: 체력 {health}/100, 정신력 {sanity}/100
- 스토리 맥락: {story_context or "이전 상황에서 이어집니다"}

JSON 형식으로 응답해주세요:
{{
    "page_content": "이어지는 스토리 내용 (150-250자)",
    "options": [
        {{
            "content": "선택지 내용",
            "effect": "health|sanity|none",
            "amount": -5~+5,
            "effect_preview": "효과 미리보기"
        }}
    ],
    "is_last_page": false
}}"""
    
    # ===== 기본 프롬프트 (파일이 없을 때 사용) =====
    
    def _get_default_story_prompts(self) -> Dict[str, str]:
        """기본 스토리 프롬프트"""
        return {
            "openai": """당신은 지하철역 텍스트 어드벤처 게임의 전문 스토리 작가입니다.

반드시 다음 JSON 형식으로만 응답하세요:
{
    "story_title": "스토리 제목 (20자 이내)",
    "page_content": "스토리 내용 (150-300자)",
    "options": [
        {
            "content": "선택지 설명",
            "effect": "health|sanity|none",
            "amount": -10~+10,
            "effect_preview": "효과 미리보기"
        }
    ],
    "estimated_length": 5,
    "difficulty": "쉬움|보통|어려움",
    "theme": "테마명",
    "station_name": "역명",
    "line_number": 노선번호
}

품질 기준:
- 선택지 2-4개, 효과 -10~+10 범위
- 한국어로 자연스럽게 작성
- 역의 특성을 반영한 현실적 상황""",

            "claude": """지하철역 텍스트 어드벤처 게임의 스토리 작가입니다.

JSON 형식으로만 응답하세요:
{
    "story_title": "스토리 제목",
    "page_content": "스토리 내용 (150-300자)",
    "options": [선택지 배열],
    "estimated_length": 예상페이지수,
    "difficulty": "쉬움|보통|어려움",
    "theme": "테마",
    "station_name": "역명",
    "line_number": 노선번호
}

작성 가이드:
- 선택지 2-4개 제공
- 한국 지하철역 특성 반영
- 자연스러운 한국어 사용"""
        }
    
    def _get_default_validation_prompts(self) -> Dict[str, str]:
        """기본 검증 프롬프트"""
        return {
            "openai": """JSON 검증 및 수정 전문가입니다.

주어진 텍스트를 검증하고 수정해주세요.

응답 형식:
{
    "is_valid": true/false,
    "errors": ["오류 목록"],
    "fixed_json": 수정된객체또는null
}""",

            "claude": """JSON 검증 전문가입니다.

검증 결과를 JSON으로 반환하세요:
{
    "is_valid": boolean,
    "errors": ["오류들"],
    "fixed_json": 수정된데이터또는null
}"""
        }
    
    def _get_default_evaluation_prompts(self) -> Dict[str, str]:
        """기본 평가 프롬프트"""
        return {
            "openai": """텍스트 어드벤처 게임 품질 평가 전문가입니다.

5개 기준으로 평가 (각 20점, 총 100점):
1. 창의성
2. 일관성
3. 몰입도
4. 한국어 품질
5. 게임 적합성

JSON 응답:
{
    "total_score": 85.5,
    "creativity": 18.0,
    "coherence": 17.5,
    "engagement": 16.0,
    "korean_quality": 19.0,
    "game_suitability": 15.0,
    "feedback": "상세 피드백",
    "passed": true
}

통과 기준: 70점 이상""",

            "claude": """품질 평가 전문가입니다.

5개 기준 평가 후 JSON 응답:
{
    "total_score": 점수,
    "creativity": 창의성점수,
    "coherence": 일관성점수,
    "engagement": 몰입도점수,
    "korean_quality": 한국어품질점수,
    "game_suitability": 게임적합성점수,
    "feedback": "피드백",
    "passed": boolean
}"""
        }

# 전역 인스턴스
_prompt_manager = None

def get_prompt_manager() -> PromptManager:
    """프롬프트 매니저 싱글톤 반환"""
    global _prompt_manager
    if _prompt_manager is None:
        _prompt_manager = PromptManager()
    return _prompt_manager