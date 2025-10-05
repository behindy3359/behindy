package com.example.backend.controller;

import com.example.backend.dto.comment.CommentCreateRequest;
import com.example.backend.dto.comment.CommentListResponse;
import com.example.backend.dto.comment.CommentResponse;
import com.example.backend.dto.comment.CommentUpdateRequest;
import com.example.backend.service.CommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Validated
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 작성
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CommentCreateRequest request) {
        log.info("========================================");
        log.info("💬 [API 요청 진입] POST /api/comments - postId: {}", request.getPostId());
        log.info("========================================");

        CommentResponse response = commentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 단일 댓글 조회
     */
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponse> getComment(
            @PathVariable Long commentId) {
        CommentResponse response = commentService.getCommentById(commentId);
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 게시글의 댓글 목록 조회 (페이지네이션 크기 제한 추가)
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<CommentListResponse> getCommentsByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {

        log.info("========================================");
        log.info("💬 [API 요청 진입] GET /api/comments/posts/{}?page={}&size={}", postId, page, size);
        log.info("========================================");

        CommentListResponse response = commentService.getCommentsByPost(postId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * 댓글 수정
     */
    @PutMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequest request) {

        CommentResponse response = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 댓글 삭제 (소프트 삭제)
     */
    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 내가 작성한 댓글 목록 조회
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentListResponse> getMyComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        CommentListResponse response = commentService.getMyComments(page, size);
        return ResponseEntity.ok(response);
    }
}