package com.example.backend.service;

import com.example.backend.dto.post.PostCreateRequest;
import com.example.backend.dto.post.PostListResponse;
import com.example.backend.dto.post.PostResponse;
import com.example.backend.dto.post.PostUpdateRequest;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.user.CustomUserDetails;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final HtmlSanitizer htmlSanitizer;

    /**
     * 게시글 생성
     */
    @Transactional
    public PostResponse createPost(PostCreateRequest request) {
        User currentUser = getCurrentUser();

        // HTML Sanitizing 처리
        String sanitizedTitle = htmlSanitizer.sanitize(request.getTitle());
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        Post post = Post.builder()
                .user(currentUser)
                .postTitle(sanitizedTitle)
                .postContents(sanitizedContent)
                .build();

        Post savedPost = postRepository.save(post);

        return mapToPostResponse(savedPost);
    }

    /**
     * 게시글 조회
     */
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())  // 삭제된 게시글 필터링
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        return mapToPostResponse(post);
    }

    /**
     * 현재 로그인한 사용자 정보 가져오기
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));
    }

    /**
     * Post 엔티티를 PostResponse DTO로 변환
     */
    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getPostId())
                .title(post.getPostTitle())
                .content(post.getPostContents())
                .authorName(post.getUser().getUserName())
                .authorId(post.getUser().getUserId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    /**
     * 게시글 목록 조회
     */
    @Transactional(readOnly = true)
    public PostListResponse getAllPosts(Pageable pageable) {
        Page<Post> postsPage = postRepository.findAllActive(pageable);

        List<PostResponse> posts = postsPage.getContent().stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());

        return PostListResponse.builder()
                .posts(posts)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(postsPage.getTotalElements())
                .totalPages(postsPage.getTotalPages())
                .build();
    }
    /**
     * 게시글 수정
     */
    @Transactional
    public PostResponse updatePost(Long postId, PostUpdateRequest request) {
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())  // 삭제된 게시글 필터링
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // 현재 인증된 사용자 정보 가져오기
        User currentUser = getCurrentUser();

        // 게시글 작성자와 현재 사용자가 동일한지 확인
        if (!post.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("게시글을 수정할 권한이 없습니다.");
        }

        // XSS 방지를 위한 입력값 필터링
        String sanitizedTitle = htmlSanitizer.sanitize(request.getTitle());
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        // 게시글 정보 업데이트 (필터링된 값 사용)
        post.setPostTitle(sanitizedTitle);
        post.setPostContents(sanitizedContent);

        // 수정된 게시글 저장
        Post updatedPost = postRepository.save(post);

        // 응답 DTO로 변환하여 반환
        return mapToPostResponse(updatedPost);
    }
    /**
     * 게시글 삭제
     */
    @Transactional
    public void deletePost(Long postId){
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())  // 삭제된 게시글 필터링
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // 현재 인증된 사용자 정보 가져오기
        User currentUser = getCurrentUser();

        // 게시글 작성자와 현재 사용자가 동일한지 확인
        if (!post.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("게시글을 삭제할 권한이 없습니다.");
        }

        // 게시글 삭제
        post.delete();
        postRepository.save(post);
    }
}
