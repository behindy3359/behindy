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
import java.util.*;
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

    private static final Map<String, List<String>> SIMPLE_STATIONS = Map.of(
            "1", Arrays.asList("도봉산", "창동", "종각", "시청", "서울역", "용산", "영등포", "구로"),
            "2", Arrays.asList("을지로입구", "건대입구", "잠실", "강남", "사당", "신림", "홍대입구", "신촌"),
            "3", Arrays.asList("구파발", "불광", "독립문", "종로3가", "압구정", "교대", "양재", "오금"),
            "4", Arrays.asList("당고개", "창동", "혜화", "명동", "서울역", "사당", "남태령")
    );

    @PostConstruct
    public void init() {
        this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                .map(String::trim)
                .filter(line -> line.matches("\\d+"))
                .collect(Collectors.toList());

        log.info("=== Metro API 서비스 초기화 (리팩토링 버전) ===");
        log.info("활성 노선: {}", enabledLines);
    }

    /**
     * 🔄 리팩토링: 직접 TrainPosition 반환
     * 기존: RealtimePositionInfo → MetroRealtimeDto → TrainPosition
     * 신규: RealtimePositionInfo → TrainPosition
     */
    public Mono<List<TrainPosition>> getRealtimePositions(String lineNumber) {
        log.info("=== {}호선 실시간 위치 조회 시작 ===", lineNumber);

        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            log.warn("API 비활성화 또는 임시 키 - Mock 데이터 사용");
            return createSimplifiedMockData(lineNumber);
        }

        String url = buildUrl("realtimePosition", lineNumber + "호선");
        log.info("API 요청: {}", url);

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("HTTP 에러: {} - {}", response.statusCode(), url);
                    return Mono.error(new RuntimeException("API 호출 실패: " + response.statusCode()));
                })
                .bodyToMono(RealtimePositionResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .retryWhen(Retry.fixedDelay(retryCount, Duration.ofSeconds(1)))
                .map(this::processApiResponse)
                .onErrorResume(error -> {
                    log.error("API 호출 실패: {} - Mock 데이터 사용", error.getMessage());
                    return createSimplifiedMockData(lineNumber);
                });
    }

    /**
     * 🎯 API 응답 처리 (직접 TrainPosition 변환)
     */
    private List<TrainPosition> processApiResponse(RealtimePositionResponse response) {
        incrementCallCount();

        if (response.isAnyError()) {
            log.warn("API 에러 응답: {}", response.getUnifiedErrorMessage());
            throw new RuntimeException("API_ERROR: " + response.getUnifiedErrorMessage());
        }

        if (response.isEmpty()) {
            log.warn("정상 응답이지만 데이터 없음 (심야시간 등)");
            throw new RuntimeException("API_EMPTY_DATA: 운행 데이터 없음");
        }

        List<RealtimePositionInfo> positionList = response.getRealtimePositionList();

        // 🔄 직접 TrainPosition으로 변환 (MetroRealtimeDto 건너뛰기)
        List<TrainPosition> trainPositions = positionList.stream()
                .map(this::convertToTrainPosition)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        log.info("API 데이터 변환 완료: {}대 열차", trainPositions.size());
        return trainPositions;
    }

    /**
     * 🔄 리팩토링: RealtimePositionInfo → TrainPosition 직접 변환
     */
    private TrainPosition convertToTrainPosition(RealtimePositionInfo position) {
        try {
            return TrainPosition.builder()
                    .trainId(position.getTrainNo())
                    .lineNumber(Integer.valueOf(extractLineNumber(position.getSubwayId())))
                    .stationId(position.getStatnId())
                    .stationName(position.getStatnNm())
                    .frontendStationId(position.getStatnNm())
                    .direction(convertDirection(position.getUpdnLine()))
                    .lastUpdated(LocalDateTime.now())
                    .dataSource("API")
                    .isRealtime(true)
                    .build();
        } catch (Exception e) {
            log.error("위치 데이터 변환 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 🎯 전체 노선 조회 (리팩토링된 버전)
     */
    public Mono<List<TrainPosition>> getAllLinesRealtime() {
        log.info("=== 전체 노선 실시간 데이터 조회 시작 ===");

        List<Mono<List<TrainPosition>>> requests = enabledLines.stream()
                .map(this::getRealtimePositions)
                .collect(Collectors.toList());

        return Mono.zip(requests, results -> {
            List<TrainPosition> allTrains = Arrays.stream(results)
                    .flatMap(result -> ((List<TrainPosition>) result).stream())
                    .collect(Collectors.toList());

            log.info("전체 데이터 통합 완료: {}개 노선, {}대 열차",
                    enabledLines.size(), allTrains.size());

            return allTrains;
        });
    }

    /**
     * 🎯 간소화된 Mock 데이터 생성 (기존 400줄 → 50줄)
     */
    private Mono<List<TrainPosition>> createSimplifiedMockData(String lineNumber) {
        log.info("=== Mock 데이터 생성: {}호선 ===", lineNumber);

        List<String> stations = SIMPLE_STATIONS.getOrDefault(lineNumber,
                Arrays.asList("역1", "역2", "역3"));

        int trainCount = getRealisticTrainCount(lineNumber);
        List<TrainPosition> mockData = new ArrayList<>();

        for (int i = 0; i < trainCount; i++) {
            String stationName = stations.get(i % stations.size());

            TrainPosition position = TrainPosition.builder()
                    .trainId(generateTrainId(lineNumber, i))
                    .lineNumber(Integer.parseInt(lineNumber))
                    .stationId("100" + lineNumber + String.format("%03d", i))
                    .stationName(stationName)
                    .frontendStationId(stationName)
                    .direction(i % 2 == 0 ? "up" : "down")
                    .lastUpdated(LocalDateTime.now().minusSeconds(new Random().nextInt(120)))
                    .dataSource("MOCK")
                    .isRealtime(false)
                    .build();

            mockData.add(position);
        }

        log.info("Mock 데이터 생성 완료: {}대 열차", mockData.size());
        return Mono.just(mockData);
    }

    // ===== 유틸리티 메서드들 =====

    private int getRealisticTrainCount(String lineNumber) {
        Map<String, Integer> baseCounts = Map.of("1", 6, "2", 8, "3", 5, "4", 4);
        int baseCount = baseCounts.getOrDefault(lineNumber, 5);

        // 시간대별 조정 (간소화)
        LocalTime now = LocalTime.now();
        if (now.getHour() >= 7 && now.getHour() <= 9) return baseCount + 2; // 출근
        if (now.getHour() >= 18 && now.getHour() <= 20) return baseCount + 1; // 퇴근
        if (now.getHour() >= 0 && now.getHour() <= 5) return Math.max(2, baseCount - 2); // 심야
        return baseCount;
    }

    private String generateTrainId(String lineNumber, int index) {
        LocalTime now = LocalTime.now();
        if (now.getHour() >= 23 || now.getHour() <= 5) {
            return String.format("N%s%03d", lineNumber, 100 + index); // 심야
        }
        return String.format("%s%04d", lineNumber, 1000 + index); // 일반
    }

    private String buildUrl(String service, String param) {
        return String.format("%s/%s/json/%s/0/100/%s", baseUrl, apiKey, service, param);
    }

    private void incrementCallCount() {
        int count = dailyCallCount.incrementAndGet();
        if (count % 50 == 0) {
            log.info("일일 API 호출 수: {}", count);
        }
    }

    private String extractLineNumber(String subwayId) {
        if (subwayId == null || subwayId.length() < 4) return "1";
        return subwayId.substring(3);
    }

    private String convertDirection(String updnLine) {
        return "0".equals(updnLine) ? "up" : "down";
    }

    // ===== 기존 메서드들 유지 =====

    public List<String> getEnabledLines() {
        return new ArrayList<>(enabledLines);
    }

    public boolean isLineEnabled(String lineNumber) {
        return enabledLines.contains(lineNumber);
    }

    public int getDailyCallCount() {
        return dailyCallCount.get();
    }

    public void resetDailyCallCount() {
        dailyCallCount.set(0);
        log.info("일일 API 호출 카운트 초기화");
    }
}