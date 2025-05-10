package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 플레이어가 현재 진행하고 있는 공간, 세션과 별도로 운영

@Entity
@Getter@Setter @Builder @NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name="NOW")
public class Now {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "now_id")
    private Long nowId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "char_id")
    private Character character;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page;

    @CreatedDate
    @Column(name="created_at")
    private LocalDateTime createdAt;
}
