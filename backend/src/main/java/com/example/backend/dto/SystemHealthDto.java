package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealthDto {
    private LocalDateTime checkTime;

    // 트래픽 관련
    private Long totalRequests;
    private Long uniqueVisitors;
    private Long activeUsers;

    // 에러 관련
    private Long errorCount;
    private Long errorCountLastHour;
    private Double errorRate;

    // 게임 관련
    private Long activeGames;
    private Long completedGames;
    private Double currentClearRate;

    // 성능 지표
    private Double avgResponseTime;
    private String systemStatus; // "HEALTHY", "WARNING", "CRITICAL"
}
