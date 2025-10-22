package com.example.backend.repository;

import com.example.backend.entity.Comment;
import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 특정 게시글의 삭제되지 않은 댓글들을 최신순으로 조회
     */
    @Query("SELECT c FROM Comment c WHERE c.post.postId = :postId AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findByPostIdAndNotDeleted(@Param("postId") Long postId, Pageable pageable);

    /**
     * 삭제되지 않은 모든 댓글 조회 (관리자용)
     */
    @Query("SELECT c FROM Comment c WHERE c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findAllActive(Pageable pageable);

    /**
     * 특정 사용자의 삭제되지 않은 댓글 조회
     */
    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findByUserAndNotDeleted(@Param("user") User user, Pageable pageable);

    /**
     * 특정 게시글의 댓글 개수 조회 (삭제되지 않은 것만)
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.postId = :postId AND c.deletedAt IS NULL")
    Long countByPostIdAndNotDeleted(@Param("postId") Long postId);

    /**
     * 특정 사용자의 모든 댓글 조회 (삭제된 것 포함, 데모 계정 정리용)
     */
    @Query("SELECT c FROM Comment c WHERE c.user = :user")
    java.util.List<Comment> findByUser(@Param("user") User user);

}