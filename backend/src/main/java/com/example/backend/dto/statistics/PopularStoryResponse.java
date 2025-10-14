package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인기 스토리 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularStoryResponse {

    private Long storyId;
    private String storyTitle;
    private String stationName;
    private Integer stationLine;
    private Long playCount;           // 총 플레이 횟수
    private Long successCount;        // 클리어 횟수
    private Long failCount;           // 실패 횟수
    private Double clearRate;         // 클리어율 (%)
    private Integer ranking;          // 순위
}
