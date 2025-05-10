package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter@Setter@Builder @NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "LOGE")
public class LogE {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "loge_id")
    private Long logeId;

    @Column(name = "char_id")
    private Long charId;

    @Column(name = "sto_id")
    private Long stoId;

    @Column(name = "loge_result")
    private String logeResult;

    @Column(name = "loge_ending")
    private int logeEnding;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;
}
