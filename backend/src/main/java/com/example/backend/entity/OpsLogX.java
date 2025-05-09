package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

// 에러 로그 보관

@Entity
@Getter@Setter@NoArgsConstructor@AllArgsConstructor@Builder
@Table(name="OPS_LOGX")
public class OpsLogX {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name="logx_service")
    private String service;

    @Column(name="logx_message", columnDefinition="TEXT")
    private String message;

    // stacktrace
    @Column(name="logx_stktrace", columnDefinition = "TEXT")
    private String stktrace;

    @CreatedDate
    @Column(name="created_at")
    private LocalDateTime createdAt;
}
