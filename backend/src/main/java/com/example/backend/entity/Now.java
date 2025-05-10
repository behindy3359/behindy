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

    @Column(name="char_id")
    private long charId;

    @Column(name="page_id")
    private long pageId;

    @CreatedDate
    @Column(name="created_at")
    private LocalDateTime createdAt;
}
