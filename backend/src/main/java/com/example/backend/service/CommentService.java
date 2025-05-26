package com.example.backend.service;

import com.example.backend.dto.comment.CommentCreateRequest;
import com.example.backend.dto.comment.CommentResponse;
import com.example.backend.entity.Comment;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.security.user.CustomUserDetails;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // XSS 방지를 위한 입력값 필터링
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