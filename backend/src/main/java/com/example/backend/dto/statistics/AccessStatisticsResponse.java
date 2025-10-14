package com.example.backend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 접속 통계 응답 DTO (엔드포인트별, HTTP 메서드별 등)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessStatisticsResponse {

    private String path;
    private String method;
    private String statusCode;
    private Long accessCount;
    private Double percentage;  // 전체 대비 비율 (%)
}
