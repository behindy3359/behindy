# behindy
웹 포트폴리오

## 📋 프로젝트 개요
- **목적**: 웹 개발자 취업용 포트폴리오
- **컨셉**: 지하철 노선도 기반 텍스트 어드벤처 게임
- **독창성**: 일상적 소재(지하철)의 게임화
- **구조**: 앞면(메인 서비스) + 뒷면(게임)

## 🏗️ 기술 스택

### 🎨 Frontend Server (Next.js)
- **Framework**: Next.js 15 + TypeScript + styled-components
- **상태 관리**: Zustand + React Query
- **라우팅**: App Router + 동적 라우팅
- **UI/UX**: Framer Motion + 반응형 디자인
- **인증**: JWT (Access Token) + 자동 갱신

### ⚡ Backend Server (Spring Boot)
- **Framework**: Spring Boot 3.4.x + Java 21
- **데이터베이스**: PostgreSQL + JPA/Hibernate
- **캐시**: Redis 7 (세션 + 지하철 데이터)
- **보안**: JWT + AES256 암호화 + XSS 방지
- **API**: RESTful API + 내부 API 인증

### 🤖 AI Server (FastAPI)
- **Framework**: FastAPI + Python 3.11 + Pydantic
- **LLM 통합**: Multi-Provider (OpenAI, Claude, Mock)
- **배치 시스템**: 자동 스케줄링 + 역별 스토리 관리(동적 생성기능은 구현계획 없음)
- **통신**: Spring Boot와 RESTful API 연동

### 🛠️ 인프라 & 보안
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions + AWS EC2
- **보안**: HttpOnly Cookie + CORS + 내부 API Key

## 🎮 핵심 기능

### 1. 🎨 Frontend Server (Next.js)
#### 사용자 인터페이스 (작업중)
- **실시간 지하철 노선도**: 30초 폴링,
- **반응형 UI**: 모바일/데스크톱 최적화 + 다크모드 준비
- **사용자 인증 UI**: 로그인/회원가입/토큰 갱신 자동화

#### 커뮤니티 시스템
- **게시판**: 목록/상세/작성/수정 + 마크다운 지원
- **댓글 시스템**: 실시간 작성/수정 + 무한 스크롤
- **검색 및 필터**: 실시간 검색 + 정렬 기능

#### 상태 관리 (작업중)
- **AuthStore**: JWT 토큰 + 사용자 정보 관리
- **GameStore**: 게임 진행 상태
- **UIStore**: 모달, 토스트, 사이드바 상태

### 2. ⚡ Backend Server (Spring Boot)
#### 사용자 인증 및 보안
- **JWT 시스템**: Access Token (15분) + Refresh Token (7일, HttpOnly Cookie)
- **토큰 관리**: 자동 갱신 + JTI 기반 고유성 보장
- **데이터 암호화**: AES256 필드별/테이블별 분리 암호화
- **XSS 방지**:  HTML Sanitization
- **내부 API 보안**: FastAPI와 X-Internal-API-Key 인증

#### 커뮤니티 시스템
- **게시판**: CRUD + 권한 관리 + 페이지네이션
- **댓글 시스템**: 작성자 권한 체크, 계층 구조
- **검색 및 필터**: 게시글 검색, 정렬 기능

#### 게임 시스템 관리 (작업중)
- **캐릭터 관리**: 선택지를 통한 체력/정신력 작용
- **게임 플로우**: 시작/재개/포기, 선택지 처리, 상태 추적
- **진행 상태**: Now 테이블을 통한 현재 진행 추적, 관리
- **게임 로그**: 선택 기록(LogO), 종료 로그(LogE), 플레이 분석(OpsLogB)
- **자격 확인**: 게임 진입 자격 체크, 캐릭터 상태 검증

#### 데이터베이스 관리 (작업중)
- **스토리 데이터**: 역별 스토리 매핑, 페이지/선택지 관리
- **사용자 데이터**: 암호화된 사용자 정보, 캐릭터 히스토리
- **로그 데이터**: 접속(LogA), 플레이(LogB), 일일통계(LogD), 에러(LogX)

### 3. 🤖 AI Server (FastAPI)
#### LLM 통합 시스템
- **다중 Provider 지원**: OpenAI, Claude, Mock 데이터
- **프롬프트 관리**: llm별 최적화를 위한 외부화된 프롬프트 시스템
- **스토리 검증**: 5단계 품질 평가 시스템
- **마이크로서비스**: Spring Boot와 독립적 운영

#### 자동 배치 생성 시스템
- **자동 스케줄링**: 30분 간격 스토리 배치 생성 (개발용)
- **일일 한도**: 
- **역별 최소 보장**: 132개 역마다 최소 2개 스토리 유지
- **실패 복구**: 연속 실패 감지 및 Mock 데이터 폴백
- **Spring Boot 연동**: RESTful API를 통한 DB 저장

#### 관리자 기능
- **수동 배치**: 특정 역/노선 스토리 생성
- **시스템 상태**: 생성 통계, 에러 모니터링
- **성능 최적화**: 캐시 관리, 응답 시간 최적화

## 📦 상태 관리 (Zustand + React Query)
- **AuthStore**: JWT 토큰 + 사용자 정보 관리
- **GameStore**: 게임 진행 상태 (준비 중)  
- **CharacterStore**: 캐릭터 정보 (준비 중)
- **UIStore**: 모달, 토스트, 사이드바 상태
- **React Query**: 서버 상태 캐싱 + 자동 갱신

## 📂 폴더 구조 요약
```
behindy/
├── backend/                 # Spring Boot
│   ├── src/main/java/com/behindy/
│   │   ├── controller/     # REST API
│   │   ├── service/        # 비즈니스 로직
│   │   ├── entity/         # JPA 엔티티
│   │   └── security/       # JWT 인증
├── frontend/               # Next.js
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── store/          # Zustand 상태
│   │   ├── services/       # API 통신
│   │   └── data/           # 지하철 노선도 데이터
├── llmserver/              # FastAPI AI Server
│   ├── app/
│   │   ├── main.py         # FastAPI 애플리케이션
│   │   ├── routers/        # API 라우터
│   │   ├── services/       # LLM 서비스
│   │   ├── models/         # 데이터 모델
│   │   └── prompts/        # 프롬프트 템플릿
└── docker-compose.yml      # 컨테이너 구성
```

## 🚀 배포 환경
- **AWS EC2**: Ubuntu 22.04 LTS
- **Docker Compose**: 3개 서비스 오케스트레이션
  - Spring Boot (backend)
  - Next.js (frontend)
  - FastAPI (llmserver)
- **Nginx**: 리버스 프록시
- **GitHub Actions**: 자동 배포
- **CI/CD**: Phase 1 구현 완료 (로컬 빌드 + 결과물 배포)

## 🔗 마이크로서비스 통신
- **Frontend ↔ Backend**: JWT 인증 + RESTful API + React Query
- **Backend ↔ AI Server**: X-Internal-API-Key + HTTP 통신
- **공통 캐시**: Redis를 통한 세션 + 지하철 데이터 공유
- **컨테이너 네트워크**: Docker Compose 내부 통신