package com.example.backend.dto.game;

import com.example.backend.dto.character.CharacterResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChoiceResultResponse {
    private boolean success;
    private String result;
    private CharacterResponse updatedCharacter;
    private PageResponse nextPage;
    private boolean isGameOver;
    private String gameOverReason;
    private String message;
}
