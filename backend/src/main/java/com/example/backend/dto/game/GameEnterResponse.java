package com.example.backend.dto.game;

import com.example.backend.dto.character.CharacterResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameEnterResponse {
    private boolean success;
    private String action; // "START_NEW", "RESUME_EXISTING", "NO_STORIES", "CHARACTER_REQUIRED"
    private String message;

    // 새 게임 시작 시
    private Long selectedStoryId;
    private String selectedStoryTitle;
    private PageResponse firstPage;

    // 기존 게임 재개 시
    private Long resumeStoryId;
    private String resumeStoryTitle;
    private PageResponse currentPage;

    // 공통
    private CharacterResponse character;
    private String stationName;
    private Integer stationLine;

    // 선택 가능한 스토리 목록 (필요시)
    private List<StoryResponse> availableStories;
}