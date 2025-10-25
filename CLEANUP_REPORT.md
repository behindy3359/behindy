# Behindy 프로젝트 코드 정리 보고서

> 생성일: 2025-10-25
> 분석 대상: Frontend, Backend, LLM Server 전체 코드베이스

## 📊 요약

**사용되지 않는 의존성:** 6개
**사용되지 않는 함수:** 9개
**예상 절감 효과:**
- 의존성 제거로 빌드 크기 감소
- 코드 복잡도 감소
- 유지보수 부담 감소

---

## 1. 사용되지 않는 의존성 (Unused Dependencies)

### 1.1 Frontend (package.json)

#### ❌ 제거 가능 (4개)

| 패키지 | 버전 | 상태 | 사용처 | 제거 가능 여부 |
|--------|------|------|--------|---------------|
| `@babel/runtime` | ^7.27.1 | 미사용 | 없음 | ✅ 가능 |
| `clsx` | ^2.1.1 | 미사용 | 없음 | ✅ 가능 |
| `d3` | ^7.9.0 | 미사용 | 없음 | ✅ 가능 |
| `jwt-decode` | ^4.0.0 | 미사용 | 없음 | ✅ 가능 |

**제거 명령어:**
```bash
cd frontend
npm uninstall @babel/runtime clsx d3 jwt-decode
npm uninstall --save-dev @types/d3
```

**예상 효과:**
- 패키지 크기 감소: 약 2-3MB
- node_modules 파일 수 감소
- 빌드 시간 소폭 개선

---

#### ✅ 실제 사용 중 (7개)

| 패키지 | 사용처 | 사용 예시 |
|--------|--------|----------|
| `@hookform/resolvers` | forgot-password, useCommentForm, usePostForm | `yupResolver` 사용 |
| `date-fns` | shared/utils/common/index.ts | 시간 포맷팅 |
| `framer-motion` | 45+ 파일 | UI 애니메이션 |
| `lucide-react` | 68+ 파일 | 아이콘 라이브러리 |
| `react-markdown` | PostContent.tsx | 마크다운 렌더링 |
| `remark-gfm` | PostContent.tsx | 마크다운 플러그인 |
| `yup` | 3+ 파일 | 폼 검증 스키마 |

---

### 1.2 Backend (build.gradle)

#### ❌ 제거 가능 (1개)

| 의존성 | 상태 | 사용처 | 제거 가능 여부 |
|--------|------|--------|---------------|
| `jasypt:1.9.3` | 미사용 | 없음 | ✅ 가능 |

**상세 설명:**
- 프로젝트는 커스텀 AES 암호화 구현을 사용 중
- `FieldCryptoUtils.java`, `FieldCryptoConverter.java`에서 자체 암호화 처리
- jasypt 의존성은 추가되었지만 실제 코드에서 사용하지 않음

**제거 방법:**
```gradle
// build.gradle 41번 라인 제거
// implementation 'org.jasypt:jasypt:1.9.3'
```

---

#### ✅ 실제 사용 중 (5개)

| 의존성 | 사용처 | 목적 |
|--------|--------|------|
| `spring-boot-starter-actuator` | application.yml, AccessLoggingFilter | 모니터링/헬스체크 |
| `jsoup:1.15.3` | HtmlSanitizer.java | HTML 새니타이제이션 |
| `springdoc-openapi-starter-webmvc-ui:2.7.0` | SwaggerConfig, 모든 컨트롤러 | API 문서화 |
| `jackson-datatype-jsr310` | CacheConfig, 엔티티/DTO | Java 8 날짜/시간 직렬화 |
| `jackson-module-parameter-names` | DTO의 @JsonProperty | JSON 속성명 매핑 |

---

### 1.3 LLM Server (requirements.txt)

#### ❌ 제거 가능 (1개)

| 패키지 | 상태 | 사용처 | 제거 가능 여부 |
|--------|------|--------|---------------|
| `python-json-logger==2.0.7` | 미사용 | 없음 | ✅ 가능 |

**상세 설명:**
- 프로젝트는 Python 표준 `logging` 모듈만 사용
- JSON 포맷 로깅이 구현되지 않음
- `pythonjsonlogger` import 없음

**제거 방법:**
```bash
cd llmserver
# requirements.txt에서 python-json-logger==2.0.7 라인 제거
pip uninstall python-json-logger
```

---

#### ✅ 실제 사용 중 (2개)

| 패키지 | 사용처 | 목적 |
|--------|--------|------|
| `aiohttp==3.9.1` | providers/llm_provider.py | LLM API 비동기 HTTP 요청 |
| `requests==2.31.0` | tests/test_simple.py | 테스트 코드용 HTTP 클라이언트 |

---

## 2. 사용되지 않는 함수 (Unused Functions)

### 2.1 Frontend - 미사용 함수 (7개)

#### 🔴 우선순위 높음 - 제거 권장

**1. `calculatePostStats` (postCardUtils.ts:35-41)**
```typescript
export const calculatePostStats = (post: Post) => {
  return {
    commentCount: 0, // TODO: 실제 댓글 수 연동
    likeCount: 0,    // TODO: 실제 좋아요 수 연동
    viewCount: 0,    // TODO: 실제 조회수 연동
  };
};
```
- **상태:** 미완성 구현, TODO 주석만 존재
- **사용처:** 없음
- **권장 조치:** 제거 (향후 필요 시 재작성)

---

**2. `navigateToGame` (gameNavigation.ts:14-40)**
```typescript
export const navigateToGame = (
  stationName: string,
  lineNumber: number,
  router: NextRouter
): void => {
  // ... 게임 진입 로직
};
```
- **상태:** 정의되었지만 호출되지 않음
- **사용처:** 없음 (`resumeCurrentGame`만 사용됨)
- **권장 조치:** 제거 또는 실제 기능 구현 확인

---

**3. `quitGame` (gameNavigation.ts:61-82)**
```typescript
export const quitGame = async (
  router: NextRouter,
  resetThemeToDefault: () => void
): Promise<void> => {
  // ... 게임 종료 로직
};
```
- **상태:** 정의되었지만 호출되지 않음
- **사용처:** 없음
- **권장 조치:** 제거

---

**4. `exitToMain` (gameNavigation.ts:87-95)**
```typescript
export const exitToMain = (
  router: NextRouter,
  resetThemeToDefault: () => void
): void => {
  // ... 메인으로 나가기 로직
};
```
- **상태:** 정의되었지만 호출되지 않음
- **사용처:** 없음
- **권장 조치:** 제거

---

#### 🟡 우선순위 보통 - 검토 후 결정

**5. `getGridClassName` (postListUtils.ts:36-40)**
```typescript
export const getGridClassName = (viewMode: 'grid' | 'list'): string => {
  return viewMode === 'grid'
    ? 'grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));'
    : 'display: flex; flex-direction: column;';
};
```
- **상태:** CSS 레이아웃 생성 함수, 미사용
- **사용처:** 없음
- **권장 조치:** 그리드 뷰 기능 구현 계획 없으면 제거

---

**6. `validateSearchQuery` (postListUtils.ts:59-60)**
```typescript
export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length >= 1;
};
```
- **상태:** 간단한 검증 함수, 미사용
- **사용처:** 없음
- **권장 조치:** 인라인 검증으로 대체 가능하므로 제거

---

**7. `getAboutPageBySlug` (about/utils/index.ts:36-38)**
```typescript
export const getAboutPageBySlug = (slug: string): AboutNavigationItem | undefined => {
  return aboutPages.find((page) => page.slug === slug);
};
```
- **상태:** 페이지 조회 함수, 미사용
- **사용처:** 없음 (`isValidAboutSlug`만 사용됨)
- **권장 조치:** 제거 (필요 시 컴포넌트에서 직접 find 사용)

---

### 2.2 Backend - 미사용 메서드 (1개)

#### 🟡 우선순위 보통

**1. `sanitizeBasic` (HtmlSanitizer.java:21-26)**
```java
public String sanitizeBasic(String input) {
    if (input == null) {
        return null;
    }
    return Jsoup.clean(input, Safelist.basic());
}
```
- **상태:** 정의되었지만 호출되지 않음
- **사용처:** 없음 (`sanitize` 메서드만 사용됨)
- **권장 조치:**
  - 옵션 1: 제거 (현재 사용하지 않음)
  - 옵션 2: 마크다운 지원 기능 구현 시 활용 가능 (보류)

---

### 2.3 LLM Server - 미사용 메서드 (1개)

#### 🟢 우선순위 낮음

**1. `get_status` (rate_limiter.py)**
```python
def get_status(self) -> Dict:
    """제한 상태 반환"""
    return {
        "active_clients": len(self._requests),
        "total_requests": self._total_requests
    }
```
- **상태:** 정의되었지만 호출되지 않음
- **사용처:** 없음 (`get_total_requests`만 사용됨)
- **권장 조치:**
  - 옵션 1: 제거
  - 옵션 2: `/health` 엔드포인트에서 rate limiter 상태 노출 시 활용 (보류)

---

## 3. 정리 실행 계획

### Phase 1: 즉시 실행 가능 (안전)

#### Frontend 의존성 제거
```bash
cd /Users/solme36/projects/behindy/frontend
npm uninstall @babel/runtime clsx d3 jwt-decode @types/d3
npm install  # package-lock.json 업데이트
npm run build  # 빌드 테스트
npm test  # 테스트 통과 확인
```

#### Backend 의존성 제거
```bash
cd /Users/solme36/projects/behindy/backend
# build.gradle 41번 라인 제거:
# implementation 'org.jasypt:jasypt:1.9.3'
./gradlew clean build --no-daemon
./gradlew test --no-daemon
```

#### LLM Server 의존성 제거
```bash
cd /Users/solme36/projects/behindy/llmserver
# requirements.txt에서 python-json-logger==2.0.7 제거
pip uninstall -y python-json-logger
pytest tests/test_utils.py -v
```

---

### Phase 2: 검토 후 실행 (신중)

#### Frontend 미사용 함수 제거

**파일 1: `frontend/src/features/community/utils/postCardUtils.ts`**
- `calculatePostStats` 함수 제거 (35-41번 라인)

**파일 2: `frontend/src/features/game/utils/gameNavigation.ts`**
- `navigateToGame` 함수 제거 (14-40번 라인)
- `quitGame` 함수 제거 (61-82번 라인)
- `exitToMain` 함수 제거 (87-95번 라인)

**파일 3: `frontend/src/features/community/utils/postListUtils.ts`**
- `validateSearchQuery` 함수 제거 (59-60번 라인)
- `getGridClassName` 함수 제거 (36-40번 라인)

**파일 4: `frontend/src/features/about/utils/index.ts`**
- `getAboutPageBySlug` 함수 제거 (36-38번 라인)

**테스트:**
```bash
npm test
npm run build
```

---

#### Backend 미사용 메서드 제거

**파일: `backend/src/main/java/com/example/backend/util/HtmlSanitizer.java`**
- `sanitizeBasic` 메서드 제거 (21-26번 라인)

**테스트:**
```bash
./gradlew test --no-daemon
./gradlew build --no-daemon
```

---

#### LLM Server 미사용 메서드 제거

**파일: `llmserver/utils/rate_limiter.py`**
- `get_status` 메서드 제거

**테스트:**
```bash
pytest tests/test_utils.py -v
```

---

## 4. 예상 효과

### 4.1 정량적 효과

| 항목 | 제거 전 | 제거 후 | 개선 |
|------|---------|---------|------|
| Frontend 의존성 | 15개 | 11개 | -27% |
| Backend 의존성 | ~25개 | ~24개 | -4% |
| LLM Server 의존성 | 11개 | 10개 | -9% |
| 미사용 함수 | 9개 | 0개 | -100% |
| node_modules 크기 | ~500MB | ~497MB | -3MB |

### 4.2 정성적 효과

✅ **코드 복잡도 감소**
- 실제 사용하는 코드만 남아 이해가 쉬워짐
- 새 개발자 온보딩 시간 단축

✅ **유지보수 부담 감소**
- 보안 업데이트 대상 패키지 감소
- 테스트 커버리지 집중 가능

✅ **빌드 성능 개선**
- 의존성 다운로드 시간 감소
- 번들 크기 소폭 감소

✅ **명확한 코드베이스**
- TODO 주석과 미완성 코드 제거
- 실제 동작하는 코드만 유지

---

## 5. 주의사항

### 5.1 제거 전 확인 사항

1. **Git 커밋 상태 확인**
   ```bash
   git status
   git add .
   git commit -m "feat: 사용하지 않는 의존성 및 함수 제거 전 커밋"
   ```

2. **브랜치 생성**
   ```bash
   git checkout -b cleanup/remove-unused-code
   ```

3. **전체 테스트 실행**
   ```bash
   npm test  # 루트에서 전체 테스트
   ```

### 5.2 롤백 방법

만약 문제가 발생하면:
```bash
git checkout main
git branch -D cleanup/remove-unused-code
```

---

## 6. 실행 체크리스트

### Phase 1: 의존성 제거

- [ ] Frontend 의존성 제거 (@babel/runtime, clsx, d3, jwt-decode, @types/d3)
- [ ] Frontend 빌드 테스트 성공
- [ ] Frontend 테스트 90개 통과
- [ ] Backend 의존성 제거 (jasypt)
- [ ] Backend 빌드 테스트 성공
- [ ] Backend 테스트 73개 통과
- [ ] LLM Server 의존성 제거 (python-json-logger)
- [ ] LLM Server 테스트 17개 통과
- [ ] Git 커밋: "chore: 사용하지 않는 의존성 제거"

### Phase 2: 함수 제거 (선택)

- [ ] Frontend 미사용 함수 7개 제거
- [ ] Backend 미사용 메서드 1개 제거
- [ ] LLM Server 미사용 메서드 1개 제거
- [ ] 전체 테스트 재실행 (180개)
- [ ] Git 커밋: "refactor: 사용하지 않는 함수 제거"

### Phase 3: 검증

- [ ] 전체 프로젝트 빌드 성공
- [ ] Docker Compose 빌드 테스트
- [ ] 로컬 환경 동작 확인
- [ ] Git 푸시
- [ ] PR 생성 및 리뷰 요청

---

## 7. 결론

**총 제거 가능:**
- 의존성: 6개
- 함수: 9개

**작업 난이도:** 낮음
**예상 소요 시간:** 30분
**위험도:** 낮음 (미사용 코드 제거)

**추천 실행 순서:**
1. Phase 1 (의존성 제거) 먼저 실행
2. 테스트 통과 확인
3. Phase 2 (함수 제거) 선택적 실행
4. 최종 테스트 및 커밋

---

**생성일:** 2025-10-25
**분석 도구:** Claude Code with Explore Agent
**분석 범위:** behindy 프로젝트 전체 (Frontend, Backend, LLM Server)
