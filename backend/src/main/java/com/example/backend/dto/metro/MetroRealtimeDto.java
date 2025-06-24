package com.example.backend.dto.metro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 단순화된 지하철 실시간 데이터 DTO
 * 기존 15개 필드에서 8개 핵심 필드로 축소
 *
 * @deprecated TrainPosition 사용 권장
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Deprecated
public class MetroRealtimeDto {

    // === 핵심 필드 (8개) ===

    /**
     * 열차번호
     */
    private String trainNo;

    /**
     * 지하철 노선 (1, 2, 3, 4)
     */
    private String lineNumber;

    /**
     * 현재 역명
     */
    private String currentStation;

    /**
     * 상행/하행 방향
     */
    private String direction;

    /**
     * 종착역
     */
    private String destination;

    /**
     * 마지막 업데이트 시간
     */
    private LocalDateTime lastUpdated;

    /**
     * 실시간 여부
     */
    private Boolean isRealtime;

    /**
     * 데이터 출처 (API/CACHE/MOCK)
     */
    private String dataSource;

    /**
     * TrainPosition으로 변환 (마이그레이션용)
     */
    public TrainPosition toTrainPosition() {
        return TrainPosition.builder()
                .trainId(trainNo)
                .lineNumber(parseLineNumber(lineNumber))
                .stationName(currentStation)
                .direction(convertDirection(direction))
                .lastUpdated(lastUpdated)
                .dataSource(dataSource)
                .isRealtime(isRealtime)
                .build();
    }

    /**
     * 노선 번호 파싱
     */
    private Integer parseLineNumber(String line) {
        try {
            return Integer.parseInt(line);
        } catch (Exception e) {
            return 1; // 기본값
        }
    }

    /**
     * 방향 변환
     */
    private String convertDirection(String dir) {
        if ("상행".equals(dir) || "0".equals(dir)) return "up";
        if ("하행".equals(dir) || "1".equals(dir)) return "down";
        return "up"; // 기본값
    }

    /**
     * 상행인지 확인
     */
    public boolean isUpDirection() {
        return "상행".equals(direction) || "0".equals(direction);
    }

    /**
     * 하행인지 확인
     */
    public boolean isDownDirection() {
        return "하행".equals(direction) || "1".equals(direction);
    }

    /**
     * Mock 데이터인지 확인
     */
    public boolean isMockData() {
        return "MOCK".equalsIgnoreCase(dataSource);
    }

    /**
     * 데이터가 최신인지 확인 (5분 이내)
     */
    public boolean isFresh() {
        if (lastUpdated == null) return false;
        return lastUpdated.isAfter(LocalDateTime.now().minusMinutes(5));
    }

    /**
     * 표시용 노선명 반환 (예: "1호선")
     */
    public String getDisplayLineName() {
        return lineNumber != null ? lineNumber + "호선" : "미정";
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
     * 디버깅용 문자열 반환
     */
    @Override
    public String toString() {
        return String.format("Metro[%s] %s %s역 (%s) %s",
                trainNo, getDisplayLineName(), currentStation, getDisplayDirection(), dataSource);
    }

    // === 정적 팩토리 메서드 ===

    /**
     * TrainPosition에서 생성 (호환성용)
     */
    public static MetroRealtimeDto fromTrainPosition(TrainPosition position) {
        return MetroRealtimeDto.builder()
                .trainNo(position.getTrainId())
                .lineNumber(String.valueOf(position.getLineNumber()))
                .currentStation(position.getStationName())
                .direction(position.getDirection())
                .destination("종점") // 기본값
                .lastUpdated(position.getLastUpdated())
                .isRealtime(position.getIsRealtime())
                .dataSource(position.getDataSource())
                .build();
    }

    /**
     * Mock 데이터 생성
     */
    public static MetroRealtimeDto createMock(String trainNo, String line, String station, String direction) {
        return MetroRealtimeDto.builder()
                .trainNo(trainNo)
                .lineNumber(line)
                .currentStation(station)
                .direction(direction)
                .destination("종점")
                .lastUpdated(LocalDateTime.now())
                .isRealtime(false)
                .dataSource("MOCK")
                .build();
    }
}