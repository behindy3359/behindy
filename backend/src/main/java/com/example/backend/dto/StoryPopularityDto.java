package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryPopularityDto {
    private Long storyId;
    private String storyTitle;
    private String storyDescription;

    private Long totalPlayCount;
    private Long completedCount;
    private Long failedCount;

    private Double clearRate;
    private Double avgPlayTime;

    private Integer ranking;
}
