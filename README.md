# Behindy

지하철 역 기반 텍스트 어드벤처 게임입니다.

**목적**: 웹 개발자 취업 포트폴리오

## 기술 스택

### Frontend
- Next.js 15, TypeScript, styled-components
- 상태관리: Zustand, React Query
- 테스트: Vitest

### Backend
- Spring Boot 3.4.5, Java 21
- PostgreSQL 15, Redis 7
- 테스트: JUnit 5, Mockito

### AI Server
- FastAPI, Python 3.11
- LLM: OpenAI GPT-4o-mini, Claude 3 Haiku
- 테스트: Pytest

### 인프라
- Docker Compose
- Nginx
- AWS EC2

## 주요 기능

### 게임
- 지하철 역 기반 스토리 시작
- 캐릭터 생성 및 관리
- 선택지에 따른 스토리 분기
- 체력/정신력 스탯 시스템

### 커뮤니티
- 게시글 작성/수정/삭제
- 댓글 시스템

### 인증
- JWT 기반 로그인
- Access Token (15분) + Refresh Token (7일)
- 자동 토큰 갱신

## API 문서

### 주요 엔드포인트

#### 인증
```
POST   /api/auth/signup          # 회원가입
POST   /api/auth/login           # 로그인
POST   /api/auth/token/refresh   # 토큰 갱신
```

#### 게임
```
GET    /api/game/status                                        # 게임 상태 조회
POST   /api/game/enter/station/{name}/line/{number}           # 역 기반 게임 시작
POST   /api/game/choice/{optionId}                            # 선택지 선택
```

#### 커뮤니티
```
GET    /api/posts                # 게시글 목록
POST   /api/posts                # 게시글 작성
GET    /api/posts/{id}           # 게시글 조회
```

## 프로젝트 구조

```
behindy/
├── frontend/              # Next.js 앱
│   ├── src/
│   │   ├── app/          # 페이지
│   │   ├── features/     # 기능별 모듈
│   │   └── shared/       # 공통 컴포넌트
│   └── __tests__/        # 테스트
│
├── backend/               # Spring Boot 앱
│   └── src/
│       ├── main/java/
│       │   ├── controller/  # REST API
│       │   ├── service/     # 비즈니스 로직
│       │   ├── entity/      # JPA 엔티티
│       │   └── security/    # 보안
│       └── test/           # 테스트
│
├── llmserver/             # FastAPI 앱
│   ├── main.py           # 메인 앱
│   ├── providers/        # LLM Provider
│   ├── services/         # 스토리 생성 서비스
│   └── tests/            # 테스트
│
└── docker-compose.yml    # 서비스 오케스트레이션
```

## 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보
- `char`: 게임 캐릭터
- `sto`: 스토리 메타데이터
- `page`: 스토리 페이지
- `options`: 선택지
- `now`: 게임 진행 상태
- `post`: 게시글
- `comment`: 댓글

## 보안

- JWT 토큰 기반 인증
- BCrypt 비밀번호 해싱
- AES256 민감정보 암호화
- HTML Sanitization
- HttpOnly Cookie
- CORS 설정

## 배포

Docker Compose를 사용한 컨테이너 기반 배포

```bash
# 프로덕션 빌드
cd frontend && npm run build
cd ../backend && ./gradlew build

# 배포
docker-compose up -d
```

## 개발 환경

- Node.js 18+
- Java 21
- Python 3.11
- PostgreSQL 15
- Redis 7
- Docker, Docker Compose