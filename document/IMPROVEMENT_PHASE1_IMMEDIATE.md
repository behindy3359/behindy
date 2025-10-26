# Phase 1: 즉시 실행 개선 계획 (1주일)

> **목표**: 포트폴리오 경쟁력 향상을 위한 핵심 개선
> **기간**: 1주일 (8일)
> **우선순위**: 🔴 최우선

---

## 📋 개요

취업 포트폴리오로서 **신뢰성과 보안성**을 입증하기 위한 필수 개선 작업입니다.

**주요 목표:**
1. ✅ Backend API 테스트 커버리지 200+ 테스트 추가
2. ✅ Rate Limiting으로 보안 강화
3. ✅ 에러 바운더리로 사용자 경험 개선
4. ✅ CSRF 토큰으로 보안 취약점 제거

---

## 🎯 Task 1: Backend 컨트롤러 테스트 작성

**예상 시간**: 3일
**난이도**: 높음
**효과**: ⭐⭐⭐⭐⭐

### 현재 상태

```
테스트 파일: 4개
- HtmlSanitizerTest.java
- GameServiceTest.java
- CharacterServiceTest.java
- BackendApplicationTests.java

테스트되지 않은 컨트롤러:
❌ PostController.java (게시글 CRUD)
❌ CharacterController.java (캐릭터 관리)
❌ GameController.java (게임 플레이)
❌ AuthController.java (인증)
❌ CommentController.java (댓글)
```

### 목표

**200+ 테스트 추가**로 컨트롤러 레이어 완전 커버

### 구현 계획

#### Day 1: PostController 테스트 (80개 테스트)

**파일**: `backend/src/test/java/com/example/backend/controller/PostControllerTest.java`

```java
package com.example.backend.controller;

import com.example.backend.dto.post.*;
import com.example.backend.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
@DisplayName("PostController 테스트")
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostService postService;

    // ========================================
    // 1. 게시글 생성 테스트 (20개)
    // ========================================

    @Test
    @WithMockUser
    @DisplayName("성공: 정상적인 게시글 생성")
    void createPost_Success() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .title("테스트 제목")
            .content("테스트 내용")
            .category("GENERAL")
            .build();

        PostResponse response = PostResponse.builder()
            .postId(1L)
            .title("테스트 제목")
            .content("테스트 내용")
            .build();

        given(postService.createPost(any())).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.postId").value(1))
            .andExpect(jsonPath("$.title").value("테스트 제목"));
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 제목 없음 (400 Bad Request)")
    void createPost_NoTitle_BadRequest() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .content("테스트 내용")
            .category("GENERAL")
            .build();

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 제목이 너무 짧음 (1자 미만)")
    void createPost_TitleTooShort() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .title("")
            .content("테스트 내용")
            .category("GENERAL")
            .build();

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 제목이 너무 김 (100자 초과)")
    void createPost_TitleTooLong() throws Exception {
        // Given
        String longTitle = "a".repeat(101);
        PostCreateRequest request = PostCreateRequest.builder()
            .title(longTitle)
            .content("테스트 내용")
            .category("GENERAL")
            .build();

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 내용 없음 (400 Bad Request)")
    void createPost_NoContent_BadRequest() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .title("테스트 제목")
            .category("GENERAL")
            .build();

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("실패: XSS 스크립트 포함 (정상 처리 후 sanitize)")
    void createPost_WithXSS_Sanitized() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .title("<script>alert('XSS')</script>제목")
            .content("<img src=x onerror='alert(1)'>내용")
            .category("GENERAL")
            .build();

        PostResponse response = PostResponse.builder()
            .postId(1L)
            .title("제목") // Sanitized
            .content("내용") // Sanitized
            .build();

        given(postService.createPost(any())).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("제목"))
            .andExpect(jsonPath("$.content").value("내용"));
    }

    @Test
    @DisplayName("실패: 인증 없음 (401 Unauthorized)")
    void createPost_NoAuth_Unauthorized() throws Exception {
        // Given
        PostCreateRequest request = PostCreateRequest.builder()
            .title("테스트 제목")
            .content("테스트 내용")
            .category("GENERAL")
            .build();

        // When & Then
        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    // ... 추가 13개 테스트:
    // - 카테고리 유효성 검증
    // - 특수문자 처리
    // - 이모지 포함 게시글
    // - 여러 줄 내용 처리
    // - 공백 문자 처리
    // - SQL Injection 시도 차단
    // - 최대 길이 경계값 테스트
    // - Content-Type 잘못된 경우
    // - JSON 형식 오류
    // - 태그 포함 게시글
    // 등등...

    // ========================================
    // 2. 게시글 조회 테스트 (20개)
    // ========================================

    @Test
    @DisplayName("성공: 게시글 목록 조회 (페이징)")
    void getAllPosts_Success() throws Exception {
        // Given
        PostListResponse response = PostListResponse.builder()
            .posts(List.of(
                PostSummary.builder().postId(1L).title("게시글 1").build(),
                PostSummary.builder().postId(2L).title("게시글 2").build()
            ))
            .totalElements(2L)
            .totalPages(1)
            .build();

        given(postService.getAllPosts(any())).willReturn(response);

        // When & Then
        mockMvc.perform(get("/api/posts")
                .param("page", "0")
                .param("size", "20"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.posts.length()").value(2))
            .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @DisplayName("성공: 단일 게시글 상세 조회")
    void getPostById_Success() throws Exception {
        // Given
        Long postId = 1L;
        PostDetailResponse response = PostDetailResponse.builder()
            .postId(postId)
            .title("테스트 게시글")
            .content("테스트 내용")
            .authorName("작성자")
            .viewCount(10)
            .build();

        given(postService.getPostById(postId)).willReturn(response);

        // When & Then
        mockMvc.perform(get("/api/posts/{id}", postId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.postId").value(postId))
            .andExpect(jsonPath("$.title").value("테스트 게시글"))
            .andExpect(jsonPath("$.viewCount").value(10));
    }

    @Test
    @DisplayName("실패: 존재하지 않는 게시글 조회 (404)")
    void getPostById_NotFound() throws Exception {
        // Given
        Long postId = 999L;
        given(postService.getPostById(postId))
            .willThrow(new ResourceNotFoundException("게시글을 찾을 수 없습니다"));

        // When & Then
        mockMvc.perform(get("/api/posts/{id}", postId))
            .andExpect(status().isNotFound());
    }

    // ... 추가 17개 테스트

    // ========================================
    // 3. 게시글 수정 테스트 (20개)
    // ========================================

    @Test
    @WithMockUser
    @DisplayName("성공: 자신의 게시글 수정")
    void updatePost_Success() throws Exception {
        // Given
        Long postId = 1L;
        PostUpdateRequest request = PostUpdateRequest.builder()
            .title("수정된 제목")
            .content("수정된 내용")
            .build();

        PostResponse response = PostResponse.builder()
            .postId(postId)
            .title("수정된 제목")
            .content("수정된 내용")
            .build();

        given(postService.updatePost(eq(postId), any())).willReturn(response);

        // When & Then
        mockMvc.perform(put("/api/posts/{id}", postId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("수정된 제목"));
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 다른 사용자의 게시글 수정 시도 (403)")
    void updatePost_Forbidden() throws Exception {
        // Given
        Long postId = 1L;
        PostUpdateRequest request = PostUpdateRequest.builder()
            .title("수정된 제목")
            .content("수정된 내용")
            .build();

        given(postService.updatePost(eq(postId), any()))
            .willThrow(new ForbiddenException("권한이 없습니다"));

        // When & Then
        mockMvc.perform(put("/api/posts/{id}", postId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }

    // ... 추가 18개 테스트

    // ========================================
    // 4. 게시글 삭제 테스트 (20개)
    // ========================================

    @Test
    @WithMockUser
    @DisplayName("성공: 자신의 게시글 삭제")
    void deletePost_Success() throws Exception {
        // Given
        Long postId = 1L;

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", postId)
                .with(csrf()))
            .andExpect(status().isNoContent());

        verify(postService).deletePost(postId);
    }

    @Test
    @WithMockUser
    @DisplayName("실패: 다른 사용자의 게시글 삭제 시도 (403)")
    void deletePost_Forbidden() throws Exception {
        // Given
        Long postId = 1L;
        doThrow(new ForbiddenException("권한이 없습니다"))
            .when(postService).deletePost(postId);

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", postId)
                .with(csrf()))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("실패: 인증 없이 삭제 시도 (401)")
    void deletePost_Unauthorized() throws Exception {
        // Given
        Long postId = 1L;

        // When & Then
        mockMvc.perform(delete("/api/posts/{id}", postId)
                .with(csrf()))
            .andExpect(status().isUnauthorized());
    }

    // ... 추가 17개 테스트
}
```

**테스트 시나리오 체크리스트:**

- [ ] 생성 (20개)
  - [ ] 정상 생성
  - [ ] 필수 필드 누락
  - [ ] 길이 제한 검증
  - [ ] XSS 방어
  - [ ] SQL Injection 방어
  - [ ] 특수문자 처리
  - [ ] 인증 검증
  - [ ] 카테고리 유효성
  - [ ] 경계값 테스트
  - [ ] Content-Type 검증
  - [ ] 등등...

- [ ] 조회 (20개)
  - [ ] 목록 조회 (페이징)
  - [ ] 정렬 기능
  - [ ] 필터링 (카테고리별)
  - [ ] 검색 기능
  - [ ] 단일 조회
  - [ ] 존재하지 않는 게시글
  - [ ] 조회수 증가
  - [ ] 등등...

- [ ] 수정 (20개)
  - [ ] 정상 수정
  - [ ] 권한 검증
  - [ ] 존재하지 않는 게시글
  - [ ] 필드별 수정
  - [ ] 부분 수정
  - [ ] 등등...

- [ ] 삭제 (20개)
  - [ ] 정상 삭제
  - [ ] 권한 검증
  - [ ] Soft Delete 확인
  - [ ] 관련 데이터 처리
  - [ ] 등등...

---

#### Day 2: AuthController, GameController 테스트 (80개)

**파일 1**: `backend/src/test/java/com/example/backend/controller/AuthControllerTest.java` (40개)

**주요 시나리오:**
- 회원가입 (성공, 중복 이메일, 유효성 검증, 비밀번호 강도)
- 로그인 (성공, 실패, 비밀번호 틀림, 계정 없음)
- 로그아웃
- 토큰 갱신 (성공, 만료, 유효하지 않은 토큰)
- 비밀번호 재설정

**파일 2**: `backend/src/test/java/com/example/backend/controller/GameControllerTest.java` (40개)

**주요 시나리오:**
- 게임 시작 (역/호선별)
- 게임 상태 조회
- 선택지 선택
- 게임 재개
- 게임 포기
- 게임 오버 처리

---

#### Day 3: CharacterController, CommentController 테스트 (40개)

**파일 1**: `backend/src/test/java/com/example/backend/controller/CharacterControllerTest.java` (20개)

**주요 시나리오:**
- 캐릭터 생성
- 캐릭터 조회
- 캐릭터 삭제
- 히스토리 조회
- 스탯 업데이트

**파일 2**: `backend/src/test/java/com/example/backend/controller/CommentControllerTest.java` (20개)

**주요 시나리오:**
- 댓글 작성
- 댓글 조회
- 댓글 수정
- 댓글 삭제
- 대댓글 처리

---

### 실행 방법

```bash
# 1. 테스트 파일 생성
cd /Users/solme36/projects/behindy/backend/src/test/java/com/example/backend/controller/

# 2. 각 테스트 작성

# 3. 테스트 실행
./gradlew test --tests "PostControllerTest"
./gradlew test --tests "AuthControllerTest"
./gradlew test --tests "GameControllerTest"
./gradlew test --tests "CharacterControllerTest"
./gradlew test --tests "CommentControllerTest"

# 4. 전체 테스트 실행
./gradlew test

# 5. 커버리지 확인
./gradlew jacocoTestReport
open build/reports/jacoco/test/html/index.html
```

### 성공 기준

- ✅ 컨트롤러 테스트 200+ 개 작성
- ✅ 모든 테스트 통과
- ✅ 커버리지 70% 이상
- ✅ CI/CD에서 자동 실행

---

## 🎯 Task 2: Rate Limiting 구현

**예상 시간**: 2일
**난이도**: 중간
**효과**: ⭐⭐⭐⭐

### 현재 상태

```
❌ Backend Rate Limiting 없음
✅ LLM Server Rate Limiting 구현됨 (100req/hour)

위험:
- 무한 회원가입 시도 가능
- 무한 로그인 시도 가능 (Brute Force 공격)
- API Abuse 가능
```

### 목표

**Spring Boot에 Redis 기반 Rate Limiting 구현**

### 구현 계획

#### Step 1: 의존성 추가

**파일**: `backend/build.gradle`

```gradle
dependencies {
    // 기존...

    // Rate Limiting
    implementation 'com.github.vladimir-bukhtoyarov:bucket4j-core:7.6.0'
    implementation 'com.github.vladimir-bukhtoyarov:bucket4j-redis:7.6.0'
}
```

#### Step 2: Rate Limiter 설정

**파일**: `backend/src/main/java/com/example/backend/config/RateLimitConfig.java`

```java
package com.example.backend.config;

import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class RateLimitConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public ProxyManager<String> proxyManager() {
        RedisClient redisClient = RedisClient.create(
            String.format("redis://%s:%d", redisHost, redisPort)
        );
        StatefulRedisConnection<String, byte[]> connection =
            redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));

        return LettuceBasedProxyManager.builderFor(connection)
            .withExpirationStrategy(
                ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofHours(1))
            )
            .build();
    }
}
```

#### Step 3: Rate Limit Annotation

**파일**: `backend/src/main/java/com/example/backend/annotation/RateLimit.java`

```java
package com.example.backend.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    /**
     * 시간 창 내 허용되는 최대 요청 수
     */
    int limit() default 10;

    /**
     * 시간 창 (초)
     */
    int window() default 60;

    /**
     * Rate Limit 키 생성 전략
     * - IP: IP 주소 기반
     * - USER: 사용자 ID 기반
     * - IP_AND_USER: IP + 사용자 ID 조합
     */
    KeyType keyType() default KeyType.IP;

    enum KeyType {
        IP, USER, IP_AND_USER
    }
}
```

#### Step 4: Rate Limit Interceptor

**파일**: `backend/src/main/java/com/example/backend/interceptor/RateLimitInterceptor.java`

```java
package com.example.backend.interceptor;

import com.example.backend.annotation.RateLimit;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final ProxyManager<String> proxyManager;

    @Override
    public boolean preHandle(HttpServletRequest request,
                            HttpServletResponse response,
                            Object handler) throws Exception {

        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RateLimit rateLimit = handlerMethod.getMethodAnnotation(RateLimit.class);

        if (rateLimit == null) {
            return true; // Rate Limit 없음
        }

        String key = generateKey(request, rateLimit.keyType());
        Bucket bucket = resolveBucket(key, rateLimit);

        if (bucket.tryConsume(1)) {
            return true; // 요청 허용
        } else {
            // Rate Limit 초과
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Too many requests. Please try again later.\"}"
            );
            log.warn("Rate limit exceeded for key: {}", key);
            return false;
        }
    }

    private String generateKey(HttpServletRequest request, RateLimit.KeyType keyType) {
        String ip = getClientIP(request);
        String userId = getUserId();

        return switch (keyType) {
            case IP -> "rate_limit:ip:" + ip;
            case USER -> "rate_limit:user:" + (userId != null ? userId : "anonymous");
            case IP_AND_USER -> "rate_limit:ip_user:" + ip + ":" +
                               (userId != null ? userId : "anonymous");
        };
    }

    private Bucket resolveBucket(String key, RateLimit rateLimit) {
        BucketConfiguration config = BucketConfiguration.builder()
            .addLimit(Bandwidth.classic(
                rateLimit.limit(),
                Refill.intervally(rateLimit.limit(), Duration.ofSeconds(rateLimit.window()))
            ))
            .build();

        return proxyManager.builder().build(key, config);
    }

    private String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private String getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return null;
    }
}
```

#### Step 5: WebMvcConfigurer 설정

**파일**: `backend/src/main/java/com/example/backend/config/WebConfig.java`

```java
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitInterceptor)
            .addPathPatterns("/api/**");
    }

    // 기존 CORS 설정...
}
```

#### Step 6: 컨트롤러에 적용

**파일**: `backend/src/main/java/com/example/backend/controller/AuthController.java`

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // 회원가입: IP당 5회/시간
    @PostMapping("/signup")
    @RateLimit(limit = 5, window = 3600, keyType = RateLimit.KeyType.IP)
    public ResponseEntity<ApiResponse> registerUser(
        @Valid @RequestBody SignupRequest signupRequest) {
        // ...
    }

    // 로그인: IP당 10회/분
    @PostMapping("/login")
    @RateLimit(limit = 10, window = 60, keyType = RateLimit.KeyType.IP)
    public ResponseEntity<AuthResponse> authenticateUser(
        @Valid @RequestBody LoginRequest loginRequest) {
        // ...
    }

    // 토큰 갱신: 사용자당 30회/분
    @PostMapping("/token/refresh")
    @RateLimit(limit = 30, window = 60, keyType = RateLimit.KeyType.USER)
    public ResponseEntity<AuthResponse> refreshToken(
        @CookieValue("refreshToken") String refreshToken) {
        // ...
    }
}
```

**파일**: `backend/src/main/java/com/example/backend/controller/PostController.java`

```java
@RestController
@RequestMapping("/api/posts")
public class PostController {

    // 게시글 작성: 사용자당 5회/분
    @PostMapping
    @RateLimit(limit = 5, window = 60, keyType = RateLimit.KeyType.USER)
    public ResponseEntity<PostResponse> createPost(
        @Valid @RequestBody PostCreateRequest request) {
        // ...
    }

    // 게시글 조회: IP당 100회/분
    @GetMapping
    @RateLimit(limit = 100, window = 60, keyType = RateLimit.KeyType.IP)
    public ResponseEntity<PostListResponse> getAllPosts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
        // ...
    }
}
```

#### Step 7: 테스트 작성

**파일**: `backend/src/test/java/com/example/backend/interceptor/RateLimitInterceptorTest.java`

```java
@SpringBootTest
@AutoConfigureMockMvc
class RateLimitInterceptorTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Rate Limit 초과 시 429 반환")
    void rateLimitExceeded_Returns429() throws Exception {
        // Given: 로그인 Rate Limit = 10회/분
        String loginRequest = """
            {
                "email": "test@example.com",
                "password": "password123"
            }
            """;

        // When: 11번 요청
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginRequest))
                .andExpect(status().isOk()); // 또는 401
        }

        // Then: 11번째 요청은 429
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
            .andExpect(status().isTooManyRequests())
            .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @DisplayName("다른 IP는 별도 Rate Limit 적용")
    void differentIP_SeparateRateLimit() throws Exception {
        // Given
        String request = """
            {
                "email": "test@example.com",
                "password": "password123"
            }
            """;

        // When: IP1에서 10번 요청
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(post("/api/auth/login")
                    .with(request -> {
                        request.setRemoteAddr("192.168.1.1");
                        return request;
                    })
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(request))
                .andExpect(status().isOk());
        }

        // Then: IP2에서는 여전히 가능
        mockMvc.perform(post("/api/auth/login")
                .with(request -> {
                    request.setRemoteAddr("192.168.1.2");
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isOk());
    }
}
```

### 적용 범위

| 엔드포인트 | Limit | Window | KeyType | 이유 |
|-----------|-------|--------|---------|------|
| POST /api/auth/signup | 5 | 1시간 | IP | 계정 생성 남용 방지 |
| POST /api/auth/login | 10 | 1분 | IP | Brute Force 공격 방지 |
| POST /api/auth/token/refresh | 30 | 1분 | USER | 토큰 갱신 남용 방지 |
| POST /api/posts | 5 | 1분 | USER | 스팸 게시글 방지 |
| POST /api/comments | 10 | 1분 | USER | 스팸 댓글 방지 |
| GET /api/posts | 100 | 1분 | IP | API Abuse 방지 |
| POST /api/game/choice | 20 | 1분 | USER | 게임 조작 방지 |

### 실행 방법

```bash
# 1. Redis 실행 확인
docker ps | grep redis

# 2. 의존성 추가 후 빌드
./gradlew clean build

# 3. 테스트 실행
./gradlew test --tests "RateLimitInterceptorTest"

# 4. 수동 테스트
# 로그인 API를 11번 호출하여 429 확인
for i in {1..11}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  echo "Request $i"
done
```

### 성공 기준

- ✅ Rate Limit 초과 시 429 응답
- ✅ IP별/사용자별 독립적 제한
- ✅ Redis에 키 저장 확인
- ✅ 테스트 통과

---

## 🎯 Task 3: 에러 바운더리 추가

**예상 시간**: 1일
**난이도**: 낮음
**효과**: ⭐⭐⭐

### 현재 상태

```
❌ error.tsx 파일 없음
❌ 전역 에러 처리 없음
❌ 런타임 에러 시 빈 화면
```

### 목표

**Next.js 에러 바운더리로 사용자 친화적 에러 처리**

### 구현 계획

#### Step 1: 루트 에러 바운더리

**파일**: `frontend/src/app/error.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // 에러 로깅 (추후 Sentry로 전송)
    console.error('Application Error:', error);
  }, [error]);

  return (
    <ErrorContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorIcon>
        <AlertCircle size={64} />
      </ErrorIcon>

      <ErrorTitle>문제가 발생했습니다</ErrorTitle>

      <ErrorMessage>
        {process.env.NODE_ENV === 'development'
          ? error.message
          : '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
      </ErrorMessage>

      {error.digest && (
        <ErrorDigest>오류 ID: {error.digest}</ErrorDigest>
      )}

      <ButtonGroup>
        <ErrorButton
          onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} />
          다시 시도
        </ErrorButton>

        <ErrorButton
          $secondary
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
          홈으로 이동
        </ErrorButton>
      </ButtonGroup>

      {process.env.NODE_ENV === 'development' && (
        <ErrorStack>
          <details>
            <summary>에러 스택 (개발 모드)</summary>
            <pre>{error.stack}</pre>
          </details>
        </ErrorStack>
      )}
    </ErrorContainer>
  );
}

const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin-bottom: 1rem;
`;

const ErrorDigest = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 2rem;
  font-family: monospace;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ErrorButton = styled(motion.button)<{ $secondary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme, $secondary }) =>
    $secondary ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme, $secondary }) =>
    $secondary ? theme.colors.text.primary : '#fff'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorStack = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: left;

  details {
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: 1rem;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  pre {
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.error};
  }
`;
```

#### Step 2: 글로벌 에러 (Not Found)

**파일**: `frontend/src/app/not-found.tsx`

```typescript
'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <NotFoundContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NotFoundCode
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        404
      </NotFoundCode>

      <NotFoundTitle>페이지를 찾을 수 없습니다</NotFoundTitle>

      <NotFoundMessage>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </NotFoundMessage>

      <ButtonGroup>
        <NotFoundButton
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={20} />
          이전 페이지
        </NotFoundButton>

        <NotFoundButton
          $primary
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
          홈으로 이동
        </NotFoundButton>
      </ButtonGroup>
    </NotFoundContainer>
  );
}

const NotFoundContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const NotFoundCode = styled(motion.div)`
  font-size: 8rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const NotFoundTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NotFoundMessage = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const NotFoundButton = styled(motion.button)<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: ${({ theme, $primary }) =>
    $primary ? 'none' : `2px solid ${theme.colors.border}`};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $primary }) =>
    $primary ? '#fff' : theme.colors.text.primary};

  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.primaryDark : theme.colors.surface};
  }
`;
```

#### Step 3: 라우트별 에러 바운더리

**파일**: `frontend/src/app/community/error.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CommunityErrorProps {
  error: Error;
  reset: () => void;
}

export default function CommunityError({ error, reset }: CommunityErrorProps) {
  useEffect(() => {
    console.error('Community Error:', error);
  }, [error]);

  return (
    <ErrorContainer>
      <AlertCircle size={48} />
      <ErrorTitle>커뮤니티를 불러올 수 없습니다</ErrorTitle>
      <ErrorMessage>
        게시글을 불러오는 중 문제가 발생했습니다.
      </ErrorMessage>
      <RetryButton onClick={reset}>
        <RefreshCw size={20} />
        다시 시도
      </RetryButton>
    </ErrorContainer>
  );
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;
```

**파일**: `frontend/src/app/game/error.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { GamepadIcon, Home } from 'lucide-react';

interface GameErrorProps {
  error: Error;
  reset: () => void;
}

export default function GameError({ error, reset }: GameErrorProps) {
  const router = useRouter();

  return (
    <ErrorContainer>
      <GamepadIcon size={48} />
      <ErrorTitle>게임을 시작할 수 없습니다</ErrorTitle>
      <ErrorMessage>
        {error.message.includes('character')
          ? '캐릭터를 먼저 생성해주세요.'
          : '게임을 불러오는 중 문제가 발생했습니다.'}
      </ErrorMessage>
      <ButtonGroup>
        <Button onClick={reset}>다시 시도</Button>
        <Button $primary onClick={() => router.push('/character/create')}>
          <Home size={20} />
          캐릭터 생성
        </Button>
      </ButtonGroup>
    </ErrorContainer>
  );
}

// Styled components...
```

### 실행 방법

```bash
# 1. 파일 생성
touch frontend/src/app/error.tsx
touch frontend/src/app/not-found.tsx
touch frontend/src/app/community/error.tsx
touch frontend/src/app/game/error.tsx

# 2. 에러 테스트
# 개발 서버에서 의도적으로 에러 발생시키기

# 3. 빌드 확인
npm run build

# 4. 프로덕션 모드에서 확인
npm start
```

### 성공 기준

- ✅ 런타임 에러 시 에러 바운더리 표시
- ✅ 404 페이지 정상 동작
- ✅ 다시 시도 버튼 동작
- ✅ 개발/프로덕션 모드별 다른 메시지

---

## 🎯 Task 4: CSRF 토큰 구현

**예상 시간**: 2일
**난이도**: 중간
**효과**: ⭐⭐⭐⭐

### 현재 상태

```
❌ CSRF 보호 없음
✅ CORS 설정만 있음
✅ HttpOnly Cookie 사용 중

위험:
- CSRF 공격에 취약
- 악의적인 사이트에서 사용자 권한으로 요청 가능
```

### 목표

**Spring Security CSRF 토큰 + Frontend 연동**

### 구현 계획

#### Step 1: Spring Security CSRF 활성화

**파일**: `backend/src/main/java/com/example/backend/config/SecurityConfig.java`

```java
package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF 토큰 핸들러
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/api/auth/login",  // 로그인은 CSRF 체크 제외
                    "/api/auth/signup", // 회원가입은 CSRF 체크 제외
                    "/actuator/**"      // Actuator는 CSRF 체크 제외
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/posts").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
```

#### Step 2: CSRF 토큰 엔드포인트

**파일**: `backend/src/main/java/com/example/backend/controller/CsrfController.java`

```java
package com.example.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/csrf")
public class CsrfController {

    @GetMapping("/token")
    public CsrfTokenResponse getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

        return new CsrfTokenResponse(
            csrfToken.getToken(),
            csrfToken.getHeaderName()
        );
    }

    public record CsrfTokenResponse(String token, String headerName) {}
}
```

#### Step 3: Frontend Axios 설정

**파일**: `frontend/src/config/axiosConfig.ts`

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// CSRF 토큰 가져오기
async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/csrf/token`, {
      withCredentials: true,
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
}

// CSRF 토큰 저장
let csrfToken: string | null = null;

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - CSRF 토큰 추가
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // GET 요청은 CSRF 토큰 불필요
    if (config.method === 'get') {
      return config;
    }

    // CSRF 토큰이 없으면 가져오기
    if (!csrfToken) {
      csrfToken = await fetchCsrfToken();
    }

    // CSRF 토큰을 헤더에 추가
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - CSRF 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 Forbidden (CSRF 토큰 오류)
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // CSRF 토큰 재발급
      csrfToken = await fetchCsrfToken();

      if (csrfToken) {
        originalRequest.headers['X-XSRF-TOKEN'] = csrfToken;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### Step 4: 앱 초기화 시 CSRF 토큰 가져오기

**파일**: `frontend/src/app/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import api from '@/config/axiosConfig';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 앱 시작 시 CSRF 토큰 미리 가져오기
    const initCsrf = async () => {
      try {
        await api.get('/csrf/token');
        console.log('CSRF token initialized');
      } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
      }
    };

    initCsrf();
  }, []);

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

#### Step 5: 테스트 작성

**파일**: `backend/src/test/java/com/example/backend/security/CsrfProtectionTest.java`

```java
@SpringBootTest
@AutoConfigureMockMvc
class CsrfProtectionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("CSRF 토큰 없이 POST 요청 시 403 Forbidden")
    void postWithoutCsrfToken_Returns403() throws Exception {
        String request = """
            {
                "title": "테스트",
                "content": "내용"
            }
            """;

        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    @DisplayName("CSRF 토큰과 함께 POST 요청 시 정상 처리")
    void postWithCsrfToken_Success() throws Exception {
        String request = """
            {
                "title": "테스트",
                "content": "내용"
            }
            """;

        mockMvc.perform(post("/api/posts")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("CSRF 토큰 엔드포인트 정상 동작")
    void getCsrfToken_ReturnsToken() throws Exception {
        mockMvc.perform(get("/api/csrf/token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"));
    }
}
```

### 실행 방법

```bash
# 1. Backend 테스트
cd backend
./gradlew test --tests "CsrfProtectionTest"

# 2. Frontend에서 POST 요청 테스트
# 개발자 도구에서 X-XSRF-TOKEN 헤더 확인

# 3. 수동 테스트
# CSRF 토큰 없이 요청 → 403
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"test","content":"test"}'

# CSRF 토큰과 함께 요청 → 201
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: <token>" \
  -b "XSRF-TOKEN=<token>" \
  -d '{"title":"test","content":"test"}'
```

### 성공 기준

- ✅ CSRF 토큰 없는 POST/PUT/DELETE 요청 차단
- ✅ CSRF 토큰 발급 엔드포인트 동작
- ✅ Frontend에서 자동으로 토큰 포함
- ✅ 테스트 통과

---

## 📊 Phase 1 완료 기준

### 체크리스트

- [ ] **Task 1: Backend 컨트롤러 테스트 작성**
  - [ ] PostControllerTest (80개)
  - [ ] AuthControllerTest (40개)
  - [ ] GameControllerTest (40개)
  - [ ] CharacterControllerTest (20개)
  - [ ] CommentControllerTest (20개)
  - [ ] 전체 테스트 통과
  - [ ] 커버리지 70% 이상

- [ ] **Task 2: Rate Limiting 구현**
  - [ ] bucket4j 의존성 추가
  - [ ] RateLimitInterceptor 구현
  - [ ] AuthController에 적용
  - [ ] PostController에 적용
  - [ ] 테스트 작성 및 통과

- [ ] **Task 3: 에러 바운더리 추가**
  - [ ] app/error.tsx 생성
  - [ ] app/not-found.tsx 생성
  - [ ] app/community/error.tsx 생성
  - [ ] app/game/error.tsx 생성
  - [ ] 에러 발생 시 정상 표시

- [ ] **Task 4: CSRF 토큰 구현**
  - [ ] Spring Security CSRF 활성화
  - [ ] CsrfController 구현
  - [ ] Frontend axios 설정
  - [ ] 테스트 작성 및 통과

### 성과 지표

**개선 전:**
- 테스트: 180개
- 보안: Rate Limiting 없음, CSRF 없음
- UX: 에러 처리 미흡

**개선 후:**
- 테스트: 380+ 개 (110% 증가)
- 보안: Rate Limiting ✅, CSRF ✅
- UX: 에러 바운더리 ✅

---

## 🎉 다음 단계

Phase 1 완료 후:
- [ ] Git 커밋 및 PR 생성
- [ ] 코드 리뷰
- [ ] Phase 2 시작 (Frontend 훅 테스트, Sentry 등)

---

**생성일**: 2025-10-26
**예상 완료**: 2025-11-03 (8일)
