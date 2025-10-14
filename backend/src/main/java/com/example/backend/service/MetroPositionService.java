package com.example.backend.service;

import com.example.backend.dto.metro.TrainPosition;
import com.example.backend.dto.metro.MetroPositionResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetroPositionService {

    @Value("${seoul.metro.api.enabled:true}")
    private boolean apiEnabled;

    @Value("${seoul.metro.api.enabled-lines:1,2,3,4}")
    private String enabledLinesConfig;

    private final MetroStationFilter stationFilter;

    private List<Integer> enabledLines;

    private static final Map<Integer, Integer> REALISTIC_TRAIN_COUNTS = Map.of(
            1, 8,   // 1호선: 일반적인 운행 밀도
            2, 12,  // 2호선: 순환선이라 가장 많음
            3, 7,   // 3호선: 중간 밀도
            4, 6    // 4호선: 분기선 포함, 상대적으로 적음
    );

    private static final Map<Integer, List<StationInfo>> LINE_STATIONS = Map.of(
            1, Arrays.asList(
                    new StationInfo("도봉산", "1001000117"),
                    new StationInfo("창동", "1001000116"),
                    new StationInfo("종로5가", "1001000129"),
                    new StationInfo("종각", "1001000131"),
                    new StationInfo("시청", "1001000132"),
                    new StationInfo("서울역", "1001000133"),
                    new StationInfo("용산", "1001000135"),
                    new StationInfo("영등포", "1001000139"),
                    new StationInfo("구로", "1001000141"),
                    new StationInfo("온수", "1001000145")
            ),
            2, Arrays.asList(
                    new StationInfo("을지로입구", "1002000202"),
                    new StationInfo("동대문역사문화공원", "1002000205"),
                    new StationInfo("건대입구", "1002000212"),
                    new StationInfo("잠실", "1002000216"),
                    new StationInfo("삼성", "1002000219"),
                    new StationInfo("강남", "1002000222"),
                    new StationInfo("사당", "1002000226"),
                    new StationInfo("신림", "1002000230"),
                    new StationInfo("구로디지털단지", "1002000232"),
                    new StationInfo("홍대입구", "1002000239"),
                    new StationInfo("신촌", "1002000240")
            ),
            3, Arrays.asList(
                    new StationInfo("구파발", "1003000301"),
                    new StationInfo("불광", "1003000303"),
                    new StationInfo("독립문", "1003000307"),
                    new StationInfo("종로3가", "1003000310"),
                    new StationInfo("충무로", "1003000328"),
                    new StationInfo("압구정", "1003000323"),
                    new StationInfo("교대", "1003000319"),
                    new StationInfo("양재", "1003000344"),
                    new StationInfo("수서", "1003000351"),
                    new StationInfo("오금", "1003000352")
            ),
            4, Arrays.asList(
                    new StationInfo("당고개", "1004000401"),
                    new StationInfo("상계", "1004000402"),
                    new StationInfo("창동", "1004000412"),
                    new StationInfo("한성대입구", "1004000419"),
                    new StationInfo("동대문", "1004000421"),
                    new StationInfo("충무로", "1004000423"),
                    new StationInfo("명동", "1004000424"),
                    new StationInfo("서울역", "1004000426"),
                    new StationInfo("사당", "1004000433")
            )
    );

    @PostConstruct
    public void init() {
        // null 안전 처리
        if (enabledLinesConfig != null) {
            this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                    .map(String::trim)
                    .filter(line -> line != null && line.matches("\\d+"))
                    .map(Integer::parseInt)
                    .sorted()
                    .collect(Collectors.toList());
        } else {
            this.enabledLines = Arrays.asList(1, 2, 3, 4); // 기본값
        }

        int stationCount = 0;
        if (stationFilter != null && stationFilter.getFrontendStationIds() != null) {
            stationCount = stationFilter.getFrontendStationIds().size();
        }

        log.info("지하철 위치 서비스 초기화 완료: 활성 노선 {}", enabledLines);
        log.info("프론트엔드 역 필터링 활성화: {}개 역", stationCount);
    }

    /**
     * 전체 노선의 열차 위치 정보 조회 (필터링 적용) - null 안전 처리
     */
    public MetroPositionResponse getAllPositions() {
        log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] 전체 위치 정보 조회 시작");
        log.warn("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] ⚠️ 경고: 이 서비스는 캐시를 사용하지 않고 항상 Mock 데이터를 생성합니다!");

        try {
            // 1. 전체 위치 정보 생성 (필터링 전)
            log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] Mock 데이터 생성 시작 - 활성 노선: {}",
                enabledLines);

            List<TrainPosition> allPositions = new ArrayList<>();
            if (enabledLines != null) {
                for (Integer lineNumber : enabledLines) {
                    if (lineNumber != null) {
                        List<TrainPosition> linePositions = generateRealisticLinePositions(lineNumber);
                        if (linePositions != null) {
                            allPositions.addAll(linePositions);
                        }
                    }
                }
            }

            log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] Mock 데이터 생성 완료 - {}대 열차",
                allPositions.size());

            // 2. 프론트엔드 역만 필터링
            log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] 필터링 시작 - 원본: {}대",
                allPositions.size());

            List<TrainPosition> filteredPositions = allPositions;
            if (stationFilter != null) {
                filteredPositions = stationFilter.filterFrontendStations(allPositions);
                log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] 필터링 완료 - 결과: {}대",
                    filteredPositions != null ? filteredPositions.size() : 0);
            } else {
                log.warn("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] StationFilter가 null - 필터링 없이 진행");
                log.warn("StationFilter가 null - 필터링 없이 진행");
            }

            // 3. 필터링된 데이터로 통계 생성
            Map<String, Integer> lineStats = createLineStatistics(filteredPositions);

            // 4. 응답 생성
            MetroPositionResponse response = MetroPositionResponse.builder()
                    .positions(filteredPositions != null ? filteredPositions : new ArrayList<>())
                    .totalTrains(filteredPositions != null ? filteredPositions.size() : 0)
                    .lineStatistics(lineStats != null ? lineStats : new HashMap<>())
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdate(LocalDateTime.now().plusMinutes(2))
                    .dataSource(apiEnabled ? "FILTERED_MOCK" : "MOCK")
                    .realtime(false)
                    .systemStatus("HEALTHY")
                    .build();

            log.info("🚇 DEBUG_LOG: [MetroPositionService.getAllPositions] 응답 생성 완료 - dataSource: {}, isRealtime: {}",
                response.getDataSource(), response.isRealtime());
            log.info("전체 위치 정보 조회 완료 (필터링 적용): {}개 노선, {}대 열차 (필터링 전: {}대)",
                    enabledLines != null ? enabledLines.size() : 0,
                    filteredPositions != null ? filteredPositions.size() : 0,
                    allPositions.size());

            return response;

        } catch (Exception e) {
            log.error("전체 위치 정보 조회 실패: {}", e.getMessage(), e);
            return createErrorResponse("전체 위치 정보 조회 중 오류 발생");
        }
    }

    /**
     * 특정 노선의 열차 위치 정보 조회 (필터링 적용) - null 안전 처리
     */
    public MetroPositionResponse getLinePositions(Integer lineNumber) {
        log.info("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] 노선 위치 정보 조회 시작 - {}호선", lineNumber);
        log.warn("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] ⚠️ 경고: 이 서비스는 캐시를 사용하지 않고 항상 Mock 데이터를 생성합니다!");

        try {
            if (lineNumber == null) {
                log.warn("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] 노선 번호가 null");
                log.warn("노선 번호가 null입니다");
                return createErrorResponse("유효하지 않은 노선 번호");
            }

            if (enabledLines == null || !enabledLines.contains(lineNumber)) {
                log.warn("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] 비활성 노선 요청 - {}호선", lineNumber);
                log.warn("비활성 노선 요청: {}호선", lineNumber);
                return createEmptyResponse(lineNumber, "비활성 노선");
            }

            // 1. 해당 노선 위치 정보 생성
            log.info("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] Mock 데이터 생성 시작 - {}호선", lineNumber);

            List<TrainPosition> allLinePositions = generateRealisticLinePositions(lineNumber);
            if (allLinePositions == null) {
                allLinePositions = new ArrayList<>();
            }

            log.info("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] Mock 데이터 생성 완료 - {}대 열차",
                allLinePositions.size());

            // 2. 프론트엔드 역만 필터링
            List<TrainPosition> filteredPositions = allLinePositions;
            if (stationFilter != null) {
                filteredPositions = stationFilter.filterLineStations(allLinePositions, lineNumber);
                log.info("🚇 DEBUG_LOG: [MetroPositionService.getLinePositions] 필터링 완료 - {}대 → {}대",
                    allLinePositions.size(), filteredPositions != null ? filteredPositions.size() : 0);
            }
            if (filteredPositions == null) {
                filteredPositions = new ArrayList<>();
            }

            // 3. 통계 생성
            Map<String, Integer> lineStats = new HashMap<>();
            lineStats.put(lineNumber.toString(), filteredPositions.size());

            MetroPositionResponse response = MetroPositionResponse.builder()
                    .positions(filteredPositions)
                    .totalTrains(filteredPositions.size())
                    .lineStatistics(lineStats)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdate(LocalDateTime.now().plusMinutes(2))
                    .dataSource("FILTERED_MOCK")
                    .realtime(false)
                    .systemStatus("HEALTHY")
                    .build();

            log.info("{}호선 위치 정보 조회 완료 (필터링 적용): {}대 열차 (필터링 전: {}대)",
                    lineNumber, filteredPositions.size(), allLinePositions.size());

            return response;

        } catch (Exception e) {
            log.error("{}호선 위치 정보 조회 실패: {}", lineNumber, e.getMessage(), e);
            return createErrorResponse(lineNumber + "호선 위치 정보 조회 중 오류 발생");
        }
    }

    /**
     * 현실적인 위치 정보 생성 - null 안전 처리
     */
    private List<TrainPosition> generateRealisticLinePositions(Integer lineNumber) {
        if (lineNumber == null) {
            return new ArrayList<>();
        }

        List<StationInfo> stations = LINE_STATIONS.get(lineNumber);
        if (stations == null || stations.isEmpty()) {
            log.warn("{}호선 역 정보 없음", lineNumber);
            return new ArrayList<>();
        }

        int trainCount = getRealisticTrainCount(lineNumber);
        trainCount = adjustTrainCountByTime(trainCount);

        List<TrainPosition> positions = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < trainCount; i++) {
            StationInfo station = getDistributedStation(stations, i, trainCount);
            if (station == null) continue;

            String direction = getRealisticDirection(random, lineNumber);

            TrainPosition position = TrainPosition.builder()
                    .trainId(String.format("%d%04d", lineNumber, 1000 + i))
                    .lineNumber(lineNumber)
                    .stationId(station.getId())
                    .stationName(station.getName())
                    .frontendStationId(station.getName())
                    .direction(direction)
                    .lastUpdated(LocalDateTime.now().minusSeconds(random.nextInt(120)))
                    .dataSource("CLEAN_MOCK")
                    .realtime(false)
                    .build();

            positions.add(position);
        }

        return positions;
    }

    /**
     * 현실적인 노선별 열차 수 반환 - null 안전
     */
    private int getRealisticTrainCount(Integer lineNumber) {
        if (lineNumber == null) return 3;
        return REALISTIC_TRAIN_COUNTS.getOrDefault(lineNumber, 5);
    }

    /**
     * 시간대별 열차 수 조정
     */
    private int adjustTrainCountByTime(int baseCount) {
        LocalTime now = LocalTime.now();
        int hour = now.getHour();

        // 출근시간(7-9시): +2대
        if (hour >= 7 && hour <= 9) {
            return baseCount + 2;
        }
        // 퇴근시간(18-20시): +1대
        else if (hour >= 18 && hour <= 20) {
            return baseCount + 1;
        }
        // 심야시간(0-5시): -2대
        else if (hour >= 0 && hour <= 5) {
            return Math.max(2, baseCount - 2);
        }

        return baseCount;
    }

    /**
     * 열차를 역에 순서대로 분산 배치 - null 안전
     */
    private StationInfo getDistributedStation(List<StationInfo> stations, int trainIndex, int totalTrains) {
        if (stations == null || stations.isEmpty()) {
            return null;
        }
        // 전체 역을 열차 수로 나누어 균등 분산
        int interval = Math.max(1, stations.size() / totalTrains);
        int stationIndex = (trainIndex * interval) % stations.size();
        return stations.get(stationIndex);
    }

    /**
     * 상행/하행 방향 결정 - null 안전
     */
    private String getRealisticDirection(Random random, Integer lineNumber) {
        if (random == null) {
            return "up";
        }
        return random.nextDouble() < 0.6 ? "up" : "down";
    }

    /**
     * 노선별 통계 생성 - null 안전 처리
     */
    private Map<String, Integer> createLineStatistics(List<TrainPosition> positions) {
        if (positions == null) {
            return new HashMap<>();
        }

        return positions.stream()
                .filter(pos -> pos != null && pos.getLineNumber() != null)
                .collect(Collectors.groupingBy(
                        pos -> pos.getLineNumber().toString(),
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)
                ));
    }

    /**
     * 빈 응답 생성 - null 안전
     */
    private MetroPositionResponse createEmptyResponse(Integer lineNumber, String reason) {
        return MetroPositionResponse.builder()
                .positions(new ArrayList<>())
                .totalTrains(0)
                .lineStatistics(new HashMap<>())
                .lastUpdated(LocalDateTime.now())
                .dataSource("NONE")
                .realtime(false)
                .systemStatus("WARNING")
                .build();
    }

    /**
     * 오류 응답 생성 - null 안전
     */
    private MetroPositionResponse createErrorResponse(String errorMessage) {
        log.error("오류 응답 생성: {}", errorMessage);

        return MetroPositionResponse.builder()
                .positions(new ArrayList<>())
                .totalTrains(0)
                .lineStatistics(new HashMap<>())
                .lastUpdated(LocalDateTime.now())
                .dataSource("ERROR")
                .realtime(false)
                .systemStatus("ERROR")
                .build();
    }

    /**
     * 활성화된 노선 목록 반환 - null 안전
     */
    public List<Integer> getEnabledLines() {
        return enabledLines != null ? new ArrayList<>(enabledLines) : new ArrayList<>();
    }

    /**
     * 노선 활성화 여부 확인 - null 안전
     */
    public boolean isLineEnabled(Integer lineNumber) {
        return enabledLines != null && lineNumber != null && enabledLines.contains(lineNumber);
    }

    /**
     * 프론트엔드 역 필터 정보 반환 - null 안전 처리
     */
    public Map<String, Object> getFilterInfo() {
        Map<String, Object> filterInfo = new HashMap<>();

        if (stationFilter != null) {
            Set<String> stationIds = stationFilter.getFrontendStationIds();
            Map<Integer, Integer> stationsByLine = stationFilter.getFrontendStationCountByLine();

            filterInfo.put("totalFrontendStations", stationIds != null ? stationIds.size() : 0);
            filterInfo.put("stationsByLine", stationsByLine != null ? stationsByLine : new HashMap<>());
        } else {
            filterInfo.put("totalFrontendStations", 0);
            filterInfo.put("stationsByLine", new HashMap<>());
        }

        filterInfo.put("enabledLines", enabledLines != null ? enabledLines : new ArrayList<>());
        filterInfo.put("filteringEnabled", stationFilter != null);

        return filterInfo;
    }

    @Getter
    private static class StationInfo {
        private final String name;
        private final String id;

        public StationInfo(String name, String id) {
            this.name = name != null ? name : "미정";
            this.id = id != null ? id : "unknown";
        }
    }
}