# AI Server 보안 개선 사항

## 개선 완료된 항목

### Phase 1: 긴급 보안 이슈 (✅ 완료)

#### 1. 하드코딩된 시크릿 제거
- **문제**: `main.py`에 `"behindy-internal-2025-secret-key"` 하드코딩
- **해결**: 환경변수 `INTERNAL_API_KEY`로 변경
- **영향 파일**: `main.py`

#### 2. API 키 로그 마스킹 강화
- **문제**: 여러 로그에서 API 키 일부 노출
- **해결**: `mask_api_key()` 유틸리티 함수 추가, 모든 로그에 적용
- **영향 파일**:
  - `providers/llm_provider.py`
  - 마스킹 패턴: `{key[:4]}...{key[-4:]}`

#### 3. CORS 제한 설정
- **문제**: `allow_origins=["*"]` - 모든 Origin 허용
- **해결**: 환경변수 `ALLOWED_ORIGINS`로 특정 도메인만 허용
- **영향 파일**: `main.py`
- **설정 예시**: `ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com`

### Phase 2: 중요 보안 이슈 (✅ 완료)

#### 4. 프롬프트 인젝션 방어
- **문제**: 사용자 입력 살균 없이 LLM에 전달
- **해결**:
  - `utils/input_sanitizer.py` 추가
  - 위험한 패턴 검사 (예: "ignore previous instructions")
  - 허용 문자 화이트리스트 적용
  - 입력 길이 제한
- **적용 위치**: `models/batch_models.py` - `BatchStoryRequest.station_name` validator

#### 5. Redis 기반 Rate Limiter
- **문제**: 메모리 기반 Rate Limiter - 분산 환경 미지원
- **해결**:
  - `utils/redis_rate_limiter.py` 추가
  - Redis 연결 실패시 메모리 기반으로 폴백
  - 시간당/일일 제한 분리 관리
- **특징**:
  - 분산 환경 지원
  - 클라이언트별 상태 조회 가능
  - Redis 장애시 자동 폴백

#### 6. 요청 크기 제한 미들웨어
- **문제**: DoS 공격 취약점
- **해결**:
  - `limit_request_size` 미들웨어 추가
  - 기본값: 1MB (환경변수 `MAX_REQUEST_SIZE`로 조정 가능)
- **영향 파일**: `main.py`

#### 7. API 인증 추가
- **문제**: 공개 엔드포인트 무인증
- **해결**:
  - `utils/api_auth.py` 추가
  - `PUBLIC_API_KEY`: 공개 API 접근용
  - `INTERNAL_API_KEY`: 내부 배치 작업용
  - 개발 모드 지원 (키 미설정시)
- **특징**:
  - Dependency Injection 방식
  - 명확한 에러 메시지
  - 키 마스킹 로깅

---

## 환경변수 설정 가이드

필수 환경변수를 `.env` 파일에 설정해야 합니다:

```bash
# 필수
INTERNAL_API_KEY=your-secure-internal-api-key-here

# 권장
PUBLIC_API_KEY=your-public-api-key-here
ALLOWED_ORIGINS=http://localhost:3000
MAX_REQUEST_SIZE=1048576

# 선택 (분산 환경)
REDIS_URL=redis://localhost:6379
```

자세한 설정은 `.env.example` 파일을 참고하세요.

---

## 추가 권장 사항

### Phase 3: 개선 항목 (향후 적용 권장)

1. **에러 메시지 개선**
   - 상세한 에러 정보 숨기기
   - 일반적인 에러 메시지 사용

2. **Request ID 추적**
   - 모든 요청에 고유 ID 부여
   - 로그 추적 용이성 향상

3. **구조화된 로깅**
   - JSON 형식 로그
   - 중앙 로그 수집 시스템 연동

4. **Health Check 강화**
   - Provider 연결 상태 확인
   - 의존성 서비스 체크

---

## 보안 체크리스트

- [x] 하드코딩된 시크릿 제거
- [x] API 키 로그 마스킹
- [x] CORS 제한 설정
- [x] 프롬프트 인젝션 방어
- [x] Redis Rate Limiter
- [x] 요청 크기 제한
- [x] API 인증 추가
- [ ] SSL/TLS 인증서 (운영 환경 필수)
- [ ] IP 화이트리스트 (선택)
- [ ] WAF 도입 (선택)

---

## 운영 환경 배포 전 필수 사항

1. ✅ `.env` 파일에 모든 필수 환경변수 설정
2. ✅ `INTERNAL_API_KEY` 강력한 랜덤 문자열로 설정 (최소 32자)
3. ✅ `ALLOWED_ORIGINS`에 실제 프론트엔드 도메인만 추가
4. ✅ Redis 서버 설정 및 연결 확인 (분산 환경)
5. ⚠️ SSL/TLS 인증서 설정
6. ⚠️ 방화벽 규칙 설정
7. ⚠️ 모니터링 및 알림 설정

---

## 참고: document1.md의 우선순위

이 개선 작업은 `document1.md`의 다음 항목들을 처리했습니다:

### Phase 1 (긴급)
- 8. ✅ 하드코딩 시크릿 제거
- 9. ✅ API 키 로그 마스킹 강화
- 10. ✅ CORS 제한

### Phase 2 (중요)
- 19. ✅ 프롬프트 인젝션 방어
- 20. ✅ Redis Rate Limiter
- 21. ✅ 요청 크기 제한
- 22. ✅ API 인증 추가

---

**Last Updated**: 2025-10-02
