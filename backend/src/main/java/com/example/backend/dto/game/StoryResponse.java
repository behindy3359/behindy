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
    private String difficulty; // TODO : 시스템 사용이 누적되면서 사망자가 많았던 스토리는 난이도를 올릴계획
    private String theme; // TODO : 키워드로 변환, 지하철의 공포 테마 스토리만을 생성 대신 중복 스토리 생성 방지를 위해 키워드를 LLM에 제시할 예정
    private String description; // TODO : 중복 스토리 생성방지를 위해 LLM에 제시할 요약본
    private String stationName;
    private Integer stationLine;
    private boolean canPlay;
    private String playStatus; // TODO : 삭제해야할듯?
}