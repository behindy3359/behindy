package com.example.backend.service;

import com.example.backend.dto.post.PostCreateRequest;
import com.example.backend.dto.post.PostListResponse;
import com.example.backend.dto.post.PostResponse;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    /**
     * 게시글 생성
     */
    @Transactional
    public PostResponse createPost(PostCreateRequest request) {
        // 현재 인증된 사용자 정보 가져오기
        User currentUser = getCurrentUser();

        // 게시글 엔티티 생성
        Post post = Post.builder()
                .user(currentUser)
                .postTitle(request.getTitle())
                .postContents(request.getContent())
                .build();

        // 게시글 저장
        Post savedPost = postRepository.save(post);

        // 응답 DTO로 변환하여 반환
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
}
