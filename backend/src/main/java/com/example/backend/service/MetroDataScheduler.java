package com.example.backend.service;

import com.example.backend.dto.metro.TrainPosition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 지하철 데이터 스케줄러 (최종 버전)
 * 새로운 서비스 구조에 맞게 완전히 재작성
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetroDataScheduler {

    private final MetroApiService metroApiService;
    private final MetroCacheService metroCacheService;

    @Value("${seoul.metro.api.enabled:true}")
    private boolean apiEnabled;

    @Value("${seoul.metro.monitoring.daily-limit:950}")
    private int dailyLimit;

    private final AtomicBoolean isUpdating = new AtomicBoolean(false);
    private LocalDateTime lastSuccessfulUpdate = null;
    private int consecutiveFailures = 0;
    private static final int MAX_CONSECUTIVE_FAILURES = 5;

    /**
     * 애플리케이션 시작 시 초기 데이터 로드
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("=== 지하철 실시간 위치 시스템 시작 ===");
        log.info("API 활성화: {}", apiEnabled);
        log.info("일일 API 호출 제한: {}", dailyLimit);

        // 5초 후 첫 번째 업데이트 실행
        new Thread(() -> {
            try {
                Thread.sleep(5000);
                updateAllMetroPositions();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    /**
     * 주기적 지하철 위치 데이터 업데이트 (2분 간격)
     */
    @Scheduled(fixedRateString = "${seoul.metro.api.update-interval:120000}") // 기본 2분
    public void scheduledUpdate() {
        updateAllMetroPositions();
    }

    /**
     * 전체 지하철 위치 데이터 업데이트
     */
    public void updateAllMetroPositions() {
        if (!apiEnabled) {
            log.debug("API가 비활성화되어 있어 업데이트를 건너뜁니다.");
            return;
        }

        // 중복 업데이트 방지
        if (!isUpdating.compareAndSet(false, true)) {
            log.warn("이미 업데이트가 진행 중입니다. 건너뜁니다.");
            return;
        }

        try {
            log.info("=== 지하철 위치 데이터 업데이트 시작 ===");

            // API 호출 한도 확인
            if (!checkApiLimit()) {
                return;
            }

            // 전체 노선 위치 데이터 업데이트
            metroApiService.getAllLinesRealtime()
                    .subscribe(
                            this::handleSuccessfulUpdate,
                            this::handleFailedUpdate
                    );

        } catch (Exception e) {
            handleFailedUpdate(e);
        } finally {
            isUpdating.set(false);
        }
    }

    /**
     * 특정 노선 데이터 업데이트
     */
    public void updateLineData(String lineNumber) {
        if (!apiEnabled) {
            log.debug("API가 비활성화되어 있어 {}호선 업데이트를 건너뜁니다.", lineNumber);
            return;
        }

        if (!checkApiLimit()) {
            return;
        }

        log.info("{}호선 위치 데이터 업데이트 시작", lineNumber);

        metroApiService.getRealtimePosition(lineNumber)
                .subscribe(
                        positions -> {
                            List<TrainPosition> trains = positions.stream()
                                    .map(this::convertToTrainPosition)
                                    .toList();

                            metroCacheService.cacheLinePositions(lineNumber, trains);
                            log.info("{}호선 위치 데이터 업데이트 완료: {}대 열차", lineNumber, trains.size());
                        },
                        error -> {
                            log.error("{}호선 위치 데이터 업데이트 실패: {}", lineNumber, error.getMessage());
                            handleLineUpdateFailure(lineNumber, error);
                        }
                );
    }

    /**
     * 성공적인 업데이트 처리
     */
    private void handleSuccessfulUpdate(List<TrainPosition> allTrains) {
        try {
            // 전체 데이터 캐시
            metroCacheService.cacheAllPositions(allTrains);

            // 활성화된 노선별로 분리하여 캐시
            for (String lineNum : metroApiService.getEnabledLines()) {
                List<TrainPosition> lineTrains = allTrains.stream()
                        .filter(train -> lineNum.equals(String.valueOf(train.getLineNumber())))
                        .toList();

                metroCacheService.cacheLinePositions(lineNum, lineTrains);
            }

            // 업데이트 성공 기록
            lastSuccessfulUpdate = LocalDateTime.now();
            consecutiveFailures = 0;

            metroCacheService.setLastUpdateTime(lastSuccessfulUpdate);
            metroCacheService.cacheHealthStatus("HEALTHY",
                    String.format("정상 업데이트 완료. 활성 노선: %s, 총 %d대 열차",
                            metroApiService.getEnabledLines(), allTrains.size()));

            log.info("=== 지하철 위치 데이터 업데이트 성공: {}개 노선, {}대 열차, API 호출 수: {}/{} ===",
                    metroApiService.getEnabledLines().size(), allTrains.size(),
                    metroApiService.getDailyCallCount(), dailyLimit);

        } catch (Exception e) {
            log.error("성공적인 업데이트 후처리 중 오류: {}", e.getMessage(), e);
        }
    }

    /**
     * 실패한 업데이트 처리
     */
    private void handleFailedUpdate(Throwable error) {
        consecutiveFailures++;

        String errorMsg = String.format("업데이트 실패 (%d/%d): %s",
                consecutiveFailures, MAX_CONSECUTIVE_FAILURES, error.getMessage());

        log.error(errorMsg, error);

        // 연속 실패 시 알림 및 대응
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            handleCriticalFailure();
        } else {
            metroCacheService.cacheHealthStatus("WARNING", errorMsg);
        }
    }

    /**
     * 특정 노선 업데이트 실패 처리
     */
    private void handleLineUpdateFailure(String lineNumber, Throwable error) {
        String errorMsg = String.format("%s호선 업데이트 실패: %s", lineNumber, error.getMessage());
        log.error(errorMsg, error);

        // 기존 캐시 데이터 유지 (만료되지 않았다면)
        MetroCacheService.PositionCacheData existingData = metroCacheService.getLinePositions(lineNumber);
        if (existingData != null && metroCacheService.isCacheValid(existingData)) {
            log.info("{}호선 기존 캐시 데이터 유지", lineNumber);
        }
    }

    /**
     * 심각한 오류 상황 처리
     */
    private void handleCriticalFailure() {
        String criticalMsg = String.format("연속 %d회 업데이트 실패. 시스템 점검 필요.", MAX_CONSECUTIVE_FAILURES);

        log.error("=== 심각한 오류: {} ===", criticalMsg);
        metroCacheService.cacheHealthStatus("CRITICAL", criticalMsg);
    }

    /**
     * API 호출 한도 확인
     */
    private boolean checkApiLimit() {
        int currentCalls = metroApiService.getDailyCallCount();

        if (currentCalls >= dailyLimit) {
            log.warn("일일 API 호출 한도 도달: {}/{}", currentCalls, dailyLimit);
            metroCacheService.cacheHealthStatus("LIMITED", "일일 API 호출 한도 도달");
            return false;
        }

        if (currentCalls >= dailyLimit * 0.9) { // 90% 도달 시 경고
            log.warn("일일 API 호출 한도 임박: {}/{}", currentCalls, dailyLimit);
        }

        return true;
    }

    /**
     * RealtimePositionInfo를 TrainPosition으로 변환
     */
    private TrainPosition convertToTrainPosition(com.example.backend.dto.metro.RealtimePositionInfo position) {
        return TrainPosition.builder()
                .trainId(position.getTrainNo())
                .lineNumber(Integer.valueOf(extractLineNumber(position.getSubwayId())))
                .stationId(position.getStatnId())
                .stationName(position.getStatnNm())
                .direction(convertDirection(position.getUpdnLine()))
                .x(50.0 + Math.random() * 100) // 임시 좌표
                .y(25.0 + Math.random() * 50)
                .lastUpdated(LocalDateTime.now())
                .dataSource("API")
                .isRealtime(true)
                .build();
    }

    /**
     * 지하철 호선ID에서 노선 번호 추출
     */
    private String extractLineNumber(String subwayId) {
        if (subwayId == null || subwayId.length() < 4) return "1";
        return subwayId.substring(3);
    }

    /**
     * 상하행 구분 변환
     */
    private String convertDirection(String updnLine) {
        if ("0".equals(updnLine)) return "up";   // 상행
        if ("1".equals(updnLine)) return "down"; // 하행
        return "up"; // 기본값
    }

    /**
     * 매일 자정 API 호출 카운트 초기화
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyApiCount() {
        metroApiService.resetDailyCallCount();
        consecutiveFailures = 0;

        log.info("=== 일일 API 카운트 초기화 및 시스템 상태 리셋 ===");
        metroCacheService.cacheHealthStatus("RESET", "일일 시스템 상태 초기화 완료");
    }

    /**
     * 매시간 시스템 상태 점검
     */
    @Scheduled(cron = "0 0 * * * *") // 매시간 정각
    public void hourlyHealthCheck() {
        log.info("=== 시간별 시스템 상태 점검 ===");

        try {
            // 캐시 통계 조회
            MetroCacheService.CacheStatistics stats = metroCacheService.getCacheStatistics();

            // API 호출 현황
            int currentCalls = metroApiService.getDailyCallCount();
            double usagePercentage = (double) currentCalls / dailyLimit * 100;

            // 마지막 업데이트 시간 확인
            LocalDateTime lastUpdate = metroCacheService.getLastUpdateTime();
            boolean isDataFresh = lastUpdate != null &&
                    lastUpdate.isAfter(LocalDateTime.now().minusMinutes(10));

            // 상태 판정
            String healthStatus;
            String healthDetails;

            if (!isDataFresh) {
                healthStatus = "WARNING";
                healthDetails = String.format("데이터가 오래됨. 마지막 업데이트: %s", lastUpdate);
            } else if (usagePercentage > 95) {
                healthStatus = "LIMITED";
                healthDetails = String.format("API 사용량 위험: %.1f%% (%d/%d)",
                        usagePercentage, currentCalls, dailyLimit);
            } else if (consecutiveFailures > 0) {
                healthStatus = "WARNING";
                healthDetails = String.format("연속 실패 %d회", consecutiveFailures);
            } else {
                healthStatus = "HEALTHY";
                healthDetails = String.format("정상 운영중. API 사용량: %.1f%%, 활성 캐시: %d개",
                        usagePercentage, stats.getActiveLinesCaches());
            }

            metroCacheService.cacheHealthStatus(healthStatus, healthDetails);

            log.info("시스템 상태: {} - {}", healthStatus, healthDetails);
            log.info("캐시 통계: 활성 {}개, 열차 {}대, 전체캐시: {}",
                    stats.getActiveLinesCaches(), stats.getTotalTrains(), stats.isHasAllPositionsCache());

        } catch (Exception e) {
            log.error("시간별 상태 점검 실패: {}", e.getMessage(), e);
            metroCacheService.cacheHealthStatus("ERROR", "상태 점검 실패: " + e.getMessage());
        }
    }

    /**
     * 수동 업데이트 트리거 (관리자용)
     */
    public void manualUpdate() {
        log.info("=== 수동 업데이트 요청 ===");
        updateAllMetroPositions();
    }

    /**
     * 특정 노선 수동 업데이트 (관리자용)
     */
    public void manualLineUpdate(String lineNumber) {
        log.info("=== {}호선 수동 업데이트 요청 ===", lineNumber);
        updateLineData(lineNumber);
    }

    /**
     * 긴급 캐시 클리어 (관리자용)
     */
    public void emergencyCacheClear() {
        log.warn("=== 긴급 캐시 클리어 실행 ===");
        metroCacheService.evictAllMetroCache();
        consecutiveFailures = 0;

        // 즉시 새 데이터 로드 시도
        updateAllMetroPositions();

        log.info("긴급 캐시 클리어 및 재로드 완료");
    }

    /**
     * 시스템 상태 조회
     */
    public SystemStatus getSystemStatus() {
        MetroCacheService.HealthStatus health = metroCacheService.getHealthStatus();
        MetroCacheService.CacheStatistics stats = metroCacheService.getCacheStatistics();

        return SystemStatus.builder()
                .healthStatus(health.getStatus())
                .healthDetails(health.getDetails())
                .lastHealthCheck(health.getTimestamp())
                .lastSuccessfulUpdate(lastSuccessfulUpdate)
                .lastUpdateTime(metroCacheService.getLastUpdateTime())
                .consecutiveFailures(consecutiveFailures)
                .dailyApiCalls(metroApiService.getDailyCallCount())
                .dailyApiLimit(dailyLimit)
                .apiUsagePercentage((double) metroApiService.getDailyCallCount() / dailyLimit * 100)
                .activeCaches(stats.getActiveLinesCaches())
                .totalTrains(stats.getTotalTrains())
                .hasAllPositionsCache(stats.isHasAllPositionsCache())
                .isUpdating(isUpdating.get())
                .apiEnabled(apiEnabled)
                .build();
    }

    // === 내부 클래스 ===

    @lombok.Data
    @lombok.Builder
    public static class SystemStatus {
        private String healthStatus;
        private String healthDetails;
        private LocalDateTime lastHealthCheck;
        private LocalDateTime lastSuccessfulUpdate;
        private LocalDateTime lastUpdateTime;
        private int consecutiveFailures;
        private int dailyApiCalls;
        private int dailyApiLimit;
        private double apiUsagePercentage;
        private int activeCaches;
        private int totalTrains;
        private boolean hasAllPositionsCache;
        private boolean isUpdating;
        private boolean apiEnabled;
    }
}