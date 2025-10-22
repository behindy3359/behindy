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
     * 삭제되지 않은 모든 게시글 조회
     * ✅ 이미 @Query 사용 - 그대로 유지
     */
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL")
    Page<Post> findAllActive(Pageable pageable);

    /**
     * 특정 사용자의 게시글 조회 (페이징)
     * ✅ @Query로 변경
     */
    @Query("SELECT p FROM Post p WHERE p.user = :user AND p.deletedAt IS NULL")
    Page<Post> findByUserAndDeletedAtIsNull(@Param("user") User user, Pageable pageable);

    /**
     * 특정 사용자의 모든 게시글 조회 (삭제된 것 포함, 데모 계정 정리용)
     */
    @Query("SELECT p FROM Post p WHERE p.user = :user")
    java.util.List<Post> findByUser(@Param("user") User user);
}
