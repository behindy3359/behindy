package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

// Options, 선택지들에 대한 로그를 보관하는 테이블

@Entity
@Getter@Setter
@Builder@NoArgsConstructor@AllArgsConstructor
@Table(name = "LOG_OPS")
public class LogO {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "logo_id")
    private long id;

    @Column(name = "char_id")
    private long charId;

    @Column(name = "ops_id")
    private long opsId;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;


}
