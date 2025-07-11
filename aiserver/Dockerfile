  FROM python:3.11-slim

  # 메타데이터 설정
  LABEL maintainer="behindy-project"
  LABEL description="FastAPI AI Story Generation Server"
  
  # 환경변수 설정
  ENV PYTHONUNBUFFERED=1 \
      PYTHONDONTWRITEBYTECODE=1 \
      PIP_NO_CACHE_DIR=1 \
      PIP_DISABLE_PIP_VERSION_CHECK=1
  
  # 시스템 패키지 업데이트 및 필수 도구 설치
  RUN apt-get update && apt-get install -y \
      curl \
      && rm -rf /var/lib/apt/lists/*
  
  # 작업 디렉토리 설정
  WORKDIR /app
  
  # 의존성 먼저 복사 및 설치 
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  
  # 애플리케이션 코드 복사
  COPY . .
  
  # 비루트 사용자 생성 및 설정
  RUN groupadd -r appuser && useradd -r -g appuser appuser
  RUN chown -R appuser:appuser /app
  USER appuser
  
  # 포트 노출
  EXPOSE 8000
  
  # 헬스체크 추가
  HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
      CMD curl -f http://localhost:8000/ || exit 1
  
  # 실행 명령
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]