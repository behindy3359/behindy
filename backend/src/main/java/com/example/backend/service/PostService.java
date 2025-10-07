package com.example.backend.service;

import com.example.backend.dto.post.PostCreateRequest;
import com.example.backend.dto.post.PostListResponse;
import com.example.backend.dto.post.PostResponse;
import com.example.backend.dto.post.PostUpdateRequest;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final AuthService authService;
    private final HtmlSanitizer htmlSanitizer;
    private final EntityDtoMapper entityDtoMapper;

    /**
     * 게시글 생성
     * 캐시 무효화: 게시글 목록 캐시 전체 삭제
     */
    @CacheEvict(value = "postList", allEntries = true)
    @Transactional
    public PostResponse createPost(PostCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        // HTML Sanitizing 처리
        String sanitizedTitle = htmlSanitizer.sanitize(request.getTitle());
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        Post post = Post.builder()
                .user(currentUser)
                .postTitle(sanitizedTitle)
                .postContents(sanitizedContent)
                .build();

        Post savedPost = postRepository.save(post);
        return entityDtoMapper.toPostResponse(savedPost);
    }

    /**
     * 단일 게시글 조회
     * 캐싱: key = postId, TTL = 5분
     */
    @Cacheable(value = "postDetail", key = "#postId")
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        return entityDtoMapper.toPostResponse(post);
    }

    /**
     * 게시글 목록 조회
     */
    @Transactional(readOnly = true)
    public PostListResponse getAllPosts(Pageable pageable) {
        Page<Post> postsPage = postRepository.findAllActive(pageable);

        List<PostResponse> posts = postsPage.getContent().stream()
                .map(entityDtoMapper::toPostResponse)
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
     * 캐시 무효화: 해당 게시글 상세 캐시 및 게시글 목록 캐시 삭제
     */
    @Caching(evict = {
            @CacheEvict(value = "postDetail", key = "#postId"),
            @CacheEvict(value = "postList", allEntries = true)
    })
    @Transactional
    public PostResponse updatePost(Long postId, PostUpdateRequest request) {
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // 현재 인증된 사용자 정보 가져오기
        User currentUser = authService.getCurrentUser();

        // 게시글 작성자와 현재 사용자가 동일한지 확인
        if (!post.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("게시글을 수정할 권한이 없습니다.");
        }

        // XSS 방지를 위한 입력값 필터링
        String sanitizedTitle = htmlSanitizer.sanitize(request.getTitle());
        String sanitizedContent = htmlSanitizer.sanitize(request.getContent());

        // 게시글 정보 업데이트
        post.setPostTitle(sanitizedTitle);
        post.setPostContents(sanitizedContent);

        // 수정된 게시글 저장
        Post updatedPost = postRepository.save(post);
        return entityDtoMapper.toPostResponse(updatedPost);
    }

    /**
     * 게시글 삭제
     * 캐시 무효화: 해당 게시글 상세 캐시 및 게시글 목록 캐시 삭제
     */
    @Caching(evict = {
            @CacheEvict(value = "postDetail", key = "#postId"),
            @CacheEvict(value = "postList", allEntries = true)
    })
    @Transactional
    public void deletePost(Long postId) {
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // 현재 인증된 사용자 정보 가져오기
        User currentUser = authService.getCurrentUser();

        // 게시글 작성자와 현재 사용자가 동일한지 확인
        if (!post.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("게시글을 삭제할 권한이 없습니다.");
        }

        // 게시글 삭제
        post.delete();
        postRepository.save(post);
    }
}