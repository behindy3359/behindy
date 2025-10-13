package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivitySummaryDto {
    private Long userId;
    private String username;

    // 접속 관련
    private Long totalAccessCount;
    private LocalDateTime lastAccessTime;
    private LocalDateTime firstAccessTime;

    // 게임 플레이 관련
    private Long totalPlayCount;
    private Long completedCount;
    private Long failedCount;
    private Double clearRate;

    // 선택 관련
    private Long totalOptionsSelected;

    // 기간 정보
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
}
