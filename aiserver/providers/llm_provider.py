"""
LLM Provider 추상화
"""

from abc import ABC, abstractmethod
from typing import Dict, Any
import random
import asyncio

class LLMProvider(ABC):
    @abstractmethod
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        pass

class MockProvider(LLMProvider):
    """Mock 데이터 제공자"""
    
    def __init__(self):
        from templates.mock_templates import MockStoryGenerator
        self.generator = MockStoryGenerator()
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        # 인위적 지연 (실제 API 호출 시뮬레이션)
        await asyncio.sleep(0.5)
        
        station_name = kwargs.get('station_name', '강남')
        character_health = kwargs.get('character_health', 80)
        character_sanity = kwargs.get('character_sanity', 80)
        
        return self.generator.generate_story(station_name, character_health, character_sanity)
    
    def get_provider_name(self) -> str:
        return "Mock Provider"

class OpenAIProvider(LLMProvider):
    """OpenAI GPT Provider"""
    
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        self.api_key = api_key
        self.model = model
        # TODO: OpenAI 클라이언트 초기화
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        # TODO: OpenAI API 호출 구현
        raise NotImplementedError("OpenAI Provider 구현 예정")
    
    def get_provider_name(self) -> str:
        return f"OpenAI {self.model}"

class ClaudeProvider(LLMProvider):
    """Anthropic Claude Provider"""
    
    def __init__(self, api_key: str, model: str = "claude-3-haiku"):
        self.api_key = api_key
        self.model = model
        # TODO: Claude 클라이언트 초기화
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        # TODO: Claude API 호출 구현
        raise NotImplementedError("Claude Provider 구현 예정")
    
    def get_provider_name(self) -> str:
        return f"Claude {self.model}"

class LocalLLMProvider(LLMProvider):
    """로컬 LLM Provider (Ollama 등)"""
    
    def __init__(self, url: str, model: str):
        self.url = url
        self.model = model
    
    async def generate_story(self, prompt: str, **kwargs) -> Dict[str, Any]:
        # TODO: 로컬 LLM API 호출 구현
        raise NotImplementedError("Local LLM Provider 구현 예정")
    
    def get_provider_name(self) -> str:
        return f"Local {self.model}"

class LLMProviderFactory:
    """LLM Provider 팩토리"""
    
    @staticmethod
    def get_provider() -> LLMProvider:
        from config.settings import Settings
        settings = Settings()
        
        if settings.AI_PROVIDER == "mock":
            return MockProvider()
        elif settings.AI_PROVIDER == "openai":
            return OpenAIProvider(settings.OPENAI_API_KEY, settings.OPENAI_MODEL)
        elif settings.AI_PROVIDER == "claude":
            return ClaudeProvider(settings.CLAUDE_API_KEY, settings.CLAUDE_MODEL)
        elif settings.AI_PROVIDER == "local":
            return LocalLLMProvider(settings.LOCAL_LLM_URL, settings.LOCAL_LLM_MODEL)
        else:
            raise ValueError(f"지원하지 않는 Provider: {settings.AI_PROVIDER}")