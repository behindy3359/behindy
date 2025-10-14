package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 전체 통계 요약 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverallSummaryResponse {

    private Long totalPlays;
    private Long totalSuccess;
    private Long totalFail;
    private Double averageDailyVisitors;
    private Double averageDailyUniqueVisitors;
    private Double averageClearRate;
    private Long totalErrorCount;
    private Long recentErrorCount;  // 최근 24시간 에러 수
}
