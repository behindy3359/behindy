package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 페이지 체류 시간 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageStatisticsResponse {

    private Long pageId;
    private Long pageNumber;
    private Long visitCount;              // 방문 횟수
    private Double averageDurationSeconds; // 평균 체류 시간 (초)
    private Long minDurationMs;           // 최소 체류 시간 (밀리초)
    private Long maxDurationMs;           // 최대 체류 시간 (밀리초)
}
