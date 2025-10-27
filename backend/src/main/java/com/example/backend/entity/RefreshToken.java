package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter@Setter@Builder@NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "REFRESH_TOKEN",
    indexes = {
        // 토큰 값으로 조회 (이미 unique 제약이 있지만 명시적 인덱스)
        @Index(name = "idx_refresh_token_value", columnList = "token_value", unique = true),
        // 사용자별 토큰 조회
        @Index(name = "idx_refresh_token_user_id", columnList = "user_id"),
        // 만료된 토큰 정리를 위한 인덱스
        @Index(name = "idx_refresh_token_expires_at", columnList = "expires_at"),
        // 복합 인덱스: 사용자의 유효한 토큰 조회
        @Index(name = "idx_refresh_token_user_valid", columnList = "user_id, expires_at")
    }
)
public class RefreshToken {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;

    @Column(name = "token_value", nullable = false, unique = true)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 만료 확인 매서드
    public boolean isValid() {
        return LocalDateTime.now().isBefore(expiresAt);
    }
}