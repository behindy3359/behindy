package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

// 접속/접근 (log Access) 로그 보관 테이블

@Entity
@Getter@Setter@Builder @NoArgsConstructor @AllArgsConstructor
@Table(name="OPS_LOGA")
public class OpsLogA {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="loga_id")
    private long id;

    @Column(name="user_id")
    private long userId;

    @Column(name="loga_address")
    private String address;

    @Column(name="loga_agent")
    private String agent;

    @Column(name="loga_path", columnDefinition = "TEXT")
    private String path;

    @Column(name="loga_method")
    private String method;

    @Column(name="loga_status")
    private String statusCode;

    // 관려 영역
    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;
}
