# Phase 2: 단기 실행 개선 계획 (1-2주)

> **목표**: 완성도 향상을 위한 핵심 개선
> **기간**: 1-2주 (13일)
> **우선순위**: 🟡 높음

---

## 📋 개요

Phase 1 완료 후, **테스트 확대**, **모니터링 체계**, **접근성**, **문서화**를 통해 프로젝트 완성도를 한 단계 높입니다.

**주요 목표:**
1. ✅ Frontend 훅 테스트 150+ 개 추가
2. ✅ Sentry 에러 추적 시스템 구축
3. ✅ 웹 접근성(A11y) 개선
4. ✅ 개발자 문서 작성

---

## 🎯 Task 5: Frontend 훅 테스트

**예상 시간**: 5일
**난이도**: 중간
**효과**: ⭐⭐⭐⭐

### 현재 상태

```
Frontend 테스트: 90개 (utils만)
미테스트 영역:
❌ 커뮤니티 훅 (usePosts, usePostForm, usePostDetail 등)
❌ 게임 훅 (useCharacterData, useGameFlow 등)
❌ 인증 훅 (useAuth 등)
❌ API 훅 (React Query hooks)
```

### 목표

**150+ Frontend 훅 테스트 추가**로 핵심 로직 커버

### 구현 계획

#### Day 1-2: 커뮤니티 훅 테스트 (60개)

**파일 1**: `frontend/src/features/community/hooks/__tests__/usePosts.test.tsx`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePosts } from '../usePosts';
import { QueryWrapper } from '@/test-utils/queryWrapper';
import * as api from '@/shared/utils/common/api';

// Mock API
vi.mock('@/shared/utils/common/api', () => ({
  publicApi: {
    getPosts: vi.fn(),
  },
}));

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================
  // 1. 데이터 로딩 테스트 (15개)
  // ========================================

  it('성공: 게시글 목록을 정상적으로 불러온다', async () => {
    // Given
    const mockPosts = {
      posts: [
        { postId: 1, title: '테스트 게시글 1', content: '내용 1' },
        { postId: 2, title: '테스트 게시글 2', content: '내용 2' },
      ],
      totalElements: 2,
      totalPages: 1,
    };

    vi.mocked(api.publicApi.getPosts).mockResolvedValue(mockPosts);

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPosts);
    expect(result.current.data?.posts).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('성공: 페이징 파라미터가 API에 전달된다', async () => {
    // Given
    const page = 2;
    const size = 10;

    vi.mocked(api.publicApi.getPosts).mockResolvedValue({
      posts: [],
      totalElements: 0,
      totalPages: 0,
    });

    // When
    renderHook(
      () => usePosts({ page, size }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(api.publicApi.getPosts).toHaveBeenCalledWith(
        expect.stringContaining(`page=${page}`)
      );
      expect(api.publicApi.getPosts).toHaveBeenCalledWith(
        expect.stringContaining(`size=${size}`)
      );
    });
  });

  it('성공: 로딩 상태가 올바르게 변경된다', async () => {
    // Given
    vi.mocked(api.publicApi.getPosts).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        posts: [],
        totalElements: 0,
        totalPages: 0,
      }), 100))
    );

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('성공: 빈 결과를 정상적으로 처리한다', async () => {
    // Given
    vi.mocked(api.publicApi.getPosts).mockResolvedValue({
      posts: [],
      totalElements: 0,
      totalPages: 0,
    });

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(result.current.data?.posts).toEqual([]);
      expect(result.current.data?.totalElements).toBe(0);
    });
  });

  // ... 추가 11개 로딩 테스트

  // ========================================
  // 2. 에러 처리 테스트 (15개)
  // ========================================

  it('실패: 네트워크 에러 시 에러 상태를 반환한다', async () => {
    // Given
    const networkError = new Error('Network Error');
    vi.mocked(api.publicApi.getPosts).mockRejectedValue(networkError);

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeTruthy();
    });
  });

  it('실패: 401 인증 에러를 올바르게 처리한다', async () => {
    // Given
    const authError = { response: { status: 401 } };
    vi.mocked(api.publicApi.getPosts).mockRejectedValue(authError);

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('실패: 500 서버 에러를 올바르게 처리한다', async () => {
    // Given
    const serverError = { response: { status: 500 } };
    vi.mocked(api.publicApi.getPosts).mockRejectedValue(serverError);

    // When
    const { result } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  // ... 추가 12개 에러 테스트

  // ========================================
  // 3. 필터링/검색 테스트 (15개)
  // ========================================

  it('성공: 카테고리 필터가 적용된다', async () => {
    // Given
    const category = 'GENERAL';
    vi.mocked(api.publicApi.getPosts).mockResolvedValue({
      posts: [
        { postId: 1, title: '일반 게시글', category: 'GENERAL' },
      ],
      totalElements: 1,
      totalPages: 1,
    });

    // When
    renderHook(
      () => usePosts({ page: 0, size: 20, category }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(api.publicApi.getPosts).toHaveBeenCalledWith(
        expect.stringContaining(`category=${category}`)
      );
    });
  });

  it('성공: 검색어 필터가 적용된다', async () => {
    // Given
    const searchTerm = '테스트';
    vi.mocked(api.publicApi.getPosts).mockResolvedValue({
      posts: [
        { postId: 1, title: '테스트 게시글' },
      ],
      totalElements: 1,
      totalPages: 1,
    });

    // When
    renderHook(
      () => usePosts({ page: 0, size: 20, searchTerm }),
      { wrapper: QueryWrapper }
    );

    // Then
    await waitFor(() => {
      expect(api.publicApi.getPosts).toHaveBeenCalledWith(
        expect.stringContaining(`search=${searchTerm}`)
      );
    });
  });

  // ... 추가 13개 필터/검색 테스트

  // ========================================
  // 4. 캐싱/재검증 테스트 (15개)
  // ========================================

  it('성공: 같은 페이지 재요청 시 캐시를 사용한다', async () => {
    // Given
    vi.mocked(api.publicApi.getPosts).mockResolvedValue({
      posts: [],
      totalElements: 0,
      totalPages: 0,
    });

    // When
    const { result, rerender } = renderHook(
      () => usePosts({ page: 0, size: 20 }),
      { wrapper: QueryWrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstCallCount = vi.mocked(api.publicApi.getPosts).mock.calls.length;

    // 재렌더링
    rerender();

    // Then
    expect(vi.mocked(api.publicApi.getPosts).mock.calls.length).toBe(firstCallCount);
  });

  // ... 추가 14개 캐싱 테스트
});
```

**파일 2**: `frontend/src/features/community/hooks/__tests__/usePostForm.test.tsx` (30개)

**주요 시나리오:**
- 폼 초기화 (생성 모드, 수정 모드)
- 폼 검증 (제목, 내용, 길이 제한)
- 제출 성공/실패
- 로딩 상태 관리
- 에러 처리

**파일 3**: `frontend/src/features/community/hooks/__tests__/usePostDetail.test.tsx` (30개)

---

#### Day 3-4: 게임 훅 테스트 (60개)

**파일 1**: `frontend/src/features/game/hooks/__tests__/useCharacterData.test.tsx` (30개)

```typescript
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCharacterData } from '../useCharacterData';
import { QueryWrapper } from '@/test-utils/queryWrapper';
import api from '@/config/axiosConfig';

vi.mock('@/config/axiosConfig');

describe('useCharacterData', () => {
  // ========================================
  // 1. 캐릭터 조회 테스트 (10개)
  // ========================================

  it('성공: 캐릭터 정보를 정상적으로 불러온다', async () => {
    // Given
    const mockCharacter = {
      charId: 1,
      charName: '테스트 캐릭터',
      hp: 100,
      sp: 100,
      isAlive: true,
    };

    vi.mocked(api.get).mockResolvedValue({ data: mockCharacter });

    // When
    const { result } = renderHook(() => useCharacterData(), {
      wrapper: QueryWrapper,
    });

    // Then
    await waitFor(() => {
      expect(result.current.character).toEqual(mockCharacter);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('성공: 캐릭터가 없는 경우 null을 반환한다', async () => {
    // Given
    vi.mocked(api.get).mockRejectedValue({ response: { status: 404 } });

    // When
    const { result } = renderHook(() => useCharacterData(), {
      wrapper: QueryWrapper,
    });

    // Then
    await waitFor(() => {
      expect(result.current.character).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ... 추가 8개 조회 테스트

  // ========================================
  // 2. 캐릭터 생성 테스트 (10개)
  // ========================================

  it('성공: 캐릭터를 생성하고 상태를 업데이트한다', async () => {
    // Given
    const newCharacter = {
      charName: '새 캐릭터',
      hp: 100,
      sp: 100,
    };

    const createdCharacter = {
      charId: 1,
      ...newCharacter,
      isAlive: true,
    };

    vi.mocked(api.post).mockResolvedValue({ data: createdCharacter });

    // When
    const { result } = renderHook(() => useCharacterData(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      await result.current.createCharacter(newCharacter);
    });

    // Then
    expect(result.current.character).toEqual(createdCharacter);
  });

  // ... 추가 9개 생성 테스트

  // ========================================
  // 3. 스탯 업데이트 테스트 (10개)
  // ========================================

  it('성공: HP 감소를 올바르게 반영한다', async () => {
    // Given
    const character = {
      charId: 1,
      charName: '테스트',
      hp: 100,
      sp: 100,
      isAlive: true,
    };

    vi.mocked(api.get).mockResolvedValue({ data: character });
    vi.mocked(api.patch).mockResolvedValue({
      data: { ...character, hp: 80 },
    });

    // When
    const { result } = renderHook(() => useCharacterData(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.character).toBeTruthy();
    });

    await act(async () => {
      await result.current.updateStats({ hpChange: -20 });
    });

    // Then
    expect(result.current.character?.hp).toBe(80);
  });

  // ... 추가 9개 스탯 테스트
});
```

**파일 2**: `frontend/src/features/game/hooks/__tests__/useGameFlow.test.tsx` (30개)

---

#### Day 5: 인증 훅 테스트 (30개)

**파일**: `frontend/src/features/auth/hooks/__tests__/useAuth.test.tsx`

**주요 시나리오:**
- 로그인 성공/실패
- 로그아웃
- 토큰 갱신
- 인증 상태 확인
- 세션 만료 처리

### 테스트 유틸리티

**파일**: `frontend/src/test-utils/testHelpers.ts`

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock API response helper
export function mockApiSuccess<T>(data: T) {
  return Promise.resolve({ data });
}

export function mockApiError(status: number, message: string) {
  return Promise.reject({
    response: {
      status,
      data: { message },
    },
  });
}

// Wait for async updates
export async function waitForLoadingToFinish() {
  await new Promise(resolve => setTimeout(resolve, 0));
}
```

### 실행 방법

```bash
# 1. 테스트 파일 생성
mkdir -p frontend/src/features/community/hooks/__tests__
mkdir -p frontend/src/features/game/hooks/__tests__
mkdir -p frontend/src/features/auth/hooks/__tests__

# 2. 각 테스트 작성

# 3. 개별 테스트 실행
npm test -- usePosts.test.tsx
npm test -- usePostForm.test.tsx
npm test -- useCharacterData.test.tsx

# 4. 전체 훅 테스트 실행
npm test -- hooks/__tests__/

# 5. 커버리지 확인
npm run test:coverage
open coverage/index.html
```

### 성공 기준

- ✅ 150+ 훅 테스트 작성
- ✅ 모든 테스트 통과
- ✅ 커버리지 80% 이상
- ✅ API 호출 모두 mocking

---

## 🎯 Task 6: Sentry 에러 추적

**예상 시간**: 3일
**난이도**: 중간
**효과**: ⭐⭐⭐⭐

### 현재 상태

```
❌ 에러 추적 시스템 없음
❌ 프로덕션 에러 모니터링 불가
❌ console.error만 사용
```

### 목표

**Sentry로 Frontend & Backend 에러 추적 시스템 구축**

### 구현 계획

#### Step 1: Sentry 계정 및 프로젝트 생성

1. https://sentry.io 가입
2. 프로젝트 생성:
   - `behindy-frontend` (Next.js)
   - `behindy-backend` (Spring Boot)
3. DSN 키 획득

#### Step 2: Frontend Sentry 설정

**설치:**

```bash
cd frontend
npm install @sentry/nextjs --save
npx @sentry/wizard@latest -i nextjs
```

**파일 1**: `frontend/sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 트레이싱 샘플링 (10%)
  tracesSampleRate: 0.1,

  // 디버그 모드 (개발 환경)
  debug: process.env.NODE_ENV === 'development',

  // 릴리스 버전
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // 에러 필터링
  beforeSend(event, hint) {
    // 개발 환경에서는 Sentry로 전송하지 않음
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Event (not sent):', event);
      return null;
    }

    // 특정 에러 무시
    if (event.exception) {
      const errorMessage = event.exception.values?.[0]?.value;
      if (errorMessage?.includes('ResizeObserver')) {
        return null; // ResizeObserver 에러 무시
      }
    }

    return event;
  },

  // 성능 모니터링
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/api\.behindy\.com/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // 세션 리플레이 샘플링
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**파일 2**: `frontend/sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,

  // 서버 사이드 특화 설정
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
```

**파일 3**: `frontend/sentry.edge.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

**파일 4**: `frontend/.env.local` (추가)

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Step 3: Frontend 에러 캡처

**파일**: `frontend/src/config/axiosConfig.ts` (수정)

```typescript
import * as Sentry from '@sentry/nextjs';

// Response Interceptor에 Sentry 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Sentry에 에러 전송
    Sentry.captureException(error, {
      tags: {
        api_endpoint: error.config?.url,
        api_method: error.config?.method,
      },
      contexts: {
        response: {
          status: error.response?.status,
          data: error.response?.data,
        },
      },
    });

    // 기존 에러 처리...
    return Promise.reject(error);
  }
);
```

**파일**: `frontend/src/app/error.tsx` (수정)

```typescript
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Sentry에 에러 전송
    Sentry.captureException(error, {
      tags: {
        error_boundary: 'global',
      },
    });
  }, [error]);

  // 기존 UI...
}
```

**수동 에러 캡처 예시:**

```typescript
// features/community/hooks/usePostForm.ts
import * as Sentry from '@sentry/nextjs';

const handleSubmit = async (data: PostFormData) => {
  try {
    await submitPost(data);
  } catch (error) {
    // Sentry에 컨텍스트와 함께 전송
    Sentry.captureException(error, {
      tags: {
        feature: 'community',
        action: 'create_post',
      },
      user: {
        id: currentUser?.id,
        username: currentUser?.name,
      },
      extra: {
        postTitle: data.title,
        postCategory: data.category,
      },
    });

    throw error;
  }
};
```

#### Step 4: Backend Sentry 설정

**설치:**

`backend/build.gradle`에 추가:

```gradle
dependencies {
    // Sentry
    implementation 'io.sentry:sentry-spring-boot-starter-jakarta:6.34.0'
    implementation 'io.sentry:sentry-logback:6.34.0'
}
```

**파일**: `backend/src/main/resources/application.yml` (추가)

```yaml
sentry:
  dsn: ${SENTRY_DSN:}
  environment: ${ENVIRONMENT:development}
  traces-sample-rate: 0.1
  enable-tracing: true

  # 태그 추가
  tags:
    service: backend
    version: 1.0.0

  # 에러 필터링
  ignored-exceptions-for-type:
    - org.springframework.security.access.AccessDeniedException
    - org.springframework.web.servlet.NoHandlerFoundException
```

**파일**: `backend/src/main/resources/logback-spring.xml` (수정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 기존 appender... -->

    <!-- Sentry Appender -->
    <appender name="SENTRY" class="io.sentry.logback.SentryAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="SENTRY"/>
    </root>
</configuration>
```

**파일**: `backend/src/main/java/com/example/backend/config/SentryConfig.java`

```java
package com.example.backend.config;

import io.sentry.Sentry;
import io.sentry.SentryEvent;
import io.sentry.SentryOptions;
import io.sentry.protocol.User;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class SentryConfig {

    @Value("${sentry.dsn}")
    private String sentryDsn;

    @Value("${sentry.environment}")
    private String environment;

    @PostConstruct
    public void init() {
        Sentry.init(options -> {
            options.setDsn(sentryDsn);
            options.setEnvironment(environment);
            options.setTracesSampleRate(0.1);

            // Before Send Hook - 사용자 정보 추가
            options.setBeforeSend((event, hint) -> {
                enrichEventWithUser(event);
                return event;
            });
        });
    }

    private void enrichEventWithUser(SentryEvent event) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            User user = new User();
            user.setUsername(auth.getName());
            event.setUser(user);
        }
    }
}
```

**수동 에러 캡처:**

```java
// PostService.java
import io.sentry.Sentry;
import io.sentry.SentryEvent;
import io.sentry.protocol.Message;

@Service
public class PostService {

    public PostResponse createPost(PostCreateRequest request) {
        try {
            // 비즈니스 로직...
            return response;
        } catch (Exception e) {
            // Sentry에 전송
            Sentry.captureException(e, scope -> {
                scope.setTag("service", "PostService");
                scope.setTag("action", "createPost");
                scope.setExtra("postTitle", request.getTitle());
                scope.setExtra("category", request.getCategory());
            });

            throw e;
        }
    }
}
```

#### Step 5: 환경 변수 설정

**파일**: `backend/.env` (추가)

```env
SENTRY_DSN=https://your-backend-sentry-dsn@sentry.io/project-id
ENVIRONMENT=production
```

#### Step 6: 테스트

**수동 테스트 - Frontend:**

```typescript
// app/test-sentry/page.tsx
'use client';

import * as Sentry from '@sentry/nextjs';

export default function TestSentryPage() {
  const testError = () => {
    throw new Error('Test Sentry Error from Frontend');
  };

  const testMessage = () => {
    Sentry.captureMessage('Test message from Frontend', 'info');
  };

  return (
    <div>
      <button onClick={testError}>Throw Error</button>
      <button onClick={testMessage}>Send Message</button>
    </div>
  );
}
```

**수동 테스트 - Backend:**

```java
// TestController.java
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/sentry-error")
    public ResponseEntity<String> testSentryError() {
        throw new RuntimeException("Test Sentry Error from Backend");
    }

    @GetMapping("/sentry-message")
    public ResponseEntity<String> testSentryMessage() {
        Sentry.captureMessage("Test message from Backend");
        return ResponseEntity.ok("Message sent to Sentry");
    }
}
```

### 실행 방법

```bash
# 1. Frontend Sentry 설정
cd frontend
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# 2. Backend Sentry 설정
# build.gradle에 의존성 추가
./gradlew build

# 3. 환경 변수 설정
# .env.local, .env 파일에 DSN 추가

# 4. 테스트
# /test-sentry 페이지 접속 후 버튼 클릭
# Sentry 대시보드에서 이벤트 확인
```

### 성공 기준

- ✅ Sentry 대시보드에서 에러 확인
- ✅ 사용자 정보 포함
- ✅ Source Map 업로드 (Frontend)
- ✅ 성능 모니터링 데이터 수집

---

## 🎯 Task 7: 접근성(A11y) 개선

**예상 시간**: 2일
**난이도**: 낮음
**효과**: ⭐⭐⭐

### 현재 상태

```
일부 aria-label 사용 (13개)
❌ 키보드 네비게이션 미흡
❌ 스크린 리더 지원 부족
❌ 색상 대비 검증 안 됨
```

### 목표

**WCAG 2.1 AA 수준 달성**

### 구현 계획

#### Step 1: 접근성 검사 도구 설치

```bash
cd frontend
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y
```

**파일**: `frontend/.eslintrc.json` (수정)

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

#### Step 2: 버튼 접근성 개선

**파일**: `frontend/src/shared/components/ui/button/Button.tsx` (수정)

```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label'?: string; // 명시적 타입
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={isLoading}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner aria-hidden="true" /> : children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
```

#### Step 3: 폼 접근성 개선

**파일**: `frontend/src/features/auth/components/LoginForm/LoginForm.tsx` (수정)

```typescript
<FormField>
  <Label htmlFor="email">
    이메일
    <Required aria-label="필수 항목">*</Required>
  </Label>
  <Input
    id="email"
    type="email"
    {...register('email')}
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <ErrorMessage id="email-error" role="alert">
      {errors.email.message}
    </ErrorMessage>
  )}
</FormField>

<FormField>
  <Label htmlFor="password">
    비밀번호
    <Required aria-label="필수 항목">*</Required>
  </Label>
  <Input
    id="password"
    type="password"
    {...register('password')}
    aria-required="true"
    aria-invalid={!!errors.password}
    aria-describedby={errors.password ? 'password-error' : undefined}
  />
  {errors.password && (
    <ErrorMessage id="password-error" role="alert">
      {errors.password.message}
    </ErrorMessage>
  )}
</FormField>
```

#### Step 4: 키보드 네비게이션

**파일**: `frontend/src/shared/components/layout/sidebar/Sidebar.tsx` (수정)

```typescript
import { useCallback, KeyboardEvent } from 'react';

const handleKeyDown = useCallback((e: KeyboardEvent, onClick: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
}, []);

<NavItem
  onClick={handleClick}
  onKeyDown={(e) => handleKeyDown(e, handleClick)}
  tabIndex={0}
  role="button"
  aria-label={`${item.label} 페이지로 이동`}
>
  <Icon aria-hidden="true" />
  <span>{item.label}</span>
</NavItem>
```

#### Step 5: 스크린 리더 지원

**파일**: `frontend/src/features/game/components/CharacterStatus.tsx` (수정)

```typescript
<StatusBar
  role="progressbar"
  aria-label="체력"
  aria-valuenow={hp}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuetext={`체력 ${hp}%`}
>
  <BarFill $percentage={hp} $type="hp" />
</StatusBar>

<StatusBar
  role="progressbar"
  aria-label="정신력"
  aria-valuenow={sp}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuetext={`정신력 ${sp}%`}
>
  <BarFill $percentage={sp} $type="sp" />
</StatusBar>

<VisuallyHidden>
  현재 캐릭터 상태: 체력 {hp}%, 정신력 {sp}%
  {hp < 30 && ' - 체력이 위험합니다'}
  {sp < 30 && ' - 정신력이 위험합니다'}
</VisuallyHidden>
```

**유틸리티 컴포넌트:**

```typescript
// shared/components/ui/VisuallyHidden.tsx
import styled from 'styled-components';

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;
```

#### Step 6: 색상 대비 검증

**색상 대비 체크:**
- 텍스트: 최소 4.5:1
- 큰 텍스트: 최소 3:1
- UI 요소: 최소 3:1

**파일**: `frontend/src/shared/styles/theme.ts` (검증)

```typescript
export const theme = {
  colors: {
    // 기존 색상 검증
    // WebAIM Contrast Checker 사용
    // https://webaim.org/resources/contrastchecker/

    text: {
      primary: '#1a1a1a',    // on #ffffff = 15.3:1 ✅
      secondary: '#4a4a4a',  // on #ffffff = 9.7:1 ✅
      tertiary: '#6a6a6a',   // on #ffffff = 6.4:1 ✅
    },

    // 대비 부족한 색상 조정
    error: '#d32f2f',        // 기존 #ff5252 → 대비 개선
    success: '#2e7d32',      // 기존 #4caf50 → 대비 개선
  },
};
```

### 실행 방법

```bash
# 1. ESLint 실행
npm run lint

# 2. 접근성 검사 (Lighthouse)
npm run build
npm start
# Chrome DevTools > Lighthouse > Accessibility

# 3. axe DevTools 확장 설치
# https://www.deque.com/axe/devtools/

# 4. 스크린 리더 테스트
# macOS: VoiceOver (Cmd + F5)
# Windows: NVDA

# 5. 키보드 네비게이션 테스트
# Tab, Shift+Tab, Enter, Space, Arrow keys
```

### 성공 기준

- ✅ Lighthouse Accessibility 점수 90+
- ✅ axe DevTools 0 critical issues
- ✅ 키보드만으로 전체 네비게이션 가능
- ✅ 스크린 리더로 모든 콘텐츠 접근 가능

---

## 🎯 Task 8: 개발자 문서 작성

**예상 시간**: 3일
**난이도**: 낮음
**효과**: ⭐⭐⭐

### 목표

**신규 개발자 온보딩 시간 단축 + 협업 효율 향상**

### 구현 계획

#### 문서 1: API 사용 가이드

**파일**: `/Users/solme36/projects/behindy/document/API_GUIDE.md`

**내용:**
- API 엔드포인트 목록
- 인증 방법
- 에러 코드 및 처리
- 요청/응답 예시
- Rate Limiting 정책

#### 문서 2: 상태 관리 가이드

**파일**: `/Users/solme36/projects/behindy/document/STATE_MANAGEMENT.md`

**내용:**
- Zustand 사용법
- React Query 패턴
- 전역 상태 vs 로컬 상태
- 캐싱 전략

#### 문서 3: 에러 처리 전략

**파일**: `/Users/solme36/projects/behindy/document/ERROR_HANDLING.md`

**내용:**
- 에러 바운더리 사용법
- API 에러 처리
- Sentry 연동
- 사용자 친화적 에러 메시지

#### 문서 4: 컴포넌트 개발 가이드

**파일**: `/Users/solme36/projects/behindy/document/COMPONENT_DEVELOPMENT.md`

**내용:**
- 디렉토리 구조
- 네이밍 컨벤션
- Props 타입 정의
- Storybook (향후)

#### 문서 5: 배포 가이드

**파일**: `/Users/solme36/projects/behindy/document/DEPLOYMENT_GUIDE.md`

**내용:**
- 로컬 개발 환경 설정
- Docker Compose 사용법
- CI/CD 파이프라인
- 프로덕션 배포 절차

---

## 📊 Phase 2 완료 기준

### 체크리스트

- [ ] **Task 5: Frontend 훅 테스트**
  - [ ] usePosts 테스트 (60개)
  - [ ] usePostForm 테스트 (30개)
  - [ ] usePostDetail 테스트 (30개)
  - [ ] useCharacterData 테스트 (30개)
  - [ ] useGameFlow 테스트 (30개)
  - [ ] useAuth 테스트 (30개)
  - [ ] 전체 테스트 통과
  - [ ] 커버리지 80% 이상

- [ ] **Task 6: Sentry 에러 추적**
  - [ ] Frontend Sentry 설정
  - [ ] Backend Sentry 설정
  - [ ] 에러 캡처 확인
  - [ ] Source Map 업로드
  - [ ] 대시보드 모니터링

- [ ] **Task 7: 접근성 개선**
  - [ ] ESLint jsx-a11y 플러그인
  - [ ] aria 속성 추가
  - [ ] 키보드 네비게이션
  - [ ] 색상 대비 개선
  - [ ] Lighthouse 90+ 점수

- [ ] **Task 8: 개발자 문서**
  - [ ] API_GUIDE.md
  - [ ] STATE_MANAGEMENT.md
  - [ ] ERROR_HANDLING.md
  - [ ] COMPONENT_DEVELOPMENT.md
  - [ ] DEPLOYMENT_GUIDE.md

### 성과 지표

**개선 전 (Phase 1 완료):**
- 테스트: 380개
- 모니터링: 없음
- 접근성: 미흡
- 문서: 기본만

**개선 후 (Phase 2 완료):**
- 테스트: 530+ 개 (40% 증가)
- 모니터링: Sentry ✅
- 접근성: WCAG AA ✅
- 문서: 완비 ✅

---

## 🎉 다음 단계

Phase 2 완료 후:
- [ ] Git 커밋 및 PR
- [ ] 코드 리뷰
- [ ] Phase 3 시작 (LLM Server CI/CD, DB 최적화 등)

---

**생성일**: 2025-10-26
**예상 완료**: 2025-11-17 (Phase 1 후 13일)
