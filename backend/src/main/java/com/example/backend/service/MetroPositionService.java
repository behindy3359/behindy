package com.example.backend.service;

import com.example.backend.dto.metro.TrainPosition;
import com.example.backend.dto.metro.MetroPositionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 지하철 위치 정보 서비스 (최종 버전)
 * 노선도 애니메이션에 최적화된 핵심 기능 제공
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetroPositionService {

    @Value("${seoul.metro.api.enabled:true}")
    private boolean apiEnabled;

    @Value("${seoul.metro.api.enabled-lines:1,2,3,4}")
    private String enabledLinesConfig;

    private List<Integer> enabledLines;

    // 노선별 적정 열차 수 (현실적인 운행 밀도 반영)
    private static final Map<Integer, Integer> LINE_TRAIN_COUNTS = Map.of(
            1, 10,  // 1호선: 8-12대
            2, 15,  // 2호선: 12-18대 (순환선이라 많음)
            3, 9,   // 3호선: 7-11대
            4, 8    // 4호선: 6-10대
    );

    // 노선별 주요 역들 (좌표 포함)
    private static final Map<Integer, List<StationInfo>> LINE_STATIONS = Map.of(
            1, Arrays.asList(
                    new StationInfo("종각", "1_001", 60.577595, 47.299969),
                    new StationInfo("시청", "1_002", 55.123456, 47.299969),
                    new StationInfo("을지로입구", "1_003", 65.234567, 47.299969),
                    new StationInfo("동대문", "1_004", 75.345678, 42.156789),
                    new StationInfo("동묘앞", "1_005", 80.456789, 42.156789)
            ),
            2, Arrays.asList(
                    new StationInfo("강남", "2_201", 85.456789, 25.678901),
                    new StationInfo("역삼", "2_202", 90.567890, 25.678901),
                    new StationInfo("선릉", "2_203", 95.678901, 25.678901),
                    new StationInfo("삼성", "2_204", 100.789012, 25.678901),
                    new StationInfo("건대입구", "2_205", 105.890123, 35.789012),
                    new StationInfo("홍대입구", "2_206", 40.234567, 52.345678)
            ),
            3, Arrays.asList(
                    new StationInfo("대치", "3_301", 105.890123, 30.789012),
                    new StationInfo("도곡", "3_302", 110.901234, 30.789012),
                    new StationInfo("매봉", "3_303", 115.012345, 30.789012),
                    new StationInfo("양재", "3_304", 120.123456, 30.789012),
                    new StationInfo("남부터미널", "3_305", 125.234567, 30.789012)
            ),
            4, Arrays.asList(
                    new StationInfo("명동", "4_401", 60.123456, 52.234567),
                    new StationInfo("회현", "4_402", 55.234567, 52.234567),
                    new StationInfo("서울역", "4_403", 50.345678, 52.234567),
                    new StationInfo("숙대입구", "4_404", 45.456789, 52.234567),
                    new StationInfo("삼각지", "4_405", 40.567890, 52.234567)
            )
    );

    @PostConstruct
    public void init() {
        this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                .map(String::trim)
                .map(Integer::parseInt)
                .sorted()
                .collect(Collectors.toList());

        log.info("🚇 지하철 위치 서비스 초기화 완료: 활성 노선 {}", enabledLines);
    }

    /**
     * 전체 노선의 열차 위치 정보 조회
     */
    public MetroPositionResponse getAllPositions() {
        try {
            List<TrainPosition> allPositions = new ArrayList<>();

            // 활성화된 노선별로 위치 정보 생성
            for (Integer lineNumber : enabledLines) {
                List<TrainPosition> linePositions = generateLinePositions(lineNumber);
                allPositions.addAll(linePositions);
            }

            // 노선별 통계 생성
            Map<String, Integer> lineStats = createLineStatistics(allPositions);

            // 응답 생성
            MetroPositionResponse response = MetroPositionResponse.builder()
                    .positions(allPositions)
                    .totalTrains(allPositions.size())
                    .lineStatistics(lineStats)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdate(LocalDateTime.now().plusMinutes(2)) // 2분 후 다음 업데이트
                    .dataSource(apiEnabled ? "API" : "MOCK")
                    .isRealtime(apiEnabled)
                    .systemStatus("HEALTHY")
                    .build();

            log.info("전체 위치 정보 조회 완료: {}개 노선, {}대 열차",
                    enabledLines.size(), allPositions.size());

            return response;

        } catch (Exception e) {
            log.error("전체 위치 정보 조회 실패: {}", e.getMessage(), e);
            return createErrorResponse("전체 위치 정보 조회 중 오류 발생");
        }
    }

    /**
     * 특정 노선의 열차 위치 정보 조회
     */
    public MetroPositionResponse getLinePositions(Integer lineNumber) {
        try {
            if (!enabledLines.contains(lineNumber)) {
                log.warn("비활성 노선 요청: {}호선", lineNumber);
                return createEmptyResponse(lineNumber, "비활성 노선");
            }

            List<TrainPosition> positions = generateLinePositions(lineNumber);
            Map<String, Integer> lineStats = Map.of(lineNumber.toString(), positions.size());

            MetroPositionResponse response = MetroPositionResponse.builder()
                    .positions(positions)
                    .totalTrains(positions.size())
                    .lineStatistics(lineStats)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdate(LocalDateTime.now().plusMinutes(2))
                    .dataSource(apiEnabled ? "API" : "MOCK")
                    .isRealtime(apiEnabled)
                    .systemStatus("HEALTHY")
                    .build();

            log.info("{}호선 위치 정보 조회 완료: {}대 열차", lineNumber, positions.size());
            return response;

        } catch (Exception e) {
            log.error("{}호선 위치 정보 조회 실패: {}", lineNumber, e.getMessage(), e);
            return createErrorResponse(lineNumber + "호선 위치 정보 조회 중 오류 발생");
        }
    }

    /**
     * 특정 노선의 위치 정보 생성 (Mock 데이터)
     */
    private List<TrainPosition> generateLinePositions(Integer lineNumber) {
        List<StationInfo> stations = LINE_STATIONS.get(lineNumber);
        if (stations == null || stations.isEmpty()) {
            log.warn("{}호선 역 정보 없음", lineNumber);
            return List.of();
        }

        int trainCount = LINE_TRAIN_COUNTS.getOrDefault(lineNumber, 5);
        List<TrainPosition> positions = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < trainCount; i++) {
            StationInfo station = stations.get(random.nextInt(stations.size()));
            String direction = random.nextBoolean() ? "up" : "down";

            TrainPosition position = TrainPosition.builder()
                    .trainId(String.format("%d%04d", lineNumber, 1000 + i))
                    .lineNumber(lineNumber)
                    .stationId(station.getId())
                    .stationName(station.getName())
                    .direction(direction)
                    .x(station.getX() + (random.nextDouble() - 0.5) * 2) // 약간의 위치 변화
                    .y(station.getY() + (random.nextDouble() - 0.5) * 2)
                    .lastUpdated(LocalDateTime.now().minusSeconds(random.nextInt(120))) // 최근 2분 내
                    .dataSource("MOCK")
                    .isRealtime(false)
                    .build();

            positions.add(position);
        }

        return positions;
    }

    /**
     * 노선별 통계 생성
     */
    private Map<String, Integer> createLineStatistics(List<TrainPosition> positions) {
        return positions.stream()
                .collect(Collectors.groupingBy(
                        pos -> pos.getLineNumber().toString(),
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)
                ));
    }

    /**
     * 빈 응답 생성
     */
    private MetroPositionResponse createEmptyResponse(Integer lineNumber, String reason) {
        return MetroPositionResponse.builder()
                .positions(List.of())
                .totalTrains(0)
                .lineStatistics(Map.of())
                .lastUpdated(LocalDateTime.now())
                .dataSource("NONE")
                .isRealtime(false)
                .systemStatus("WARNING")
                .build();
    }

    /**
     * 오류 응답 생성
     */
    private MetroPositionResponse createErrorResponse(String errorMessage) {
        log.error("오류 응답 생성: {}", errorMessage);

        return MetroPositionResponse.builder()
                .positions(List.of())
                .totalTrains(0)
                .lineStatistics(Map.of())
                .lastUpdated(LocalDateTime.now())
                .dataSource("ERROR")
                .isRealtime(false)
                .systemStatus("ERROR")
                .build();
    }

    /**
     * 활성화된 노선 목록 반환
     */
    public List<Integer> getEnabledLines() {
        return new ArrayList<>(enabledLines);
    }

    /**
     * 노선 활성화 여부 확인
     */
    public boolean isLineEnabled(Integer lineNumber) {
        return enabledLines.contains(lineNumber);
    }

    // === 내부 클래스: 역 정보 ===

    private static class StationInfo {
        private final String name;
        private final String id;
        private final double x;
        private final double y;

        public StationInfo(String name, String id, double x, double y) {
            this.name = name;
            this.id = id;
            this.x = x;
            this.y = y;
        }

        public String getName() { return name; }
        public String getId() { return id; }
        public double getX() { return x; }
        public double getY() { return y; }
    }
}