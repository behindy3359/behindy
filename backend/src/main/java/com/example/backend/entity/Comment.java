package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter@Setter @Builder@NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "COMMENT") // comment -> cmt
public class Comment {
    // 서비스영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cmt_id")
    private Long cmtId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @Column(name="post_id")
    private Post postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Column(name="user_id")
    private User userId;

    @Column(name="cmt_contents",columnDefinition = "TEXT")
    private String cmtContents;

    // 관리 영역
    @CreatedDate
    @Column(name = "created_at",updatable = false)
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
}
