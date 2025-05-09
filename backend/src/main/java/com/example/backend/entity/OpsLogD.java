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
    private long id;

    @Column(name = "logd_date")
    private LocalDateTime date;

    @Column(name = "logd_Total")
    private long total;

    // 고유 방문자 수
    @Column(name="logd_unique")
    private long unique;

    // 접속자 수
    @Column(name="logd_login")
    private long login;

    // 플레이 횟수/ 던전 진입 횟수
    @Column(name="logd_counts")
    private long counts;

    // 플레이 시 클리어
    @Column(name="logd_success")
    private long success;

    // 플레이 시 실패
    @Column(name="logd_fail")
    private long fail;
}
