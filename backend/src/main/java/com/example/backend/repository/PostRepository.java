package com.example.backend.repository;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    /**
     * 삭제되지 않은 모든 게시글 조회 (N+1 문제 해결)
     * JOIN FETCH로 user 정보를 함께 로드하여 추가 쿼리 방지
     */
    @Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.user WHERE p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<Post> findAllActive(Pageable pageable);

    /**
     * 특정 사용자의 게시글 조회 (N+1 문제 해결)
     * JOIN FETCH로 user 정보를 함께 로드
     */
    @Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.user WHERE p.user = :user AND p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<Post> findByUserAndDeletedAtIsNull(@Param("user") User user, Pageable pageable);
}
