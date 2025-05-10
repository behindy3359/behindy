package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter@Setter @Builder @NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name="NOW")
public class Now {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "char_id")
    @Column(name="char_id")
    private long charId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    @Column(name="page_id")
    private long pageId;

    @CreatedDate
    @Column(name="created_at")
    private LocalDateTime createdAt;
}
