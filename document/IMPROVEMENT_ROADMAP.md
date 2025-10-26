# Behindy 프로젝트 개선 로드맵

> **목적**: 웹 개발자 취업 포트폴리오 완성도 향상
> **전체 기간**: 약 1개월 (31일)
> **최종 목표**: 실전 프로덕션 수준의 프로젝트

---

## 🎯 개선 목표

### Before (현재)
- ✅ 기본적인 기능 구현
- ⚠️ 테스트 180개 (기본 utils만)
- ❌ 보안 취약점 (Rate Limiting, CSRF 없음)
- ❌ 에러 처리 미흡
- ❌ 모니터링 없음
- ❌ 수동 배포

### After (완성)
- ✅ 완성도 높은 기능
- ✅ 테스트 530+ 개 (커버리지 80%+)
- ✅ 강화된 보안
- ✅ 체계적인 에러 처리
- ✅ Sentry + Metrics 모니터링
- ✅ 자동 배포 파이프라인

---

## 📅 전체 일정

```
Week 1 (8일) - Phase 1: 즉시 실행
├── Task 1: Backend 컨트롤러 테스트 (3일)
├── Task 2: Rate Limiting (2일)
├── Task 3: 에러 바운더리 (1일)
└── Task 4: CSRF 토큰 (2일)

Week 2-3 (13일) - Phase 2: 단기 실행
├── Task 5: Frontend 훅 테스트 (5일)
├── Task 6: Sentry 에러 추적 (3일)
├── Task 7: 접근성 개선 (2일)
└── Task 8: 개발자 문서 (3일)

Week 4 (10일) - Phase 3: 중기 실행
├── Task 9: LLM Server CI/CD (2일)
├── Task 10: DB 쿼리 최적화 (3일)
├── Task 11: 성능 모니터링 (2일)
└── Task 12: 자동 배포 (3일)
```

---

## 📋 Phase별 상세 계획

### Phase 1: 즉시 실행 (1주일, 8일)

**우선순위**: 🔴 최우선
**목표**: 포트폴리오 경쟁력 향상

| Task | 내용 | 예상시간 | 효과 |
|------|------|----------|------|
| 1️⃣ Backend 컨트롤러 테스트 | PostController, AuthController, GameController 등 200+ 테스트 작성 | 3일 | ⭐⭐⭐⭐⭐ |
| 2️⃣ Rate Limiting | bucket4j로 IP/사용자별 요청 제한, Brute Force 공격 방지 | 2일 | ⭐⭐⭐⭐ |
| 3️⃣ 에러 바운더리 | error.tsx, not-found.tsx 추가, 사용자 친화적 에러 처리 | 1일 | ⭐⭐⭐ |
| 4️⃣ CSRF 토큰 | Spring Security CSRF + Frontend 연동, CSRF 공격 방어 | 2일 | ⭐⭐⭐⭐ |

**완료 기준:**
- ✅ 컨트롤러 테스트 200개 추가 (총 380개)
- ✅ Rate Limiting 동작 확인
- ✅ 에러 발생 시 에러 바운더리 표시
- ✅ CSRF 토큰 자동 처리

**문서:** [IMPROVEMENT_PHASE1_IMMEDIATE.md](./IMPROVEMENT_PHASE1_IMMEDIATE.md)

---

### Phase 2: 단기 실행 (1-2주, 13일)

**우선순위**: 🟡 높음
**목표**: 완성도 향상

| Task | 내용 | 예상시간 | 효과 |
|------|------|----------|------|
| 5️⃣ Frontend 훅 테스트 | usePosts, usePostForm, useCharacterData 등 150+ 테스트 작성 | 5일 | ⭐⭐⭐⭐ |
| 6️⃣ Sentry 에러 추적 | Frontend + Backend Sentry 설정, 에러 자동 추적 및 알림 | 3일 | ⭐⭐⭐⭐ |
| 7️⃣ 접근성 개선 | WCAG 2.1 AA 수준 달성, aria 속성, 키보드 네비게이션 | 2일 | ⭐⭐⭐ |
| 8️⃣ 개발자 문서 | API 가이드, 상태 관리, 에러 처리, 배포 가이드 작성 | 3일 | ⭐⭐⭐ |

**완료 기준:**
- ✅ 훅 테스트 150개 추가 (총 530개)
- ✅ Sentry 대시보드에서 에러 확인 가능
- ✅ Lighthouse Accessibility 90+ 점수
- ✅ 개발자 문서 5개 완성

**문서:** [IMPROVEMENT_PHASE2_SHORT_TERM.md](./IMPROVEMENT_PHASE2_SHORT_TERM.md)

---

### Phase 3: 중기 실행 (2-4주, 10일)

**우선순위**: 🟢 중요
**목표**: 프로덕션 수준 완성

| Task | 내용 | 예상시간 | 효과 |
|------|------|----------|------|
| 9️⃣ LLM Server CI/CD | GitHub Actions, 린팅, 타입 체크, Docker 빌드 자동화 | 2일 | ⭐⭐⭐ |
| 🔟 DB 쿼리 최적화 | N+1 쿼리 제거, Fetch Join, 인덱스 추가, 성능 50% 향상 | 3일 | ⭐⭐⭐⭐ |
| 1️⃣1️⃣ 성능 모니터링 | Actuator Metrics, Web Vitals, Prometheus (선택) | 2일 | ⭐⭐⭐ |
| 1️⃣2️⃣ 자동 배포 | GitHub Actions 배포, 헬스체크, 롤백 스크립트 | 3일 | ⭐⭐⭐⭐ |

**완료 기준:**
- ✅ 전체 서비스 CI/CD 구축
- ✅ API 응답 시간 50% 단축
- ✅ 실시간 성능 모니터링
- ✅ main merge 시 자동 배포

**문서:** [IMPROVEMENT_PHASE3_MID_TERM.md](./IMPROVEMENT_PHASE3_MID_TERM.md)

---

## 📊 성과 지표

### 테스트 커버리지

```
Before:  180개 (utils만)
Phase 1: 380개 (+200개, +111%)
Phase 2: 530개 (+150개, +39%)
Total:   530개 (+194% 증가)
```

### 보안

```
Before:
❌ Rate Limiting 없음
❌ CSRF 보호 없음
⚠️ 기본적인 보안만

After:
✅ Rate Limiting (IP/사용자별)
✅ CSRF 토큰 보호
✅ XSS, SQL Injection 방어
✅ HTML Sanitization
✅ 입력 검증 강화
```

### 모니터링

```
Before:
❌ 에러 추적 없음
❌ 성능 모니터링 없음
❌ 로깅만

After:
✅ Sentry 에러 추적
✅ Actuator Metrics
✅ Web Vitals 측정
✅ Prometheus (선택)
✅ 실시간 알림
```

### 배포

```
Before:
❌ 수동 배포
⚠️ 다운타임 발생

After:
✅ 자동 배포
✅ 헬스체크
✅ 롤백 스크립트
✅ 무중단 배포
```

### 사용자 경험

```
Before:
❌ 에러 시 빈 화면
⚠️ 접근성 미흡
⚠️ 로딩 표시 일부만

After:
✅ 에러 바운더리
✅ WCAG AA 수준
✅ 스크린 리더 지원
✅ 키보드 네비게이션
```

---

## 🎯 취업 포트폴리오 강점

### 기술 역량 증명

1. **테스트 주도 개발 (TDD)**
   - 530+ 단위/통합 테스트
   - 80%+ 커버리지
   - CI/CD 자동 테스트

2. **보안 의식**
   - Rate Limiting
   - CSRF 토큰
   - XSS/SQL Injection 방어
   - 입력 검증

3. **성능 최적화**
   - N+1 쿼리 해결
   - DB 인덱싱
   - 응답 시간 50% 단축
   - 페이징 최적화

4. **모니터링 및 운영**
   - Sentry 에러 추적
   - Metrics 수집
   - 실시간 알림
   - 로그 관리

5. **자동화**
   - GitHub Actions CI/CD
   - 자동 배포
   - 헬스체크
   - 롤백 스크립트

6. **접근성 (A11y)**
   - WCAG 2.1 AA
   - 스크린 리더
   - 키보드 네비게이션
   - 색상 대비

7. **문서화**
   - API 문서
   - 개발자 가이드
   - 배포 가이드
   - 코드 주석

---

## 🚀 실행 가이드

### 1단계: 준비

```bash
# 1. 현재 상태 확인
cd /Users/solme36/projects/behindy
git status

# 2. 새 브랜치 생성
git checkout -b feature/improvement-phase1

# 3. 문서 확인
cat document/IMPROVEMENT_PHASE1_IMMEDIATE.md
```

### 2단계: Phase 1 실행

```bash
# Day 1: Backend 컨트롤러 테스트 시작
cd backend/src/test/java/com/example/backend/controller/
# PostControllerTest.java 작성

# Day 2: 계속 테스트 작성
# AuthControllerTest.java, GameControllerTest.java

# Day 3: 테스트 완성 및 검증
./gradlew test
# 200+ 테스트 통과 확인

# Day 4-5: Rate Limiting 구현
# RateLimitConfig, RateLimitInterceptor 작성

# Day 6: 에러 바운더리
cd ../../frontend/src/app/
# error.tsx, not-found.tsx 작성

# Day 7-8: CSRF 토큰
# SecurityConfig 수정, axios 설정

# Phase 1 완료 커밋
git add .
git commit -m "feat: Phase 1 완료 - 테스트, 보안 강화"
git push origin feature/improvement-phase1
```

### 3단계: PR 및 리뷰

```bash
# GitHub에서 PR 생성
# main <- feature/improvement-phase1

# CI/CD 자동 실행 확인
# - Frontend 테스트
# - Backend 테스트
# - LLM Server 테스트

# 리뷰 후 merge
```

### 4단계: Phase 2, 3 반복

```bash
# Phase 2 시작
git checkout -b feature/improvement-phase2
# ... 작업

# Phase 3 시작
git checkout -b feature/improvement-phase3
# ... 작업
```

---

## 📈 진행 상황 추적

### Week 1 체크리스트

- [ ] Day 1: PostController 테스트 작성
- [ ] Day 2: AuthController, GameController 테스트
- [ ] Day 3: CharacterController, CommentController 테스트
- [ ] Day 4: Rate Limiting 구현
- [ ] Day 5: Rate Limiting 테스트
- [ ] Day 6: 에러 바운더리 추가
- [ ] Day 7: CSRF 토큰 Backend
- [ ] Day 8: CSRF 토큰 Frontend

### Week 2-3 체크리스트

- [ ] Day 9-10: 커뮤니티 훅 테스트
- [ ] Day 11-12: 게임 훅 테스트
- [ ] Day 13: 인증 훅 테스트
- [ ] Day 14-16: Sentry 설정
- [ ] Day 17-18: 접근성 개선
- [ ] Day 19-21: 개발자 문서 작성

### Week 4 체크리스트

- [ ] Day 22-23: LLM Server CI/CD
- [ ] Day 24-26: DB 쿼리 최적화
- [ ] Day 27-28: 성능 모니터링
- [ ] Day 29-31: 자동 배포

---

## 🎓 학습 효과

### 배울 수 있는 것

1. **테스트 전략**
   - 단위 테스트 vs 통합 테스트
   - Mocking 기법
   - 테스트 커버리지 관리

2. **보안 베스트 프랙티스**
   - OWASP Top 10 대응
   - 인증/인가 패턴
   - 입력 검증

3. **성능 최적화**
   - DB 쿼리 튜닝
   - N+1 문제 해결
   - 캐싱 전략

4. **DevOps**
   - CI/CD 파이프라인
   - Docker 활용
   - 무중단 배포

5. **모니터링**
   - 에러 추적
   - 성능 측정
   - 로그 관리

---

## 💡 면접 대비 포인트

### 질문 1: "테스트는 어떻게 작성하셨나요?"

**답변:**
> "총 530개 이상의 테스트를 작성했습니다. 초기에는 utils 함수만 90개 정도 테스트했지만, 컨트롤러 200개, 훅 150개를 추가로 작성하여 커버리지를 80% 이상으로 높였습니다. 특히 PostController는 생성/조회/수정/삭제 각 시나리오별로 happy path, edge case, 에러 케이스를 모두 테스트했습니다."

### 질문 2: "보안은 어떻게 신경 쓰셨나요?"

**답변:**
> "Rate Limiting으로 Brute Force 공격을 방어하고, CSRF 토큰으로 CSRF 공격을 차단했습니다. 또한 HTML Sanitization으로 XSS 공격을 방어하고, JPA의 파라미터 바인딩으로 SQL Injection을 방지했습니다. 입력 검증은 Spring의 @Valid와 Yup을 사용해 클라이언트와 서버 양쪽에서 검증합니다."

### 질문 3: "성능 최적화는 어떻게 하셨나요?"

**답변:**
> "가장 큰 성능 개선은 N+1 쿼리 문제 해결이었습니다. Fetch Join을 사용해 연관 엔티티를 한 번에 로딩하고, 적절한 인덱스를 추가해 조회 속도를 50% 이상 개선했습니다. 또한 Hibernate의 batch fetch size를 100으로 설정해 여러 엔티티를 효율적으로 로딩합니다."

### 질문 4: "에러가 발생하면 어떻게 처리하나요?"

**답변:**
> "Sentry를 사용해 모든 에러를 자동으로 추적하고, 심각한 에러는 Slack으로 실시간 알림을 받습니다. 프론트엔드는 에러 바운더리로 런타임 에러를 처리하고, 백엔드는 @ControllerAdvice로 전역 에러 핸들러를 구현했습니다. 사용자에게는 기술적 에러보다 친화적인 메시지를 보여줍니다."

### 질문 5: "배포는 어떻게 하나요?"

**답변:**
> "GitHub Actions로 CI/CD 파이프라인을 구축했습니다. main 브랜치에 merge하면 자동으로 테스트가 실행되고, 통과하면 EC2 서버에 배포됩니다. Rolling Update 방식으로 LLM Server → Backend → Frontend 순서로 재시작해 다운타임을 최소화하고, 각 단계마다 헬스체크를 수행합니다. 문제 발생 시 롤백 스크립트로 이전 버전으로 즉시 복구할 수 있습니다."

---

## 🏆 최종 목표

**"실제 서비스 가능한 수준의 포트폴리오"**

✅ 530+ 테스트 (커버리지 80%+)
✅ 강화된 보안 (Rate Limiting, CSRF)
✅ 체계적인 에러 처리 (Sentry, 에러 바운더리)
✅ 성능 최적화 (N+1 해결, 인덱싱)
✅ 자동 배포 (GitHub Actions, 헬스체크)
✅ 실시간 모니터링 (Metrics, Web Vitals)
✅ 접근성 (WCAG AA)
✅ 완전한 문서화

---

## 📚 참고 문서

- [Phase 1: 즉시 실행 계획](./IMPROVEMENT_PHASE1_IMMEDIATE.md)
- [Phase 2: 단기 실행 계획](./IMPROVEMENT_PHASE2_SHORT_TERM.md)
- [Phase 3: 중기 실행 계획](./IMPROVEMENT_PHASE3_MID_TERM.md)
- [테스트 가이드](../TESTING_GUIDE.md)
- [코드 정리 보고서](../CLEANUP_REPORT.md)

---

**작성일**: 2025-10-26
**예상 완료**: 2025-11-26 (1개월)
**작성자**: Claude Code

---

## 🎉 시작하기

지금 바로 Phase 1부터 시작해보세요!

```bash
cd /Users/solme36/projects/behindy
cat document/IMPROVEMENT_PHASE1_IMMEDIATE.md
```

**Good luck! 🚀**
