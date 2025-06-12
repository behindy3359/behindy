package com.example.backend.service;

import com.example.backend.dto.comment.CommentCreateRequest;
import com.example.backend.dto.comment.CommentListResponse;
import com.example.backend.dto.comment.CommentResponse;
import com.example.backend.dto.comment.CommentUpdateRequest;
import com.example.backend.entity.Comment;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.security.user.CustomUserDetails;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final HtmlSanitizer htmlSanitizer;
    private final AuthService authService;

    /**
     * 댓글 생성
     */
    @Transactional
    public CommentResponse createComment(CommentCreateRequest request) {
        // 현재 로그인한 사용자 정보 가져오기
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

        // 댓글 저장
        Comment savedComment = commentRepository.save(comment);

        // 응답 DTO로 변환하여 반환
        return mapToCommentResponse(savedComment);
    }

    /**
     * 단일 댓글 조회
     */
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        return mapToCommentResponse(comment);
    }

    /**
     * 특정 게시글의 댓글 목록 조회 (페이지네이션)
     */
    @Transactional(readOnly = true)
    public CommentListResponse getCommentsByPost(Long postId, int page, int size) {
        // 게시글 존재 여부 확인
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // 페이지네이션 설정 (최신순 정렬)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 댓글 조회
        Page<Comment> commentsPage = commentRepository.findByPostIdAndNotDeleted(postId, pageable);

        // DTO 변환
        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(this::mapToCommentResponse)
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
        // 댓글 조회 및 삭제 여부 확인
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // 현재 사용자 정보 가져오기
        User currentUser = authService.getCurrentUser();

        // 댓글 작성자와 현재 사용자가 동일한지 확인
        if (!comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("댓글을 수정할 권한이 없습니다.");
        }

        // XSS 방지를 위한 입력값 필터링
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        // 댓글 내용 수정
        comment.setCmtContents(sanitizedContent);

        // 수정된 댓글 저장
        Comment updatedComment = commentRepository.save(comment);

        // 응답 DTO로 변환하여 반환
        return mapToCommentResponse(updatedComment);
    }

    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(Long commentId) {
        // 댓글 조회 및 삭제 여부 확인
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // 현재 사용자 정보 가져오기
        User currentUser = authService.getCurrentUser();

        // 댓글 작성자와 현재 사용자가 동일한지 확인
        if (!comment.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }

        // 댓글 소프트 삭제
        comment.delete();
        commentRepository.save(comment);
    }

    /**
     * 내가 작성한 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public CommentListResponse getMyComments(int page, int size) {
        // 현재 사용자 정보 가져오기
        User currentUser = authService.getCurrentUser();

        // 페이지네이션 설정 (최신순 정렬)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 내 댓글 조회
        Page<Comment> commentsPage = commentRepository.findByUserAndNotDeleted(currentUser, pageable);

        // DTO 변환
        List<CommentResponse> comments = commentsPage.getContent().stream()
                .map(this::mapToCommentResponse)
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
     * Comment 엔티티를 CommentResponse DTO로 변환
     */
    private CommentResponse mapToCommentResponse(Comment comment) {
        // 현재 로그인한 사용자 정보 가져오기 (권한 체크용)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = null;

        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            currentUserId = ((CustomUserDetails) auth.getPrincipal()).getId();
        }

        // 댓글 작성자와 현재 사용자가 동일한지 확인
        boolean isOwner = currentUserId != null &&
                currentUserId.equals(comment.getUser().getUserId());

        return CommentResponse.builder()
                .id(comment.getCmtId())
                .postId(comment.getPost().getPostId())
                .content(comment.getCmtContents())
                .authorName(comment.getUser().getUserName())
                .authorId(comment.getUser().getUserId())
                .isEditable(isOwner)    // 작성자만 수정 가능
                .isDeletable(isOwner)   // 작성자만 삭제 가능
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}