package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 일별 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatisticsResponse {

    private LocalDateTime date;
    private Long totalVisitors;        // 총 방문자 수
    private Long uniqueVisitors;       // 고유 방문자 수
    private Long loginCount;           // 로그인한 사용자 수
    private Long playCount;            // 게임 플레이 횟수
    private Long successCount;         // 게임 클리어 횟수
    private Long failCount;            // 게임 실패 횟수
    private Double clearRate;          // 클리어율 (%)
}
