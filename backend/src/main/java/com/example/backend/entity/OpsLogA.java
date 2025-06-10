package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 접속/접근 (log Access) 로그 보관 테이블

@Entity
@Getter@Setter@Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name="OPS_LOGA")
public class OpsLogA {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="loga_id")
    private long logaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "loga_address")
    private String logaAddress;

    @Column(name = "loga_agent")
    private String logaAgent;

    @Column(name = "loga_path", columnDefinition = "TEXT")
    private String logaPath;

    @Column(name = "loga_method")
    private String logaMethod;

    @Column(name = "loga_status")
    private String logaStatusCode;

    // 관려 영역
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
