package com.example.backend.service;

import com.example.backend.dto.comment.CommentCreateRequest;
import com.example.backend.dto.comment.CommentListResponse;
import com.example.backend.dto.comment.CommentResponse;
import com.example.backend.dto.comment.CommentUpdateRequest;
import com.example.backend.entity.Comment;
import com.example.backend.entity.CommentLike;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CommentLikeRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostRepository postRepository;
    private final HtmlSanitizer htmlSanitizer;
    private final AuthService authService;
    private final EntityDtoMapper entityDtoMapper; // 🎯 공통 Mapper 주입

    /**
     * 댓글 작성
     */
    @Transactional
    public CommentResponse createComment(CommentCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        // 게시글 존재 여부 및 삭제 여부 확인
        Post post = postRepository.findById(request.getPostId())
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", request.getPostId()));

        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        // 댓글 생성
        Comment comment = Comment.builder()
                .user(currentUser)
                .post(post)
                .cmtContents(sanitizedContent)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return entityDtoMapper.toCommentResponse(savedComment);
    }

    /**
     * 단일 댓글 조회
     */
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        return entityDtoMapper.toCommentResponse(comment);
    }

    /**
     * 특정 게시글의 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public CommentListResponse getCommentsByPost(Long postId, int page, int size) {
        // 게시글 존재 여부 확인
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentsPage = commentRepository.findByPostIdAndNotDeleted(postId, pageable);

        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(entityDtoMapper::toCommentResponse)
                .collect(Collectors.toList());

        return CommentListResponse.builder()
                .comments(comments)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(commentsPage.getTotalElements())
                .totalPages(commentsPage.getTotalPages())
                .hasNext(commentsPage.hasNext())
                .hasPrevious(commentsPage.hasPrevious())
                .build();
    }

    /**
     * 댓글 수정
     */
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User currentUser = authService.getCurrentUser();

        // 댓글 작성자와 현재 사용자가 동일한지 확인
        if (!comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("댓글을 수정할 권한이 없습니다.");
        }

        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());
        comment.setCmtContents(sanitizedContent);

        Comment updatedComment = commentRepository.save(comment);

        return entityDtoMapper.toCommentResponse(updatedComment);
    }

    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User currentUser = authService.getCurrentUser();

        if (!comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }

        comment.delete();
        commentRepository.save(comment);
    }

    /**
     * 내가 작성한 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public CommentListResponse getMyComments(int page, int size) {
        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentsPage = commentRepository.findByUserAndNotDeleted(currentUser, pageable);

        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(entityDtoMapper::toCommentResponse)
                .collect(Collectors.toList());

        return CommentListResponse.builder()
                .comments(comments)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(commentsPage.getTotalElements())
                .totalPages(commentsPage.getTotalPages())
                .hasNext(commentsPage.hasNext())
                .hasPrevious(commentsPage.hasPrevious())
                .build();
    }

    /**
     * 댓글 좋아요 토글
     * 이미 좋아요를 눌렀다면 취소, 누르지 않았다면 추가
     */
    @Transactional
    public CommentResponse toggleLike(Long commentId) {
        // 댓글 존재 여부 확인
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User currentUser = authService.getCurrentUser();

        // 기존 좋아요 확인
        var existingLike = commentLikeRepository.findByCommentAndUser(comment, currentUser);

        if (existingLike.isPresent()) {
            // 좋아요 취소
            commentLikeRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            CommentLike newLike = CommentLike.builder()
                    .comment(comment)
                    .user(currentUser)
                    .build();
            commentLikeRepository.save(newLike);
        }

        // 업데이트된 댓글 정보 반환
        return entityDtoMapper.toCommentResponse(comment);
    }
}