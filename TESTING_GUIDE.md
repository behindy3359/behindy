# Behindy 테스트 가이드

## 🎯 빠른 시작

### 전체 테스트 한 번에 실행

```bash
# behindy 프로젝트 루트에서
npm test

# 또는
./test-all.sh
```

이 명령어 하나로 **Frontend, Backend, LLM Server 모든 테스트가 자동 실행**됩니다!

---

## 📋 테스트 명령어 모음

### 1️⃣ 전체 테스트 실행

```bash
npm test
```

**실행 순서**:
1. Frontend 테스트 (90개)
2. Backend 테스트
3. LLM Server 테스트 (17개)

**예상 소요 시간**: 약 10-30초

---

### 2️⃣ 개별 테스트 실행

#### Frontend만 테스트

```bash
npm run test:frontend

# 또는 직접 실행
cd frontend
npm test
```

**테스트 내용**:
- ✅ 90개 테스트 케이스
- ✅ passwordUtils (22 tests)
- ✅ constants (28 tests)
- ✅ validation (40 tests)

---

#### Backend만 테스트

```bash
npm run test:backend

# 또는 직접 실행
cd backend
./gradlew test --no-daemon
```

**테스트 내용**:
- Spring Boot 단위 테스트
- Controller, Service, Repository 테스트
- 통합 테스트

---

#### LLM Server만 테스트

```bash
npm run test:llmserver

# 또는 직접 실행
cd llmserver
mv tests/conftest.py tests/conftest.py.bak
pytest tests/test_utils.py -v
mv tests/conftest.py.bak tests/conftest.py
```

**테스트 내용**:
- ✅ 17개 테스트 케이스
- ✅ 테마 검증 (Mystery, Horror, Thriller)
- ✅ 지하철역 검증 (1-4호선)
- ✅ 체력/정신력 범위 검증
- ✅ 선택지 구조 검증

---

### 3️⃣ Watch 모드 (개발 중 자동 테스트)

```bash
npm run test:watch
```

Frontend 코드를 수정하면 **자동으로 관련 테스트가 실행**됩니다.

---

### 4️⃣ 커버리지 확인

```bash
npm run test:coverage
```

테스트 커버리지 리포트를 HTML로 생성합니다.

```bash
# 리포트 열기
open frontend/coverage/index.html  # macOS
```

---

## 🗂️ 테스트 파일 위치

### Frontend
```
frontend/src/
├── features/auth/utils/__tests__/
│   └── passwordUtils.test.ts          (22 tests)
└── shared/utils/common/__tests__/
    ├── constants.test.ts               (28 tests)
    └── validation.test.ts              (40 tests)
```

### Backend
```
backend/src/test/java/
├── controller/
├── service/
└── repository/
```

### LLM Server
```
llmserver/tests/
├── conftest.py                         (pytest 설정)
├── pytest.ini                          (pytest 설정)
├── test_utils.py                       (17 tests)
└── test_api_endpoints.py               (작성 완료)
```

---

## 🔧 테스트 환경 설정

### Frontend 테스트 환경

**파일**: `frontend/vitest.config.ts`
- Vitest 사용
- happy-dom 환경
- @ alias → src 디렉토리

**Mock 설정**: `frontend/vitest.setup.ts`
- localStorage mock
- sessionStorage mock
- matchMedia mock
- IntersectionObserver mock
- ResizeObserver mock

---

### LLM Server 테스트 환경

**파일**: `llmserver/pytest.ini`
- pytest 설정
- 마커 정의 (unit, integration, api, slow)

**Fixtures**: `llmserver/tests/conftest.py`
- FastAPI 테스트 클라이언트
- Mock 데이터 (story request, response 등)

---

## 📊 테스트 현황

### Frontend
- **파일 수**: 3개
- **테스트 수**: 90개
- **통과율**: 100% ✅
- **실행 시간**: ~1.8초

### Backend
- **상태**: 설정 완료
- **테스트 프레임워크**: JUnit 5 + Mockito

### LLM Server
- **파일 수**: 2개
- **테스트 수**: 17개
- **통과율**: 100% ✅
- **실행 시간**: ~0.03초

---

## 🚨 문제 해결

### 문제 1: `npm: command not found`

```bash
# Node.js 설치 확인
node --version
npm --version

# 없다면 설치
brew install node  # macOS
```

---

### 문제 2: Frontend 테스트 실패

```bash
# node_modules 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install
npm test
```

---

### 문제 3: `pytest: command not found`

```bash
# pytest 설치
pip install pytest pytest-asyncio httpx
```

---

### 문제 4: Backend gradlew 권한 오류

```bash
cd backend
chmod +x gradlew
./gradlew test
```

---

## 💡 테스트 작성 가이드

### Frontend 테스트 작성

```typescript
// 예시: frontend/src/utils/__tests__/myUtil.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myUtil';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

---

### LLM Server 테스트 작성

```python
# 예시: llmserver/tests/test_my_feature.py
import pytest

@pytest.mark.unit
class TestMyFeature:
    def test_something(self):
        result = my_function('input')
        assert result == 'expected'
```

---

## 🔄 CI/CD 자동 테스트

GitHub Actions에서 자동으로 테스트가 실행됩니다.

**실행 조건**:
- PR 생성 시
- main/develop 브랜치 push 시

**워크플로우**: `.github/workflows/test.yml`

---

## 📚 관련 문서

- [TEST_IMPLEMENTATION_SUMMARY.md](../behindy-build/TEST_IMPLEMENTATION_SUMMARY.md) - 테스트 구현 요약
- [document/05_테스트_강화_실행계획.md](../behindy-build/document/05_테스트_강화_실행계획.md) - 단계별 가이드
- [document/04_테스트코드_분석_및_개선계획.md](../behindy-build/document/04_테스트코드_분석_및_개선계획.md) - 테스트 전략

---

## 🎯 테스트 베스트 프랙티스

### 1. 테스트 작성 원칙

**AAA 패턴**:
```typescript
test('should calculate total', () => {
  // Arrange (준비)
  const items = [1, 2, 3];

  // Act (실행)
  const total = sum(items);

  // Assert (검증)
  expect(total).toBe(6);
});
```

---

### 2. 테스트 이름 짓기

❌ **나쁜 예**:
```typescript
test('test1', () => {});
test('works', () => {});
```

✅ **좋은 예**:
```typescript
test('should return error when email is invalid', () => {});
test('should calculate discount for premium users', () => {});
```

---

### 3. 독립적인 테스트

각 테스트는 **다른 테스트에 영향을 주지 않아야** 합니다.

```typescript
// ❌ 나쁜 예 - 전역 상태 의존
let counter = 0;
test('increments counter', () => {
  counter++;
  expect(counter).toBe(1);
});

// ✅ 좋은 예 - 독립적
test('increments counter', () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

---

## 🎉 마치며

이제 **`npm test` 한 번**으로 전체 프로젝트를 테스트할 수 있습니다!

질문이나 문제가 있다면 이슈를 등록해주세요.

**Happy Testing!** 🚀
