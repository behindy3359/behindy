package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

// 플레이 분석용 로그 테이블

@Entity
@Getter@Setter@Builder@NoArgsConstructor@AllArgsConstructor
@Table(name="OPS_LOGB")
public class OpsLogB {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="logb_id")
    private long id;

    @Column(name = "loge_id")
    private long logEId;

    @Column(name="logb_page")
    private long logBPage;

    @Column(name="lob_opt")
    private long logBopt;

    @Column(name="logb_dur")
    private long logBDur;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;
}
