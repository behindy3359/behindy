"""
환경 설정 관리
"""

import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    # AI Provider 설정
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")
    
    # OpenAI 설정
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_MAX_TOKENS: int = int(os.getenv("OPENAI_MAX_TOKENS", "1000"))
    
    # Claude 설정
    CLAUDE_API_KEY: str = os.getenv("CLAUDE_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-3-haiku")
    
    # 로컬 LLM 설정
    LOCAL_LLM_URL: str = os.getenv("LOCAL_LLM_URL", "http://localhost:11434")
    LOCAL_LLM_MODEL: str = os.getenv("LOCAL_LLM_MODEL", "llama2:7b")
    
    # Rate Limiting
    REQUEST_LIMIT_PER_HOUR: int = int(os.getenv("REQUEST_LIMIT_PER_HOUR", "100"))
    REQUEST_LIMIT_PER_DAY: int = int(os.getenv("REQUEST_LIMIT_PER_DAY", "1000"))
    
    # 캐싱 설정
    USE_CACHE: bool = os.getenv("USE_CACHE", "true").lower() == "true"
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "3600"))  # 1시간
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # 로깅 설정
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"