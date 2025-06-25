package com.example.backend.service;

import com.example.backend.dto.metro.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetroApiService {

    @Value("${seoul.metro.api.key}")
    private String apiKey;

    @Value("${seoul.metro.api.base-url}")
    private String baseUrl;

    @Value("${seoul.metro.api.enabled:true}")
    private boolean apiEnabled;

    @Value("${seoul.metro.api.timeout:10000}")
    private int timeoutMs;

    @Value("${seoul.metro.api.retry-count:3}")
    private int retryCount;

    @Value("${seoul.metro.api.enabled-lines:1,2,3,4}")
    private String enabledLinesConfig;

    private final WebClient webClient;
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);
    private List<String> enabledLines;

    private static final List<CleanStationInfo> STATION_DATA = Arrays.asList(
            // 1호선
            new CleanStationInfo("1", "도봉산", "1001000117"),
            new CleanStationInfo("1", "창동", "1001000116"),
            new CleanStationInfo("1", "종로5가", "1001000129"),
            new CleanStationInfo("1", "종각", "1001000131"),
            new CleanStationInfo("1", "시청", "1001000132"),
            new CleanStationInfo("1", "서울역", "1001000133"),
            new CleanStationInfo("1", "용산", "1001000135"),
            new CleanStationInfo("1", "영등포", "1001000139"),
            new CleanStationInfo("1", "구로", "1001000141"),
            new CleanStationInfo("1", "온수", "1001000145"),

            // 2호선
            new CleanStationInfo("2", "을지로입구", "1002000202"),
            new CleanStationInfo("2", "동대문역사문화공원", "1002000205"),
            new CleanStationInfo("2", "건대입구", "1002000212"),
            new CleanStationInfo("2", "잠실", "1002000216"),
            new CleanStationInfo("2", "삼성", "1002000219"),
            new CleanStationInfo("2", "강남", "1002000222"),
            new CleanStationInfo("2", "사당", "1002000226"),
            new CleanStationInfo("2", "신림", "1002000230"),
            new CleanStationInfo("2", "구로디지털단지", "1002000232"),
            new CleanStationInfo("2", "홍대입구", "1002000239"),
            new CleanStationInfo("2", "신촌", "1002000240"),

            // 3호선
            new CleanStationInfo("3", "구파발", "1003000301"),
            new CleanStationInfo("3", "불광", "1003000303"),
            new CleanStationInfo("3", "독립문", "1003000307"),
            new CleanStationInfo("3", "종로3가", "1003000310"),
            new CleanStationInfo("3", "충무로", "1003000328"),
            new CleanStationInfo("3", "압구정", "1003000323"),
            new CleanStationInfo("3", "교대", "1003000319"),
            new CleanStationInfo("3", "양재", "1003000344"),
            new CleanStationInfo("3", "수서", "1003000351"),
            new CleanStationInfo("3", "오금", "1003000352"),

            // 4호선
            new CleanStationInfo("4", "당고개", "1004000401"),
            new CleanStationInfo("4", "상계", "1004000402"),
            new CleanStationInfo("4", "창동", "1004000412"),
            new CleanStationInfo("4", "한성대입구", "1004000419"),
            new CleanStationInfo("4", "동대문", "1004000421"),
            new CleanStationInfo("4", "충무로", "1004000423"),
            new CleanStationInfo("4", "명동", "1004000424"),
            new CleanStationInfo("4", "서울역", "1004000426"),
            new CleanStationInfo("4", "사당", "1004000433")
    );

    public MetroApiService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
    }

    @PostConstruct
    public void init() {
        this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                .map(String::trim)
                .filter(line -> line.matches("\\d+"))
                .collect(Collectors.toList());

        log.info("API 서비스 초기화: 활성 노선 {}", enabledLines);
    }

    /**
     * 활성화된 노선 목록 조회
     */
    public List<String> getEnabledLines() {
        return new ArrayList<>(enabledLines);
    }

    /**
     * 노선 활성화 여부 확인
     */
    public boolean isLineEnabled(String lineNumber) {
        return enabledLines.contains(lineNumber);
    }

    /**
     * 실시간 위치정보 조회 (특정 노선)
     */
    public Mono<List<RealtimePositionInfo>> getRealtimePosition(String lineNumber) {
        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            return createCleanMockPositionData(lineNumber);
        }

        String url = buildUrl("realtimePosition", lineNumber);

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("API 호출 오류: {} - {}", response.statusCode(), url);
                    return Mono.error(new RuntimeException("API 호출 실패: " + response.statusCode()));
                })
                .bodyToMono(RealtimePositionResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .retryWhen(Retry.fixedDelay(retryCount, Duration.ofSeconds(1)))
                .map(response -> {
                    incrementCallCount();

                    if (response.getMetroErrorMessage() != null && response.getMetroErrorMessage().getStatus() != null) {
                        log.error("API 에러 응답: {}", response.getMetroErrorMessage().getMessage());
                        return new ArrayList<RealtimePositionInfo>();
                    }

                    List<RealtimePositionInfo> result = response.getRealtimePositionList();
                    log.info("실시간 위치정보 조회 성공: {}호선 - {}건", lineNumber, result != null ? result.size() : 0);
                    return result != null ? result : new ArrayList<RealtimePositionInfo>();
                })
                .onErrorResume(error -> {
                    log.error("실시간 위치정보 조회 실패: {}호선 - {}", lineNumber, error.getMessage());
                    return createCleanMockPositionData(lineNumber);
                });
    }

    /**
     * 활성화된 노선들의 실시간 데이터 조회
     */
    public Mono<List<TrainPosition>> getAllLinesRealtime() {
        List<Mono<List<RealtimePositionInfo>>> requests = new ArrayList<>();

        for (String lineNumber : enabledLines) {
            requests.add(getRealtimePosition(lineNumber));
        }

        return Mono.zip(requests, results -> {
            List<TrainPosition> allTrains = new ArrayList<>();

            for (int i = 0; i < results.length; i++) {
                @SuppressWarnings("unchecked")
                List<RealtimePositionInfo> lineData = (List<RealtimePositionInfo>) results[i];

                for (RealtimePositionInfo position : lineData) {
                    TrainPosition trainPosition = convertToTrainPosition(position);
                    allTrains.add(trainPosition);
                }
            }

            log.info("활성화된 노선 실시간 데이터 조회 완료: {}개 노선, 총 {}대 열차",
                    enabledLines.size(), allTrains.size());
            return allTrains;
        });
    }

    /**
     *  Mock 데이터 생성
     */
    private Mono<List<RealtimePositionInfo>> createCleanMockPositionData(String lineNumber) {
        List<RealtimePositionInfo> mockData = new ArrayList<>();

        // 해당 노선의 역 정보 필터링
        List<CleanStationInfo> lineStations = STATION_DATA.stream()
                .filter(station -> lineNumber.equals(station.getLineNumber()))
                .collect(Collectors.toList());

        if (lineStations.isEmpty()) {
            log.warn("{}호선에 대한 역 정보가 없습니다", lineNumber);
            return Mono.just(new ArrayList<>());
        }

        int trainCount = getTrainCountForLine(Integer.parseInt(lineNumber));

        trainCount = adjustTrainCountByTime(trainCount);

        Random random = new Random();

        for (int i = 0; i < trainCount; i++) {
            CleanStationInfo station = getDistributedStation(lineStations, i, trainCount);

            String direction = getRealisticDirection(random);

            RealtimePositionInfo mock = RealtimePositionInfo.builder()
                    .subwayId("100" + lineNumber)
                    .subwayNm(lineNumber + "호선")
                    .statnId(station.getApiId()) // 🎯 API ID만 제공
                    .statnNm(station.getName())  // 🎯 역명만 제공
                    .trainNo("MOCK-" + lineNumber + "-" + (1000 + i))
                    .recptnDt(LocalDateTime.now().toString())
                    .lastRecptnDt(LocalDateTime.now().toString())
                    .updnLine(direction)
                    .statnTid(String.valueOf(i + 1))
                    .directAt("N")
                    .lstcarAt(i == trainCount - 1 ? "Y" : "N")
                    .build();
            mockData.add(mock);
        }

        log.info("관심사 분리 Mock 위치정보 데이터 생성: {}호선 - {}건 (좌표 없음)", lineNumber, mockData.size());
        return Mono.just(mockData);
    }

    /**
     * 노선별 현실적인 열차 수 반환
     */
    private int getTrainCountForLine(int lineNumber) {
        switch (lineNumber) {
            case 1: return 8;   // 1호선: 일반적인 운행 밀도
            case 2: return 12;  // 2호선: 순환선이라 가장 많음
            case 3: return 7;   // 3호선: 중간 밀도
            case 4: return 6;   // 4호선: 분기선 포함, 상대적으로 적음
            default: return 5;
        }
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
            return Math.max(2, baseCount - 2); // 최소 2대는 유지
        }

        return baseCount;
    }

    /**
     *  열차를 역에 순서대로 분산 배치
     */
    private CleanStationInfo getDistributedStation(List<CleanStationInfo> stations, int trainIndex, int totalTrains) {
        // 전체 역을 열차 수로 나누어 균등 분산
        int interval = Math.max(1, stations.size() / totalTrains);
        int stationIndex = (trainIndex * interval) % stations.size();
        return stations.get(stationIndex);
    }

    /**
     * 현실적인 상행/하행 방향 결정 (60:40 비율)
     */
    private String getRealisticDirection(Random random) {
        // 60:40 비율로 약간의 편중 (완전 50:50보다 현실적)
        // updnLine: "0" = 상행, "1" = 하행
        return random.nextDouble() < 0.6 ? "0" : "1";
    }

    /**
     * URL 빌드
     */
    private String buildUrl(String service, String param) {
        return String.format("%s/%s/json/%s/0/100/%s", baseUrl, apiKey, service, param);
    }

    /**
     * API 호출 카운트 증가
     */
    private void incrementCallCount() {
        int currentCount = dailyCallCount.incrementAndGet();
        if (currentCount % 50 == 0) { // 50회마다 로그
            log.info("일일 API 호출 수: {}/950", currentCount);
        }

        if (currentCount >= 950) {
            log.warn("일일 API 호출 한계 근접: {}/950", currentCount);
        }
    }

    /**
     * 일일 호출 카운트 조회
     */
    public int getDailyCallCount() {
        return dailyCallCount.get();
    }

    /**
     * 일일 호출 카운트 초기화 (스케줄러에서 호출)
     */
    public void resetDailyCallCount() {
        int previousCount = dailyCallCount.getAndSet(0);
        log.info("일일 API 호출 카운트 초기화: {} → 0", previousCount);
    }

    private TrainPosition convertToTrainPosition(RealtimePositionInfo position) {
        return TrainPosition.builder()
                .trainId(position.getTrainNo())
                .lineNumber(Integer.valueOf(extractLineNumber(position.getSubwayId())))
                .stationId(position.getStatnId()) // 🎯 API ID만 제공
                .stationName(position.getStatnNm()) // 🎯 역명만 제공
                .direction(convertDirection(position.getUpdnLine()))
                // 🚀 x, y 좌표 제거! 프론트엔드에서 stationId로 매핑
                .x(null)
                .y(null)
                .lastUpdated(LocalDateTime.now())
                .dataSource("API")
                .isRealtime(true)
                .build();
    }

    /**
     * 지하철 호선ID에서 노선 번호 추출 (1001 → "1")
     */
    private String extractLineNumber(String subwayId) {
        if (subwayId == null || subwayId.length() < 4) return "1";
        return subwayId.substring(3); // "1001" → "1"
    }

    /**
     * 상하행 구분 변환
     */
    private String convertDirection(String updnLine) {
        if ("0".equals(updnLine)) return "up";   // 상행
        if ("1".equals(updnLine)) return "down"; // 하행
        return "up"; // 기본값
    }

    // === 내부 클래스: 관심사 분리된 역 정보 (좌표 제거) ===

    private static class CleanStationInfo {
        private final String lineNumber;
        private final String name;
        private final String apiId;

        public CleanStationInfo(String lineNumber, String name, String apiId) {
            this.lineNumber = lineNumber;
            this.name = name;
            this.apiId = apiId;
        }

        public String getLineNumber() { return lineNumber; }
        public String getName() { return name; }
        public String getApiId() { return apiId; }
    }
}