package com.example.backend.dto.character;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterGameStatusResponse {
    // 캐릭터 기본 정보
    private Long charId;
    private String charName;
    private Integer charHealth;
    private Integer charSanity;
    private boolean isAlive;
    private boolean isDying;
    private String statusMessage;

    // 게임 진행 상태
    private boolean hasActiveGame;
    private Long currentStoryId;
    private String currentStoryTitle;
    private Long currentPageNumber;
    private LocalDateTime gameStartTime;

    // 캐릭터 통계
    private Long totalClears;
    private Long totalPlays;
    private Double clearRate;

    // 게임 진입 가능 여부
    private boolean canEnterNewGame;
    private String cannotEnterReason;
}