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

@Entity
@Getter@Setter @NoArgsConstructor @AllArgsConstructor @Builder @EntityListeners(AuditingEntityListener.class)
@Table(name = "USER")
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

    // 관리 영역
    private Boolean isAdmins = false;

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

    // 관계 설정
    @OneToMany(mappedBy = "user_id", orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user_id", orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user_id", orphanRemoval = true)
    private List<Character> characters = new ArrayList<>();

    @OneToMany(mappedBy = "user_id", orphanRemoval = true)
    private List<OpsLogA> OpsLogAs = new ArrayList<>();
}
