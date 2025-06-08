package com.example.backend.dto.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionResponse {
    private Long optionId;
    private String content;
    private String effect;
    private Integer amount;
    private String effectPreview; // "체력 -10", "정신력 +5" 등
}
