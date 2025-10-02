"""
개선된 LLM Provider (디버깅 로그 추가)
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import asyncio
import json
import aiohttp
import logging
from dataclasses import dataclass
import time

logger = logging.getLogger(__name__)

def mask_api_key(api_key: str) -> str:
    """API 키를 안전하게 마스킹"""
    if not api_key or len(api_key) < 8:
        return "***"
    return f"{api_key[:4]}...{api_key[-4:]}"

@dataclass
class StoryPromptContext:
    """스토리 생성용 프롬프트 컨텍스트"""
    station_name: str
    line_number: int
    character_health: int
    character_sanity: int
    theme_preference: Optional[str] = None
    previous_choice: Optional[str] = None
    story_context: Optional[str] = None

class LLMProvider(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """프로바이더 사용 가능 여부"""
        pass

class OpenAIProvider(LLMProvider):
    """OpenAI GPT Provider with connection pooling"""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini", max_tokens: int = 1000):
        super().__init__()
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self.base_url = "https://api.openai.com/v1/chat/completions"
        self._session: Optional[aiohttp.ClientSession] = None

        logger.info(f"OpenAI Provider initialized: {model} (with connection pooling)")
    
    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key != "" and aiohttp is not None)

    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create reusable aiohttp session"""
        if self._session is None or self._session.closed:
            connector = aiohttp.TCPConnector(
                limit=100,  # Max concurrent connections
                limit_per_host=30,  # Max connections per host
                ttl_dns_cache=300  # DNS cache TTL (5 min)
            )
            timeout = aiohttp.ClientTimeout(total=30)
            self._session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout
            )
            logger.debug("Created new aiohttp session with connection pooling")
        return self._session

    async def close(self):
        """Close the session when shutting down"""
        if self._session and not self._session.closed:
            await self._session.close()
            logger.debug("Closed aiohttp session")

    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        if not self.is_available():
            raise ValueError("OpenAI API 키가 설정되지 않았거나 aiohttp가 설치되지 않았습니다.")

        logger.debug(f"OpenAI API call: model={self.model}, prompt_length={len(prompt)}")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": self.max_tokens,
            "temperature": 0.8,
            "response_format": {"type": "json_object"}
        }
        
        try:
            start_time = time.time()

            session = await self._get_session()
            async with session.post(self.base_url, headers=headers, json=payload) as response:
                    response_time = time.time() - start_time

                    if response.status == 200:
                        result = await response.json()
                        logger.info(f"OpenAI success: {response_time:.2f}s, tokens={result.get('usage', {})}")

                        if 'choices' in result and len(result['choices']) > 0:
                            content = result["choices"][0]["message"]["content"]
                            return self._parse_response(content, kwargs)
                        else:
                            logger.error("OpenAI response missing choices")
                            return self._fallback_response(kwargs)

                    else:
                        error_text = await response.text()
                        logger.error(f"OpenAI API error [{response.status}]: {error_text[:200]}")
                        if response.status == 401:
                            logger.error(f"Auth failed with key: {mask_api_key(self.api_key)}")
                        raise Exception(f"OpenAI API 오류: {response.status}")

        except (asyncio.TimeoutError, aiohttp.ServerTimeoutError):
            logger.error("OpenAI API timeout (30s)")
            raise Exception("OpenAI API 요청 시간 초과")
        except aiohttp.ClientError as e:
            logger.error(f"HTTP client error: {type(e).__name__} - {str(e)}")
            raise Exception(f"HTTP 클라이언트 오류: {str(e)}")
        except Exception as e:
            logger.error(f"OpenAI API call failed: {type(e).__name__} - {str(e)}", exc_info=True)
            raise Exception(f"OpenAI API 호출 실패: {str(e)}")
    
    def _parse_response(self, content: str, context: Dict) -> Dict[str, Any]:
        """OpenAI 응답 파싱"""
        try:
            data = json.loads(content)

            # 필수 필드 보완
            if "station_name" not in data:
                data["station_name"] = context.get('station_name', '강남')
            if "line_number" not in data:
                data["line_number"] = context.get('line_number', 2)

            return data
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {str(e)}, content: {content[:200]}")
            return self._fallback_response(context)
    
    def _fallback_response(self, context: Dict) -> Dict[str, Any]:
        """파싱 실패시 기본 응답"""
        logger.warning("Using fallback response")
        return {
            "story_title": f"{context.get('station_name', '강남')}역의 모험",
            "page_content": "예상치 못한 상황이 발생했습니다. 어떻게 대처하시겠습니까?",
            "options": [
                {"content": "신중하게 행동한다", "effect": "sanity", "amount": 3, "effect_preview": "정신력 +3"},
                {"content": "빠르게 대응한다", "effect": "health", "amount": -2, "effect_preview": "체력 -2"}
            ],
            "estimated_length": 5,
            "difficulty": "보통",
            "theme": "어드벤처",
            "station_name": context.get('station_name', '강남'),
            "line_number": context.get('line_number', 2)
        }
    
    def get_provider_name(self) -> str:
        return f"OpenAI {self.model}"

class ClaudeProvider(LLMProvider):
    """Anthropic Claude Provider"""
    
    def __init__(self, api_key: str, model: str = "claude-3-haiku-20240307"):
        super().__init__()
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.anthropic.com/v1/messages"
        
        logger.info(f"Claude Provider initialized: {model}")
    
    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key != "" and aiohttp is not None)
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        if not self.is_available():
            raise ValueError("Claude API 키가 설정되지 않았거나 aiohttp가 설치되지 않았습니다.")

        logger.debug(f"Claude API call: model={self.model}, prompt_length={len(prompt)}")
        logger.warning("Claude API not fully implemented, using fallback")
        return self._fallback_response(kwargs)
    
    def _parse_response(self, content: str, context: Dict) -> Dict[str, Any]:
        """Claude 응답 파싱 (JSON 블록 추출)"""
        try:
            # JSON 블록 찾기
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != 0:
                json_content = content[start:end]
                data = json.loads(json_content)
                
                # 필수 필드 보완
                if "station_name" not in data:
                    data["station_name"] = context.get('station_name', '강남')
                if "line_number" not in data:
                    data["line_number"] = context.get('line_number', 2)
                
                return data
            else:
                raise ValueError("JSON 형식을 찾을 수 없습니다.")
        
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Claude parse error: {str(e)}, content: {content[:100]}")
            return self._fallback_response(context)
    
    def _fallback_response(self, context: Dict) -> Dict[str, Any]:
        """파싱 실패시 기본 응답"""
        logger.warning("Using Claude fallback response")
        return {
            "story_title": f"{context.get('station_name', '강남')}역의 모험",
            "page_content": "예상치 못한 상황이 발생했습니다. 어떻게 대처하시겠습니까?",
            "options": [
                {"content": "신중하게 행동한다", "effect": "sanity", "amount": 3, "effect_preview": "정신력 +3"},
                {"content": "빠르게 대응한다", "effect": "health", "amount": -2, "effect_preview": "체력 -2"}
            ],
            "estimated_length": 5,
            "difficulty": "보통",
            "theme": "어드벤처",
            "station_name": context.get('station_name', '강남'),
            "line_number": context.get('line_number', 2)
        }
    
    def get_provider_name(self) -> str:
        return f"Claude {self.model}"

class MockProvider(LLMProvider):
    """Mock 데이터 제공자"""
    
    def __init__(self):
        super().__init__()
        logger.info("🎭 MockProvider 초기화")
        try:
            from templates.mock_templates import MockStoryGenerator
            self.generator = MockStoryGenerator()
            logger.info("✅ MockStoryGenerator 로드 성공")
        except ImportError:
            logger.warning("⚠️ MockStoryGenerator import 실패, 기본 응답 사용")
            self.generator = None
    
    def is_available(self) -> bool:
        return True
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        # 🆕 Mock Provider 호출 감지 로그
        logger.warning("⚠️ MockProvider.generate_story 호출됨")
        logger.warning(f"  이유: 실제 LLM Provider 실패로 Mock 사용")
        logger.warning(f"  프롬프트 길이: {len(prompt)}")
        logger.warning(f"  kwargs: {kwargs}")
        
        # 인위적 지연 (실제 API 호출 시뮬레이션)
        await asyncio.sleep(0.3)
        
        if self.generator:
            logger.info("🎭 MockStoryGenerator 사용")
            station_name = kwargs.get('station_name', '강남')
            character_health = kwargs.get('character_health', 80)
            character_sanity = kwargs.get('character_sanity', 80)
            
            result = self.generator.generate_story(station_name, character_health, character_sanity)
            
            logger.warning("⚠️ Mock 데이터 생성됨:")
            logger.warning(f"  제목: {result.get('story_title', 'N/A')}")
            logger.warning(f"  내용 미리보기: {result.get('page_content', 'N/A')[:100]}")
            
            return result
        else:
            logger.warning("⚠️ MockStoryGenerator 없음, 기본 응답 사용")
            # Generator가 없을 때 기본 응답
            result = {
                "story_title": f"{kwargs.get('station_name', '강남')}역의 이야기",
                "page_content": f"{kwargs.get('station_name', '강남')}역에서 흥미로운 일이 벌어집니다.",
                "options": [
                    {"content": "관찰한다", "effect": "sanity", "amount": 2, "effect_preview": "정신력 +2"},
                    {"content": "행동한다", "effect": "health", "amount": -1, "effect_preview": "체력 -1"}
                ],
                "estimated_length": 5,
                "difficulty": "보통",
                "theme": "일상",
                "station_name": kwargs.get('station_name', '강남'),
                "line_number": kwargs.get('line_number', 2)
            }
            
            logger.info("✅ 기본 Mock 응답 생성 완료")
            return result
    
    def get_provider_name(self) -> str:
        return "Mock Provider"

class LLMProviderFactory:
    """LLM Provider 팩토리"""
    
    @staticmethod
    def get_provider() -> LLMProvider:
        try:
            from config.settings import Settings
            settings = Settings()
        except ImportError:
            import os
            provider_name = os.getenv("AI_PROVIDER", "mock").lower()

            if provider_name == "openai" and os.getenv("OPENAI_API_KEY"):
                return OpenAIProvider(
                    api_key=os.getenv("OPENAI_API_KEY"),
                    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                )
            elif provider_name == "claude" and os.getenv("CLAUDE_API_KEY"):
                return ClaudeProvider(
                    api_key=os.getenv("CLAUDE_API_KEY"),
                    model=os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")
                )
            else:
                logger.info(f"Using MockProvider (AI_PROVIDER={provider_name})")
                return MockProvider()

        provider_name = settings.AI_PROVIDER.lower()

        if provider_name == "openai" and settings.OPENAI_API_KEY:
            provider = OpenAIProvider(
                api_key=settings.OPENAI_API_KEY,
                model=settings.OPENAI_MODEL,
                max_tokens=settings.OPENAI_MAX_TOKENS
            )

            if provider.is_available():
                logger.info(f"OpenAI Provider active: {settings.OPENAI_MODEL}")
                return provider
            else:
                logger.error("OpenAI Provider unavailable despite API key")

        elif provider_name == "claude" and settings.CLAUDE_API_KEY:
            provider = ClaudeProvider(
                api_key=settings.CLAUDE_API_KEY,
                model=settings.CLAUDE_MODEL
            )
            if provider.is_available():
                logger.info(f"Claude Provider active: {settings.CLAUDE_MODEL}")
                return provider
            else:
                logger.error("Claude Provider unavailable despite API key")

        logger.warning(f"Falling back to MockProvider (requested: {provider_name})")
        return MockProvider()
    
    @staticmethod
    def get_available_providers() -> Dict[str, bool]:
        """사용 가능한 Provider 목록"""
        logger.info("📋 사용 가능한 Provider 목록 조회")
        
        try:
            from config.settings import Settings
            settings = Settings()
            
            providers = {
                "openai": bool(settings.OPENAI_API_KEY and aiohttp is not None),
                "claude": bool(settings.CLAUDE_API_KEY and aiohttp is not None),
                "mock": True
            }
            
            logger.info(f"📋 Provider 상태: {providers}")
            return providers
            
        except ImportError:
            import os
            providers = {
                "openai": bool(os.getenv("OPENAI_API_KEY") and aiohttp is not None),
                "claude": bool(os.getenv("CLAUDE_API_KEY") and aiohttp is not None),
                "mock": True
            }
            
            logger.info(f"📋 Provider 상태 (환경변수): {providers}")
            return providers
    
    @staticmethod
    def test_provider(provider_name: str) -> Dict[str, Any]:
        """특정 Provider 테스트"""
        logger.info(f"🧪 Provider 테스트: {provider_name}")
        
        try:
            if provider_name == "openai":
                import os
                provider = OpenAIProvider(
                    os.getenv("OPENAI_API_KEY", ""), 
                    os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                )
            elif provider_name == "claude":
                import os
                provider = ClaudeProvider(
                    os.getenv("CLAUDE_API_KEY", ""), 
                    os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")
                )
            elif provider_name == "mock":
                provider = MockProvider()
            else:
                return {"status": "error", "message": f"알 수 없는 Provider: {provider_name}"}
            
            result = {
                "status": "available" if provider.is_available() else "unavailable",
                "provider": provider.get_provider_name(),
                "message": "사용 가능" if provider.is_available() else "API 키 없음 또는 의존성 누락"
            }
            
            logger.info(f"🧪 테스트 결과: {result}")
            return result
            
        except Exception as e:
            logger.error(f"🧪 Provider 테스트 실패: {str(e)}")
            return {"status": "error", "message": str(e)}