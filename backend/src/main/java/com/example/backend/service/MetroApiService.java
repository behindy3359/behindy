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

        log.info("=== API 서비스 초기화 ===");
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
    /**
     * 실시간 위치정보 조회 (특정 노선) - 에러 처리 개선
     */
    public Mono<List<RealtimePositionInfo>> getRealtimePosition(String lineNumber) {
        log.info("===  지하철 API 호출 시작 ===");

        if (!apiEnabled || "TEMP_KEY".equals(apiKey)) {
            log.warn(" API 비활성화 또는 임시 키: apiEnabled={}, apiKey={}...",
                    apiEnabled, apiKey.substring(0, Math.min(8, apiKey.length())));
            return createCleanMockPositionData(lineNumber);
        }

        // 1. 요청 로깅
        String url = buildUrl("realtimePosition", lineNumber + "호선");
        log.info("요청 URL: {}", url);
        log.info("요청 시간: {}", LocalDateTime.now());

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error(" HTTP 에러: {} - {}", response.statusCode(), url);
                    return Mono.error(new RuntimeException("API 호출 실패: " + response.statusCode()));
                })
                .bodyToMono(RealtimePositionResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .retryWhen(Retry.fixedDelay(retryCount, Duration.ofSeconds(1)))
                .map(response -> {
                    // 2. 응답 분석 로깅
                    log.info("=== API 응답 분석 ===");
                    incrementCallCount();
                    log.info("HTTP 응답 수신 완료");

                    //  3-1. 직접 에러 응답 체크
                    if (response.isDirectError()) {
                        log.warn("   직접 에러 응답 감지:");
                        log.warn("   Status: {}, Code: {}", response.getDirectStatus(), response.getDirectCode());
                        log.warn("   Message: {}", response.getDirectMessage());
                        log.warn("   Total: {}", response.getDirectTotal());

                        //  Mock 데이터 생성을 위한 예외 발생
                        throw new RuntimeException("API_DIRECT_ERROR: " + response.getUnifiedErrorMessage());
                    }

                    // 3-2. 래퍼 에러 응답 체크
                    if (response.isWrapperError()) {
                        MetroErrorMessage errorMsg = response.getMetroErrorMessage();
                        log.warn("   래퍼 에러 응답 감지:");
                        log.warn("   Status: {}, Code: {}", errorMsg.getStatus(), errorMsg.getCode());
                        log.warn("   Message: {}", errorMsg.getMessage());

                        throw new RuntimeException("API_WRAPPER_ERROR: " + response.getUnifiedErrorMessage());
                    }

                    // 3-3. 정상 응답이지만 데이터 비어있음 체크 (핵심 추가!)
                    if (response.isEmpty()) {
                        log.warn("   정상 응답이지만 데이터가 비어있음 (심야시간/운행중단 등)");
                        log.warn("   현재 시간: {}", LocalDateTime.now());
                        log.warn("   노선: {}호선", lineNumber);

                        //  Mock 데이터 생성을 위한 예외 발생
                        throw new RuntimeException("API_EMPTY_DATA: 해당 시간대 운행 데이터 없음");
                    }

                    // 4. 정상 데이터 처리
                    List<RealtimePositionInfo> positionList = response.getRealtimePositionList();

                    // 데이터 품질 체크
                    long validTrains = positionList.stream()
                            .filter(train -> train.getTrainNo() != null && !train.getTrainNo().trim().isEmpty())
                            .filter(train -> train.getStatnNm() != null && !train.getStatnNm().trim().isEmpty())
                            .count();

                    log.info("   정상 데이터 수신:");
                    log.info("   전체 열차: {}대", positionList.size());
                    log.info("   유효 열차: {}대", validTrains);

                    // 상행/하행 분포
                    long upTrains = positionList.stream()
                            .filter(train -> "0".equals(train.getUpdnLine()))
                            .count();
                    long downTrains = positionList.stream()
                            .filter(train -> "1".equals(train.getUpdnLine()))
                            .count();

                    log.info("   방향별 분포: 상행={}대, 하행={}대", upTrains, downTrains);
                    log.info("=== API 데이터 처리 완료 ===");

                    return positionList;
                })
                .onErrorResume(error -> {
                    log.error("=== API 호출 실패 또는 데이터 없음 ===");
                    log.error(" 오류 유형: {}", error.getClass().getSimpleName());
                    log.error(" 오류 내용: {}", error.getMessage());

                    // 🎯 오류 유형별 분류
                    if (error.getMessage().contains("API_DIRECT_ERROR")) {
                        log.error(" → 직접 에러 응답 (status != 200)");
                    } else if (error.getMessage().contains("API_WRAPPER_ERROR")) {
                        log.error(" → 래퍼 에러 응답 (errorMessage)");
                    } else if (error.getMessage().contains("API_EMPTY_DATA")) {
                        log.warn(" → 정상 응답이지만 데이터 없음 (심야시간 등)");
                    } else {
                        log.error(" → 네트워크 또는 기타 오류");
                    }

                    log.info(" Mock 데이터로 대체 생성");
                    return createCleanMockPositionData(lineNumber);
                });
    }
    /**
     * 변환 과정 로깅
     */
    private TrainPosition convertToTrainPositionWithLogging(RealtimePositionInfo position, String lineNumber) {
        try {
            TrainPosition result = TrainPosition.builder()
                    .trainId(position.getTrainNo())
                    .lineNumber(Integer.valueOf(extractLineNumber(position.getSubwayId())))
                    .stationId(position.getStatnId())
                    .stationName(position.getStatnNm())
                    .direction(convertDirection(position.getUpdnLine()))
                    .x(null)
                    .y(null)
                    .lastUpdated(LocalDateTime.now())
                    .dataSource("API")
                    .isRealtime(true)
                    .build();

            return result;

        } catch (Exception e) {
            log.error(" 변환 실패: TrainNo={}, Error={}",
                    position.getTrainNo(), e.getMessage());
            return null;
        }
    }

    /**
     * getAllLinesRealtime 메서드에도 로깅 추가
     */
    public Mono<List<TrainPosition>> getAllLinesRealtime() {
        log.info("===  전체 노선 실시간 데이터 조회 시작 ===");
        log.info(" 활성 노선: {}", enabledLines);

        List<Mono<List<RealtimePositionInfo>>> requests = new ArrayList<>();

        for (String lineNumber : enabledLines) {
            requests.add(getRealtimePosition(lineNumber));
        }

        return Mono.zip(requests, results -> {
            log.info("===  전체 노선 데이터 통합 처리 ===");

            List<TrainPosition> allTrains = new ArrayList<>();
            Map<String, Integer> lineStats = new HashMap<>();

            for (int i = 0; i < results.length; i++) {
                String currentLine = enabledLines.get(i);

                @SuppressWarnings("unchecked")
                List<RealtimePositionInfo> lineData = (List<RealtimePositionInfo>) results[i];

                log.info(" {}호선: 수신={}건", currentLine, lineData.size());

                int successCount = 0;
                int failCount = 0;

                for (RealtimePositionInfo position : lineData) {
                    TrainPosition trainPosition = convertToTrainPositionWithLogging(position, currentLine);
                    if (trainPosition != null) {
                        allTrains.add(trainPosition);
                        successCount++;
                    } else {
                        failCount++;
                    }
                }

                lineStats.put(currentLine, successCount);
                log.info(" {}호선 변환: 성공={}건, 실패={}건", currentLine, successCount, failCount);
            }

            log.info("===  전체 처리 완료 ===");
            log.info("   최종 결과:");
            log.info("   - 총 노선: {}개", enabledLines.size());
            log.info("   - 총 열차: {}대", allTrains.size());
            log.info("   - 노선별 현황: {}", lineStats);

            return allTrains;
        });
    }
    /**
     *   Mock 데이터 생성
     */
    private Mono<List<RealtimePositionInfo>> createCleanMockPositionData(String lineNumber) {
        log.info("===  Mock 데이터 생성 시작 ===");
        log.info("대상 노선: {}호선", lineNumber);
        log.info("생성 이유: API 데이터 없음 또는 오류");

        List<RealtimePositionInfo> mockData = new ArrayList<>();

        // 해당 노선의 역 정보 필터링
        List<CleanStationInfo> lineStations = STATION_DATA.stream()
                .filter(station -> lineNumber.equals(station.getLineNumber()))
                .collect(Collectors.toList());

        if (lineStations.isEmpty()) {
            return Mono.just(new ArrayList<>());
        }

        //  시간대별 현실적 열차 수 계산
        int baseTrainCount = getTrainCountForLine(Integer.parseInt(lineNumber));
        int adjustedTrainCount = adjustTrainCountByTime(baseTrainCount);

        LocalTime currentTime = LocalTime.now();
        String timeCategory = getTimeCategory(currentTime);

        Random random = new Random();

        for (int i = 0; i < adjustedTrainCount; i++) {
            CleanStationInfo station = getDistributedStation(lineStations, i, adjustedTrainCount);
            String direction = getRealisticDirection(random);

            //  현실적인 열차 번호 생성
            String trainNumber = generateRealisticTrainNumber(lineNumber, i, currentTime);

            RealtimePositionInfo mock = RealtimePositionInfo.builder()
                    .subwayId("100" + lineNumber)
                    .subwayNm(lineNumber + "호선")
                    .statnId(station.getApiId())
                    .statnNm(station.getName())
                    .trainNo(trainNumber)
                    .recptnDt(generateRealisticTime())
                    .lastRecptnDt(LocalDateTime.now().minusSeconds(random.nextInt(120)).toString())
                    .updnLine(direction)
                    .statnTid(String.valueOf(i + 1))
                    .directAt("N")
                    .lstcarAt(i == adjustedTrainCount - 1 ? "Y" : "N") // 마지막 차량만 막차 표시
                    .build();

            mockData.add(mock);
        }

        log.info("=== {}호선 Mock 데이터 생성 완료 ===", lineNumber);
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
     *  시간대별 열차 수 조정
     */
    private int adjustTrainCountByTime(int baseCount) {
        LocalTime now = LocalTime.now();
        int hour = now.getHour();

        if (hour >= 6 && hour <= 9) {
            // 출근시간: +50% 증가
            int increase = Math.max(2, baseCount / 2);
            return baseCount + increase;
        } else if (hour >= 18 && hour <= 21) {
            // 퇴근시간: +30% 증가
            int increase = Math.max(1, baseCount / 3);
            return baseCount + increase;
        } else if (hour >= 23 || hour <= 5) {
            // 심야시간: -60% 감소
            int decrease = Math.max(baseCount * 3 / 5, 2); // 최소 2대는 유지
            return decrease;
        } else if (hour >= 10 && hour <= 15) {
            // 한가한 시간: -20% 감소
            int decrease = Math.max(baseCount - baseCount / 5, baseCount / 2);
            return decrease;
        }

        return baseCount;
    }

    /**
     *  현실적인 열차 번호 생성
     */
    private String generateRealisticTrainNumber(String lineNumber, int index, LocalTime currentTime) {
        // 심야시간에는 특별한 접두사 사용
        if (currentTime.getHour() >= 23 || currentTime.getHour() <= 5) {
            return String.format("N%s%03d", lineNumber, 100 + index); // N1001, N1002...
        }

        // 일반시간
        return String.format("%s%04d", lineNumber, 1000 + index); // 11001, 11002...
    }

    /**
     *  현실적인 수신 시간 생성
     */
    private String generateRealisticTime() {
        LocalDateTime base = LocalDateTime.now();
        // 0~180초 전 시간으로 랜덤 생성
        int secondsAgo = new Random().nextInt(180);
        return base.minusSeconds(secondsAgo).toString();
    }

    /**
     *  시간대 구분 반환
     */
    private String getTimeCategory(LocalTime time) {
        int hour = time.getHour();

        if (hour >= 6 && hour <= 9) return "출근러시";
        if (hour >= 18 && hour <= 21) return "퇴근러시";
        if (hour >= 23 || hour <= 5) return "심야시간";
        if (hour >= 10 && hour <= 15) return "한가한시간";
        return "일반시간";
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
                .stationId(position.getStatnId())
                .stationName(position.getStatnNm())
                .direction(convertDirection(position.getUpdnLine()))
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