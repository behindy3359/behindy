package com.example.backend.dto.metro;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainPosition {

    /**
     * 열차 고유 식별자
     */
    private String trainId;

    /**
     * 지하철 노선 번호 (1, 2, 3, 4)
     */
    private Integer lineNumber;

    /**
     * 현재 위치한 역 ID (API 내부 식별번호)
     */
    private String stationId;

    /**
     * 현재 위치한 역명 (백엔드 원본)
     */
    private String stationName;

    /**
     * 프론트엔드 역 ID (환승역 통합된 역명)
     * 예: "시청", "서울역" 등
     */
    private String frontendStationId;

    /**
     * 운행 방향 ("up": 상행, "down": 하행)
     */
    private String direction;

    /**
     * 노선도 상 X 좌표
     */
    private Double x;

    /**
     * 노선도 상 Y 좌표
     */
    private Double y;

    /**
     * 마지막 업데이트 시간
     */
    private LocalDateTime lastUpdated;

    /**
     * 데이터 출처 ("API", "MOCK", "CACHE")
     */
    private String dataSource;

    /**
     * 실시간 데이터 여부
     */
    @JsonProperty("isRealtime")
    private Boolean realtime;

    // === 편의 메서드들 ===

    /**
     * 열차가 상행인지 확인
     */
    public boolean isUpDirection() {
        return "up".equalsIgnoreCase(direction) || "상행".equals(direction);
    }

    /**
     * 열차가 하행인지 확인
     */
    public boolean isDownDirection() {
        return "down".equalsIgnoreCase(direction) || "하행".equals(direction);
    }

    /**
     * 데이터가 최신인지 확인 (5분 이내)
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
     * 표시용 방향 문자열 반환
     */
    public String getDisplayDirection() {
        if (isUpDirection()) return "상행";
        if (isDownDirection()) return "하행";
        return direction != null ? direction : "미정";
    }

    /**
     * 노선 표시명 반환 (예: "1호선")
     */
    public String getDisplayLineName() {
        return lineNumber != null ? lineNumber + "호선" : "미정";
    }

    /**
     * 좌표 유효성 확인
     */
    public boolean hasValidCoordinates() {
        return x != null && y != null && x >= 0 && y >= 0;
    }

    /**
     * 디버깅용 문자열 반환
     */
    @Override
    public String toString() {
        return String.format("Train[%s] %s %s역(%s) (%s) [%.2f,%.2f] %s",
                trainId, getDisplayLineName(), stationName, frontendStationId, getDisplayDirection(),
                x != null ? x : 0.0, y != null ? y : 0.0, dataSource);
    }
}