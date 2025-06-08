package com.example.backend.dto.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponse {
    private Long storyId;
    private String storyTitle;
    private Integer estimatedLength;
    private String difficulty; // "쉬움", "보통", "어려움"
    private String theme; // "공포", "로맨스", "미스터리" 등
    private String description;
    private String stationName;
    private Integer stationLine;
    private boolean canPlay;
    private String playStatus; // "새로운 스토리", "플레이 가능", "진행 중"
}