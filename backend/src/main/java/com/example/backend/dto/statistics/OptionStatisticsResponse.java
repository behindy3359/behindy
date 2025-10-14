package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 선택지 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionStatisticsResponse {

    private Long optionId;
    private Long pageId;
    private String optionText;
    private Long selectionCount;      // 선택된 횟수
    private Long uniquePlayerCount;   // 선택한 고유 플레이어 수
    private Double selectionRate;     // 선택률 (%)
}
