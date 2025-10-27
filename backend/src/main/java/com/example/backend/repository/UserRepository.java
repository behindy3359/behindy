package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserEmail(String email);
    boolean existsByUserEmail(String email);

    // 관리자 대시보드용 통계 쿼리
    Long countByDeletedAtIsNull();
    Long countByCreatedAtAfter(LocalDateTime date);
    List<User> findTop10ByDeletedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
}