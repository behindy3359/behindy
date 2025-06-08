package com.example.backend.dto.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryStatisticsResponse {
    private Long storyId;
    private String storyTitle;
    private Integer storyLength;
    private Long totalPages;
    private Integer currentPlayers;
    private String stationName;
    private Integer stationLine;

    // 추가 통계 정보 (향후 확장)
    private Long totalPlays;
    private Long completions;
    private Double completionRate;
    private Double averageRating;
}