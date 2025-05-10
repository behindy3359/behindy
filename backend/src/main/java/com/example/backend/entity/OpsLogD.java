package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// 일일 사용 통계를 위한 로그 (log Daily)

@Entity
@Getter@Setter@NoArgsConstructor@AllArgsConstructor@Builder
@Table(name="OPS_LOGD")
public class OpsLogD {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "logd_id")
    private long logdId;

    @Column(name = "logd_date", updatable = false)
    private LocalDateTime logdDate;

    @Column(name = "logd_Total")
    private long logdTotal;

    // 고유 방문자 수
    @Column(name="logd_unique")
    private long logdUnique;

    // 접속자 수
    @Column(name="logd_login")
    private long logdLogin;

    // 플레이 횟수/ 던전 진입 횟수
    @Column(name="logd_counts")
    private long logdCounts;

    // 플레이 시 클리어
    @Column(name="logd_success")
    private long logdSuccess;

    // 플레이 시 실패
    @Column(name="logd_fail")
    private long logdFail;
}
