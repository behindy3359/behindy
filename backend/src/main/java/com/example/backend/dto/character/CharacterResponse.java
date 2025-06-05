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
public class CharacterResponse {
    private Long charId;
    private String charName;
    private Integer charHealth;
    private Integer charSanity;
    private Long userId;
    private String userName;

    private boolean isAlive;
    private boolean isDying;
    private String statusMessage;

    private boolean hasGameProgress;
    private Long currentStoryId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}