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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

    // 🎯 사용할 노선 목록 (1-4호선만)
    @Value("${seoul.metro.api.enabled-lines:1,2,3,4}")
    private String enabledLinesConfig;

    private final WebClient webClient;
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);

    // 활성화된 노선 목록 캐시
    private List<String> enabledLines;

    // WebClient 빈 설정
    public MetroApiService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024)) // 1MB
                .build();
    }

    /**
     * 초기화 메서드 - 활성화된 노선 목록 파싱
     */
    @PostConstruct
    public void init() {
        this.enabledLines = Arrays.stream(enabledLinesConfig.split(","))
                .map(String::trim)
                .filter(line -> line.matches("\\d+"))
                .collect(Collectors.toList());

        log.info("🚇 활성화된 지하철 노선: {}", enabledLines);
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
     * 실시간 위치정보 조회 (특정 노선) - 단순화된 버전
     */
    public Mono<List<RealtimePositionInfo>> getRealtimePosition(String lineNumber) {
        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            return createMockPositionData(lineNumber);
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
                    return createMockPositionData(lineNumber);
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

    /**
     * RealtimePositionInfo를 TrainPosition으로 변환 - 단순화된 버전
     */
    private TrainPosition convertToTrainPosition(RealtimePositionInfo position) {
        return TrainPosition.builder()
                .trainId(position.getTrainNo())
                .lineNumber(Integer.valueOf(extractLineNumber(position.getSubwayId())))
                .stationId(position.getStatnId())
                .stationName(position.getStatnNm())
                .direction(convertDirection(position.getUpdnLine()))
                .x(50.0 + Math.random() * 100) // 임시 좌표 (실제로는 역 좌표 매핑 필요)
                .y(25.0 + Math.random() * 50)
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

    // ===== Mock 데이터 생성 (단순화) =====

    /**
     * Mock 위치정보 데이터 생성 (API 키 없을 때) - 단순화된 버전
     */
    private Mono<List<RealtimePositionInfo>> createMockPositionData(String lineNumber) {
        List<RealtimePositionInfo> mockData = new ArrayList<>();

        // 해당 노선에 적정 수의 Mock 열차 생성
        int trainCount = getTrainCountForLine(Integer.parseInt(lineNumber));
        String[] stations = getStationsForLine(Integer.parseInt(lineNumber));

        for (int i = 0; i < trainCount; i++) {
            RealtimePositionInfo mock = RealtimePositionInfo.builder()
                    .subwayId("100" + lineNumber)
                    .subwayNm(lineNumber + "호선")
                    .statnId("MOCK_ST_" + lineNumber + "_" + i)
                    .statnNm(stations[i % stations.length])
                    .trainNo("MOCK-" + lineNumber + "-" + (1000 + i))
                    .recptnDt(LocalDateTime.now().toString())
                    .lastRecptnDt(LocalDateTime.now().toString())
                    .updnLine(i % 2 == 0 ? "0" : "1") // 상행/하행 번갈아
                    .statnTid(String.valueOf(i + 1))
                    .directAt("N")
                    .lstcarAt(i == trainCount - 1 ? "Y" : "N") // 마지막 열차는 막차로 설정
                    .build();
            mockData.add(mock);
        }

        log.info("Mock 위치정보 데이터 생성: {}호선 - {}건", lineNumber, mockData.size());
        return Mono.just(mockData);
    }

    /**
     * 노선별 적정 열차 수 반환
     */
    private int getTrainCountForLine(int lineNumber) {
        switch (lineNumber) {
            case 1: return 10;
            case 2: return 15; // 순환선이라 많음
            case 3: return 9;
            case 4: return 8;
            default: return 5;
        }
    }

    /**
     * 노선별 주요 역명 반환
     */
    private String[] getStationsForLine(int lineNumber) {
        switch (lineNumber) {
            case 1: return new String[]{"종각", "시청", "을지로입구", "동대문", "동묘앞"};
            case 2: return new String[]{"강남", "역삼", "선릉", "삼성", "건대입구", "홍대입구"};
            case 3: return new String[]{"대치", "도곡", "매봉", "양재", "남부터미널"};
            case 4: return new String[]{"명동", "회현", "서울역", "숙대입구", "삼각지"};
            default: return new String[]{"테스트역"};
        }
    }
}