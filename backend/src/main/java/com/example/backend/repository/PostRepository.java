package com.example.backend.repository;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // 삭제되지 않은 모든 게시글 조회
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL")
    Page<Post> findAllActive(Pageable pageable);

    // 특정 사용자의 게시글 조회
    Page<Post> findByUserAndDeletedAtIsNull(User user, Pageable pageable);
}
