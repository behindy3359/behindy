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

    @PostConstruct
    public void init() {
        this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                .map(String::trim)
                .filter(line -> line.matches("\\d+"))
                .collect(Collectors.toList());

        log.info("=== Metro API 서비스 초기화 (OpenAPI 연동 개선) ===");
        log.info("활성 노선: {}", enabledLines);
        log.info("API 키 상태: {}", isValidApiKey() ? "정상" : "테스트키/없음");
        log.info("API URL: {}", baseUrl);
    }

    /**
     *  실시간 위치 조회 - OpenAPI 우선, 실패시에만 Mock
     */
    public Mono<List<TrainPosition>> getRealtimePositions(String lineNumber) {

        if (!apiEnabled) {
            return createRealisticMockData(lineNumber);
        }

        if (!isValidApiKey()) {
            return createRealisticMockData(lineNumber);
        }

        // 실제 OpenAPI 호출
        return callSeoulMetroAPI(lineNumber)
                .doOnSuccess(positions -> incrementCallCount())
                .doOnError(error -> log.error("{}호선 OpenAPI 호출 실패: {}", lineNumber, error.getMessage()))
                .onErrorResume(error -> createRealisticMockData(lineNumber));
    }

    /**
     *  실제 서울시 지하철 OpenAPI 호출
     */
    private Mono<List<TrainPosition>> callSeoulMetroAPI(String lineNumber) {
        String url = buildOpenApiUrl(lineNumber);

        log.debug("OpenAPI 요청: {}", url);

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("OpenAPI HTTP 에러: {} - {}", response.statusCode(), url);
                    return Mono.error(new RuntimeException("OpenAPI HTTP 에러: " + response.statusCode()));
                })
                .bodyToMono(RealtimePositionResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .retryWhen(Retry.fixedDelay(retryCount, Duration.ofSeconds(2))
                        .doBeforeRetry(retrySignal ->
                                log.warn("OpenAPI 재시도 {}/{}: {}",
                                        retrySignal.totalRetries() + 1, retryCount, lineNumber)))
                .map(response -> processOpenApiResponse(response, lineNumber))
                .onErrorMap(Exception.class, error ->
                        new RuntimeException("OpenAPI 호출 완전 실패: " + error.getMessage(), error));
    }

    /**
     *  OpenAPI 응답 처리
     */
    private List<TrainPosition> processOpenApiResponse(RealtimePositionResponse response, String lineNumber) {
        // 에러 응답 체크
        if (response.isAnyError()) {
            String errorMsg = response.getUnifiedErrorMessage();
            log.warn("OpenAPI 에러 응답: {}", errorMsg);
            throw new RuntimeException("API_ERROR: " + errorMsg);
        }

        // 빈 데이터 체크
        if (response.isEmpty()) {
            log.warn("OpenAPI 정상 응답이지만 데이터 없음 (심야시간대 등)");
            throw new RuntimeException("API_EMPTY: 운행 데이터 없음");
        }

        // 실제 데이터 변환
        List<RealtimePositionInfo> apiData = response.getRealtimePositionList();
        List<TrainPosition> trainPositions = apiData.stream()
                .map(this::convertApiDataToTrainPosition)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        log.info("OpenAPI 데이터 변환 완료: {}개 → {}대 열차", apiData.size(), trainPositions.size());
        return trainPositions;
    }

    /**
     *  OpenAPI 데이터 → TrainPosition 변환
     */
    private TrainPosition convertApiDataToTrainPosition(RealtimePositionInfo apiData) {
        try {
            return TrainPosition.builder()
                    .trainId(apiData.getTrainNo())
                    .lineNumber(Integer.valueOf(extractLineNumber(apiData.getSubwayId())))
                    .stationId(apiData.getStatnId())
                    .stationName(cleanStationName(apiData.getStatnNm()))
                    .frontendStationId(cleanStationName(apiData.getStatnNm()))
                    .direction(convertApiDirection(apiData.getUpdnLine()))
                    .lastUpdated(LocalDateTime.now())
                    .dataSource("SEOUL_OPENAPI")
                    .isRealtime(true)
                    .build();
        } catch (Exception e) {
            log.error("OpenAPI 데이터 변환 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     *  전체 노선 조회
     */
    public Mono<List<TrainPosition>> getAllLinesRealtime() {
        List<Mono<List<TrainPosition>>> requests = enabledLines.stream()
                .map(this::getRealtimePositions)
                .collect(Collectors.toList());

        return Mono.zip(requests, results -> {
            List<TrainPosition> allTrains = Arrays.stream(results)
                    .flatMap(result -> ((List<TrainPosition>) result).stream())
                    .collect(Collectors.toList());

            return allTrains;
        });
    }

    /**
     *  현실적인 Mock 데이터 생성
     */
    private Mono<List<TrainPosition>> createRealisticMockData(String lineNumber) {

        List<String> stations = getStationsForLine(lineNumber);
        int trainCount = getRealisticTrainCountForTime(lineNumber);

        List<TrainPosition> mockData = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < trainCount; i++) {
            String stationName = stations.get(random.nextInt(stations.size()));

            TrainPosition position = TrainPosition.builder()
                    .trainId(generateRealisticTrainId(lineNumber, i))
                    .lineNumber(Integer.parseInt(lineNumber))
                    .stationId("MOCK_" + lineNumber + String.format("%03d", i))
                    .stationName(stationName)
                    .frontendStationId(stationName)
                    .direction(random.nextBoolean() ? "up" : "down")
                    .lastUpdated(LocalDateTime.now().minusSeconds(random.nextInt(300)))
                    .dataSource("MOCK_REALISTIC")
                    .isRealtime(false)
                    .build();

            mockData.add(position);
        }

        return Mono.just(mockData);
    }

    // ===== 유틸리티 메서드들 =====

    /**
     * OpenAPI URL 생성
     */
    private String buildOpenApiUrl(String lineNumber) {
        // 서울시 지하철 실시간 위치 API URL 형식
        return String.format("%s/%s/json/realtimePosition/0/100/%s호선",
                baseUrl, apiKey, lineNumber);
    }

    /**
     * API 키 유효성 검사
     */
    private boolean isValidApiKey() {
        return apiKey != null &&
                !apiKey.trim().isEmpty() &&
                !apiKey.equals("test_key") &&
                !apiKey.equals("TEMP_KEY") &&
                apiKey.length() > 10; // 실제 API 키는 길이가 10자 이상
    }

    /**
     * API 키 마스킹 (로그용)
     */
    private String maskApiKey(String key) {
        if (key == null || key.length() < 8) {
            return "INVALID";
        }
        return key.substring(0, 4) + "****" + key.substring(key.length() - 4);
    }

    /**
     * 노선별 주요 역 목록
     */
    private List<String> getStationsForLine(String lineNumber) {
        Map<String, List<String>> stationsByLine = Map.of(
                "1", Arrays.asList("서울역", "종각", "시청", "용산", "영등포", "구로", "온수"),
                "2", Arrays.asList("을지로입구", "건대입구", "잠실", "강남", "사당", "홍대입구", "신촌"),
                "3", Arrays.asList("구파발", "불광", "독립문", "종로3가", "압구정", "교대", "양재"),
                "4", Arrays.asList("당고개", "창동", "혜화", "명동", "서울역", "사당")
        );
        return stationsByLine.getOrDefault(lineNumber, Arrays.asList("역1", "역2", "역3"));
    }

    /**
     * 시간대별 현실적인 열차 수
     */
    private int getRealisticTrainCountForTime(String lineNumber) {
        Map<String, Integer> baseCounts = Map.of("1", 8, "2", 12, "3", 7, "4", 6);
        int baseCount = baseCounts.getOrDefault(lineNumber, 5);

        int hour = LocalDateTime.now().getHour();
        if (hour >= 7 && hour <= 9 || hour >= 18 && hour <= 20) {
            return baseCount + 3; // 출퇴근시간 증가
        } else if (hour >= 0 && hour <= 5) {
            return Math.max(2, baseCount - 3); // 심야시간 감소
        }
        return baseCount;
    }

    /**
     * 현실적인 열차번호 생성
     */
    private String generateRealisticTrainId(String lineNumber, int index) {
        return String.format("%s%04d", lineNumber, 1000 + index);
    }

    /**
     * 역명 정제
     */
    private String cleanStationName(String stationName) {
        if (stationName == null) return "미정";
        return stationName.replaceAll("\\([^)]*\\)", "").trim();
    }

    /**
     * API 방향 데이터 변환
     */
    private String convertApiDirection(String updnLine) {
        if ("0".equals(updnLine)) return "up";
        if ("1".equals(updnLine)) return "down";
        return updnLine != null ? updnLine : "unknown";
    }

    /**
     * 지하철 ID에서 노선번호 추출
     */
    private String extractLineNumber(String subwayId) {
        if (subwayId == null || subwayId.length() < 4) {
            return "1";
        }
        try {
            return subwayId.substring(3, 4);
        } catch (Exception e) {
            return "1";
        }
    }

    /**
     * API 호출 카운트 증가
     */
    private void incrementCallCount() {
        int count = dailyCallCount.incrementAndGet();
        if (count % 10 == 0) {
            log.info("일일 OpenAPI 호출 수: {}", count);
        }
    }

    // ===== Getter 메서드들 =====

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

    /**
     * API 연결 상태 확인
     */
    public boolean isApiHealthy() {
        return apiEnabled && isValidApiKey();
    }

    /**
     * 시스템 상태 요약
     */
    public Map<String, Object> getSystemStatus() {
        return Map.of(
                "apiEnabled", apiEnabled,
                "validApiKey", isValidApiKey(),
                "dailyCalls", dailyCallCount.get(),
                "enabledLines", enabledLines,
                "baseUrl", baseUrl,
                "timeout", timeoutMs
        );
    }
}