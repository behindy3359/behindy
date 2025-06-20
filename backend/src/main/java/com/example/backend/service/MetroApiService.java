package com.example.backend.service;

import com.example.backend.dto.metro.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

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
     * 실시간 도착정보 조회 (특정 역)
     */
    public Mono<List<RealtimeArrivalInfo>> getRealtimeArrival(String stationName) {
        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            return createMockArrivalData(stationName);
        }

        String url = buildUrl("realtimeStationArrival", stationName);

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatus::isError, response -> {
                    log.error("API 호출 오류: {} - {}", response.statusCode(), url);
                    return Mono.error(new RuntimeException("API 호출 실패: " + response.statusCode()));
                })
                .bodyToMono(RealtimeArrivalResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .retryWhen(Retry.fixedDelay(retryCount, Duration.ofSeconds(1)))
                .map(response -> {
                    incrementCallCount();

                    if (response.getMetroErrorMessage() != null && response.getMetroErrorMessage().getStatus() != null) {
                        log.error("API 에러 응답: {}", response.getMetroErrorMessage().getMessage());
                        return new ArrayList<>();
                    }

                    List<RealtimeArrivalInfo> result = response.getRealtimeArrivalList();
                    log.info("실시간 도착정보 조회 성공: {} - {}건", stationName, result != null ? result.size() : 0);
                    return result != null ? result : new ArrayList<>();
                })
                .onErrorResume(error -> {
                    log.error("실시간 도착정보 조회 실패: {} - {}", stationName, error.getMessage());
                    return createMockArrivalData(stationName);
                });
    }

    /**
     * 실시간 위치정보 조회 (특정 노선)
     */
    public Mono<List<RealtimePositionInfo>> getRealtimePosition(String lineNumber) {
        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            return createMockPositionData(lineNumber);
        }

        String url = buildUrl("realtimePosition", lineNumber);

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatus::isError, response -> {
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
                        return new ArrayList<>();
                    }

                    List<RealtimePositionInfo> result = response.getRealtimePositionList();
                    log.info("실시간 위치정보 조회 성공: {}호선 - {}건", lineNumber, result != null ? result.size() : 0);
                    return result != null ? result : new ArrayList<>();
                })
                .onErrorResume(error -> {
                    log.error("실시간 위치정보 조회 실패: {}호선 - {}", lineNumber, error.getMessage());
                    return createMockPositionData(lineNumber);
                });
    }

    /**
     * 활성화된 노선들의 실시간 데이터 조회 (1-4호선만)
     */
    public Mono<List<MetroRealtimeDto>> getAllLinesRealtime() {
        List<Mono<List<RealtimePositionInfo>>> requests = new ArrayList<>();

        // 🎯 활성화된 노선만 요청 (1-4호선)
        for (String lineNumber : enabledLines) {
            requests.add(getRealtimePosition(lineNumber));
        }

        return Mono.zip(requests, results -> {
            List<MetroRealtimeDto> allTrains = new ArrayList<>();

            for (int i = 0; i < results.length; i++) {
                @SuppressWarnings("unchecked")
                List<RealtimePositionInfo> lineData = (List<RealtimePositionInfo>) results[i];

                for (RealtimePositionInfo position : lineData) {
                    MetroRealtimeDto dto = convertToRealtimeDto(position);
                    allTrains.add(dto);
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
     * RealtimePositionInfo를 MetroRealtimeDto로 변환
     */
    private MetroRealtimeDto convertToRealtimeDto(RealtimePositionInfo position) {
        return MetroRealtimeDto.builder()
                .trainNo(position.getTrainNo())
                .subwayLine(extractLineNumber(position.getSubwayId()))
                .subwayLineId(position.getSubwayId())
                .currentStation(position.getStatnNm())
                .direction(position.getUpdnLine())
                .stationId(position.getStatnId())
                .trainStatus("운행중")
                .lastUpdated(LocalDateTime.now())
                .dataTime(parseRecptnDt(position.getRecptnDt()))
                .isRealtime(true)
                .isLastTrain("Y".equals(position.getLstcarAt()))
                .dataSource("API")
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
     * recptnDt 파싱 (YYYY-MM-DD HH:mm:ss)
     */
    private LocalDateTime parseRecptnDt(String recptnDt) {
        try {
            if (recptnDt == null || recptnDt.length() < 19) {
                return LocalDateTime.now();
            }
            // "2025-06-21 14:30:00" 형식으로 파싱
            return LocalDateTime.parse(recptnDt.replace(" ", "T"));
        } catch (Exception e) {
            log.warn("recptnDt 파싱 실패: {} - {}", recptnDt, e.getMessage());
            return LocalDateTime.now();
        }
    }

    // ===== Mock 데이터 생성 =====

    /**
     * Mock 도착정보 데이터 생성 (API 키 없을 때)
     */
    private Mono<List<RealtimeArrivalInfo>> createMockArrivalData(String stationName) {
        List<RealtimeArrivalInfo> mockData = new ArrayList<>();

        // 상행/하행 각각 1개씩 Mock 데이터
        for (int i = 0; i < 2; i++) {
            RealtimeArrivalInfo mock = RealtimeArrivalInfo.builder()
                    .subwayId("100" + (i + 1))
                    .subwayNm((i + 1) + "호선")
                    .statnNm(stationName)
                    .trainLineNm(i == 0 ? "상행" : "하행")
                    .subwayHeading(i == 0 ? "상행" : "하행")
                    .btrainSttus(i == 0 ? "진입" : "접근")
                    .barvlDt(String.valueOf((i + 1) * 60)) // 60초, 120초
                    .btrainNo("MOCK-" + (1000 + i))
                    .bstatnNm(stationName)
                    .recptnDt(LocalDateTime.now().toString())
                    .arvlMsg2("곧 도착")
                    .build();
            mockData.add(mock);
        }

        log.info("Mock 도착정보 데이터 생성: {} - {}건", stationName, mockData.size());
        return Mono.just(mockData);
    }

    /**
     * Mock 위치정보 데이터 생성 (API 키 없을 때)
     */
    private Mono<List<RealtimePositionInfo>> createMockPositionData(String lineNumber) {
        List<RealtimePositionInfo> mockData = new ArrayList<>();

        // 해당 노선에 3대의 Mock 열차 생성
        String[] stations = {"종각", "시청", "을지로입구", "동대문", "동대문역사문화공원"};

        for (int i = 0; i < 3; i++) {
            RealtimePositionInfo mock = RealtimePositionInfo.builder()
                    .subwayId("100" + lineNumber)
                    .subwayNm(lineNumber + "호선")
                    .statnId("MOCK_ST_" + lineNumber + "_" + i)
                    .statnNm(stations[i % stations.length])
                    .trainNo("MOCK-" + lineNumber + "-" + (1000 + i))
                    .recptnDt(LocalDateTime.now().toString())
                    .lastRecptnDt(LocalDateTime.now().toString())
                    .updnLine(i % 2 == 0 ? "상행" : "하행")
                    .statnTid(String.valueOf(i + 1))
                    .directAt("N")
                    .lstcarAt(i == 2 ? "Y" : "N") // 마지막 열차는 막차로 설정
                    .build();
            mockData.add(mock);
        }

        log.info("Mock 위치정보 데이터 생성: {}호선 - {}건", lineNumber, mockData.size());
        return Mono.just(mockData);
    }
}