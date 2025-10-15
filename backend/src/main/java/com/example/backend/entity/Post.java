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
@Table(name = "POST")
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

    @Column(name="view_count")
    @Builder.Default
    private Long viewCount = 0L;

//    @Column(name="post_xcord")
//    @Builder.Default
//    private long postX = 0;
//
//    @Column(name="post_ycord")
//    @Builder.Default
//    private long postY = 0;

    // 조회수 증가 메서드
    public void incrementViewCount() {
        this.viewCount++;
    }

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
