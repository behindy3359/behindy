package com.example.backend.entity;

import com.example.backend.security.crypto.FieldCryptoConverter;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "Character")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "char")
public class Character {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "char_id")
    private Long charId;

    @Column(name = "char_name", nullable = false)
    @Convert(converter = FieldCryptoConverter.class)
    private String charName;

    // ✅ 추가: 체력 필드
    @Column(name = "char_health", nullable = false)
    @Builder.Default
    private Integer charHealth = 100;

    // ✅ 추가: 정신력 필드
    @Column(name = "char_sanity", nullable = false)
    @Builder.Default
    private Integer charSanity = 100;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 논리삭제 메서드
    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }

    // 삭제 여부 확인 메서드
    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    // ✅ 수정: user -> users 필드명 통일
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User users;

    // 게임 진행 관련
    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Now> nows = new ArrayList<>();
}