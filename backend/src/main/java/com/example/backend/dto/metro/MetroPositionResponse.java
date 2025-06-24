package com.example.backend.dto.metro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 지하철 위치 정보 API 응답 DTO (최종 버전)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetroPositionResponse {

    /**
     * 모든 열차의 위치 정보
     */
    private List<TrainPosition> positions;

    /**
     * 총 열차 수
     */
    private Integer totalTrains;

    /**
     * 노선별 열차 수 통계 (애니메이션 강도 조절용)
     * Key: 노선번호(String), Value: 열차수(Integer)
     */
    private Map<String, Integer> lineStatistics;

    /**
     * 마지막 업데이트 시간
     */
    private LocalDateTime lastUpdated;

    /**
     * 다음 업데이트 예정 시간
     */
    private LocalDateTime nextUpdate;

    /**
     * 데이터 출처 ("API", "MOCK", "CACHE")
     */
    private String dataSource;

    /**
     * 실시간 데이터 여부
     */
    private Boolean isRealtime;

    /**
     * 시스템 상태 ("HEALTHY", "WARNING", "ERROR")
     */
    private String systemStatus;

    // === 편의 메서드들 ===

    /**
     * 특정 노선의 열차 수 조회
     */
    public Integer getTrainCountForLine(String lineNumber) {
        return lineStatistics != null ? lineStatistics.getOrDefault(lineNumber, 0) : 0;
    }

    /**
     * 특정 노선의 열차 목록 조회
     */
    public List<TrainPosition> getTrainsForLine(String lineNumber) {
        if (positions == null) return List.of();

        return positions.stream()
                .filter(train -> lineNumber.equals(String.valueOf(train.getLineNumber())))
                .toList();
    }

    /**
     * 상행 열차 수 조회
     */
    public long getUpTrainCount() {
        if (positions == null) return 0;
        return positions.stream().filter(TrainPosition::isUpDirection).count();
    }

    /**
     * 하행 열차 수 조회
     */
    public long getDownTrainCount() {
        if (positions == null) return 0;
        return positions.stream().filter(TrainPosition::isDownDirection).count();
    }

    /**
     * 데이터 신선도 확인 (5분 이내 업데이트)
     */
    public boolean isFresh() {
        if (lastUpdated == null) return false;
        return lastUpdated.isAfter(LocalDateTime.now().minusMinutes(5));
    }

    /**
     * Mock 데이터인지 확인
     */
    public boolean isMockData() {
        return "MOCK".equalsIgnoreCase(dataSource);
    }

    /**
     * 시스템이 정상 상태인지 확인
     */
    public boolean isSystemHealthy() {
        return "HEALTHY".equalsIgnoreCase(systemStatus);
    }

    /**
     * 활성 노선 수 조회
     */
    public int getActiveLineCount() {
        return lineStatistics != null ? lineStatistics.size() : 0;
    }

    /**
     * 노선별 통계 요약 문자열
     */
    public String getLineStatisticsSummary() {
        if (lineStatistics == null || lineStatistics.isEmpty()) {
            return "통계 없음";
        }

        StringBuilder summary = new StringBuilder();
        lineStatistics.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    if (summary.length() > 0) summary.append(", ");
                    summary.append(entry.getKey()).append("호선: ").append(entry.getValue()).append("대");
                });

        return summary.toString();
    }

    /**
     * 디버깅용 요약 정보
     */
    public String getSummary() {
        return String.format("Metro[%d trains, %d lines, %s, %s]",
                totalTrains != null ? totalTrains : 0,
                getActiveLineCount(),
                dataSource != null ? dataSource : "UNKNOWN",
                isFresh() ? "FRESH" : "STALE");
    }
}