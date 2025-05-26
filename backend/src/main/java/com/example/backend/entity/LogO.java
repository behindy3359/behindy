package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// Options, 선택지들에 대한 로그를 보관하는 테이블

@Entity
@Getter@Setter @Builder@NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "LOG_OPS") // log O, O : options, 선택지,
public class LogO {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "logo_id")
    private long logoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "char_id")
    private Character character;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opt_id")
    private Options options;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;
}
