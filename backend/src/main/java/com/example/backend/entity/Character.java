package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 플레이 캐릭터 정보
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "CHAR")
public class Character {

    // 서비스영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "char_id")
    private Long charId;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(name = "char_name", nullable = false)
    private Long charName;

    @Column(name = "char_health", nullable = false)
    private Integer charHealth = 100;

    @Column(name = "char_sanity", nullable = false)
    private Integer charSanity = 100;

    // 관리영역
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 캐릭터의 생존/사망 여부도 판별
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
        // 사망시 작동 메서드
        public void delete() {
            this.deletedAt = LocalDateTime.now();
        }

        // 사망 여부 확인 메서드
        public boolean isDeleted() {
            return this.deletedAt != null;
        }
}
