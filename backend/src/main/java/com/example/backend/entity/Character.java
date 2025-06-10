package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// 플레이 캐릭터 정보
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "CHAR") //character -> char 로 축약
public class Character {

    // 서비스영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "char_id")
    private Long charId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" ,nullable = false)
    private Users users;

    @Column(name = "char_name", nullable = false)
    private String charName;

    @Column(name = "char_health", nullable = false)
    @Builder.Default
    private Integer charHealth = 100;

    @Column(name = "char_sanity", nullable = false)
    @Builder.Default
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

    @OneToMany(mappedBy = "character", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Now> nows = new ArrayList<>();

    @OneToMany(mappedBy = "character", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<LogE> logES = new ArrayList<>();

    @OneToMany(mappedBy = "character", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<LogO> logOS = new ArrayList<>();
}
