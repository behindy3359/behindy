package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 에러 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorStatisticsResponse {

    private String serviceName;
    private String errorMessage;
    private Long errorCount;
    private LocalDateTime firstOccurrence;
    private LocalDateTime lastOccurrence;
}
