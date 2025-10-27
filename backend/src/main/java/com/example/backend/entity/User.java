package com.example.backend.entity;

import com.example.backend.security.crypto.TableCryptoConverter;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "User")
@Getter@Setter @NoArgsConstructor @AllArgsConstructor @Builder @EntityListeners(AuditingEntityListener.class)
@Table(name = "users", // postgre에서 user 는 예약어;
    indexes = {
        // 이메일 로그인 (암호화되어 있어도 인덱스 필요)
        @Index(name = "idx_user_email", columnList = "user_email"),
        // 역할별 사용자 조회 (관리자 검색 등)
        @Index(name = "idx_user_role", columnList = "role"),
        // 삭제되지 않은 사용자 필터링
        @Index(name = "idx_user_deleted_at", columnList = "deleted_at"),
        // 복합 인덱스: 활성 사용자 목록
        @Index(name = "idx_user_active", columnList = "deleted_at, created_at DESC")
    }
)
public class User {

    // 서비스 영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false)
    @Convert(converter = TableCryptoConverter.class)
    private String userName;

    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name = "user_email")
    @Convert(converter = TableCryptoConverter.class)
    private String userEmail;

    @CreatedDate
    @Column(name="created_at", updatable = false)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Role role = Role.ROLE_USER;

    // 관계 설정
    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Character> characters = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<OpsLogA> opsLogAS = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<RefreshToken> refreshTokens = new ArrayList<>();
}