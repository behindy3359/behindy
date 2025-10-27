package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter@Setter@Builder @NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "POST",
    indexes = {
        // 게시글 목록 조회 (최신순 정렬)
        @Index(name = "idx_post_created_at", columnList = "created_at DESC"),
        // 사용자별 게시글 조회
        @Index(name = "idx_post_user_id", columnList = "user_id"),
        // 삭제되지 않은 게시글 필터링
        @Index(name = "idx_post_deleted_at", columnList = "deleted_at"),
        // 복합 인덱스: 활성 게시글 목록 조회 최적화 (deleted_at IS NULL + 최신순)
        @Index(name = "idx_post_active_list", columnList = "deleted_at, created_at DESC")
    }
)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name="post_title")
    private String postTitle;

    @Column(name="post_contents",columnDefinition = "TEXT")
    private String postContents;

    // PostStats와의 1:1 관계
    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private PostStats stats;

//    @Column(name="post_xcord")
//    @Builder.Default
//    private long postX = 0;
//
//    @Column(name="post_ycord")
//    @Builder.Default
//    private long postY = 0;

    // 관리 영역
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
    @OneToMany(mappedBy = "post", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
