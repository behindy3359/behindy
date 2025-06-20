package com.example.backend.dto.metro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetroRealtimeDto {

    // 기본 정보
    private String trainNo;           // 열차번호
    private String subwayLine;        // 지하철 노선 (1, 2, 3...)
    private String subwayLineId;      // 지하철 호선ID (1001, 1002...)
    private String currentStation;    // 현재 역명
    private String direction;         // 상행/하행
    private String destination;       // 종착역

    // 상태 정보
    private String trainStatus;       // 열차 상태 (진입, 도착, 출발 등)
    private Integer arrivalTime;      // 도착 예정 시간(초)
    private String arrivalMessage;    // 도착 메시지

    // 위치 정보
    private String stationId;         // 역 ID
    private Double estimatedX;        // 추정 X 좌표 (노선도용)
    private Double estimatedY;        // 추정 Y 좌표 (노선도용)

    // 메타 정보
    private LocalDateTime lastUpdated; // 마지막 업데이트 시간
    private LocalDateTime dataTime;    // 원본 데이터 시간
    private Boolean isRealtime;        // 실시간 여부

    // 특수 정보
    private Boolean isExpress;         // 급행 여부
    private Boolean isLastTrain;       // 막차 여부
    private String trainType;          // 열차 종류
}