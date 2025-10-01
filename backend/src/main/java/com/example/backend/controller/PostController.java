package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.post.PostCreateRequest;
import com.example.backend.dto.post.PostListResponse;
import com.example.backend.dto.post.PostResponse;
import com.example.backend.dto.post.PostUpdateRequest;
import com.example.backend.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
public class PostController {

    private final PostService postService;

    /**
     * 게시글 생성
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostCreateRequest request) {

        // 🔥 임시 디버깅 로그
        log.info("📝 게시글 작성 요청 수신: {}", request.getTitle());

        try {
            // 현재 인증된 사용자 확인
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.info("👤 현재 인증 사용자: {}", auth != null ? auth.getName() : "null");
            log.info("🔐 인증 여부: {}", auth != null && auth.isAuthenticated());

            PostResponse response = postService.createPost(request);

            log.info("✅ 게시글 작성 성공: ID={}", response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("❌ 게시글 작성 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 게시글 조회
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(
            @PathVariable Long postId) {
        PostResponse response = postService.getPostById(postId);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 목록 조회 (페이지네이션 크기 제한 추가)
     */
    @GetMapping
    public ResponseEntity<PostListResponse> getAllPosts(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        PostListResponse response = postService.getAllPosts(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 수정
     */
    @PutMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody PostUpdateRequest request) {

        PostResponse response = postService.updatePost(postId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 삭제
     */
    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> deletePost(
            @PathVariable Long postId) {
        postService.deletePost(postId);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("게시글이 삭제되었습니다.")
                .build());
    }
}