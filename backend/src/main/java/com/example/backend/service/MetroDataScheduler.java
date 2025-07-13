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
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 지하철 데이터 스케줄러
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetroDataScheduler {

    private final MetroApiService metroApiService;
    private final MetroCacheService metroCacheService;
    private final MetroStationFilter stationFilter;

    @Value("${seoul.metro.api.enabled:true}")
    private boolean apiEnabled;

    @Value("${seoul.metro.monitoring.daily-limit:950}")
    private int dailyLimit;

    private final AtomicBoolean isUpdating = new AtomicBoolean(false);
    private LocalDateTime lastSuccessfulUpdate = null;
    private int consecutiveFailures = 0;
    private static final int MAX_CONSECUTIVE_FAILURES = 5;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("=== 지하철 실시간 위치 시스템 시작 ===");
        log.info("API 활성화: {}", apiEnabled);
        log.info("프론트엔드 역 필터링: {}개 역", stationFilter.getFrontendStationIds().size());

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

    @Scheduled(fixedRateString = "${seoul.metro.api.update-interval:240000}")
    public void scheduledUpdate() {
        updateAllMetroPositions();
    }

    /**
     *  전체 지하철 위치 데이터 업데이트
     */
    public void updateAllMetroPositions() {
        if (!apiEnabled) {
            log.debug("API 비활성화 - 업데이트 건너뛰기");
            return;
        }

        if (!isUpdating.compareAndSet(false, true)) {
            log.warn("업데이트 중복 실행 방지");
            return;
        }

        try {
            log.info("=== 지하철 위치 데이터 업데이트 시작 ===");

            if (!checkApiLimit()) {
                return;
            }

            // 🎯 단순화된 업데이트 로직
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
     * 특정 노선 업데이트
     */
    public void updateLineData(String lineNumber) {
        if (!apiEnabled || !checkApiLimit()) {
            return;
        }

        log.info("{}호선 위치 데이터 업데이트 시작", lineNumber);

        metroApiService.getRealtimePositions(lineNumber)
                .subscribe(
                        allTrains -> {
                            // 프론트엔드 역만 필터링
                            List<TrainPosition> filteredTrains = stationFilter.filterLineStations(
                                    allTrains, Integer.parseInt(lineNumber));

                            // 캐시 저장
                            metroCacheService.cacheLinePositions(lineNumber, filteredTrains);

                            log.info("{}호선 업데이트 완료: {}대 → {}대",
                                    lineNumber, allTrains.size(), filteredTrains.size());
                        },
                        error -> {
                            log.error("{}호선 업데이트 실패: {}", lineNumber, error.getMessage());
                            handleLineUpdateFailure(lineNumber, error);
                        }
                );
    }

    // 성공적인 업데이트 처리
    private void handleSuccessfulUpdate(List<TrainPosition> allTrains) {
        try {
            // 1. 프론트엔드 역 필터링
            List<TrainPosition> filteredTrains = stationFilter.filterFrontendStations(allTrains);

            // 2. 전체 데이터 캐시
            metroCacheService.cacheAllPositions(filteredTrains);

            // 3. 노선별 캐시
            for (String lineNum : metroApiService.getEnabledLines()) {
                List<TrainPosition> lineTrains = filteredTrains.stream()
                        .filter(train -> lineNum.equals(String.valueOf(train.getLineNumber())))
                        .toList();
                metroCacheService.cacheLinePositions(lineNum, lineTrains);
            }

            // 4. 성공 기록
            lastSuccessfulUpdate = LocalDateTime.now();
            consecutiveFailures = 0;
            metroCacheService.setLastUpdateTime(lastSuccessfulUpdate);

            // 5. 통계 생성
            MetroStationFilter.FilteringStatistics stats =
                    stationFilter.generateFilteringStats(allTrains, filteredTrains);

            metroCacheService.cacheHealthStatus("HEALTHY",
                    String.format("정상 업데이트 완료. %s", stats.getSummary()));

            log.info("=== 업데이트 성공 ===");
            log.info("원본: {}대 → 필터링: {}대 ({})",
                    allTrains.size(), filteredTrains.size(), stats.getSummary());
            log.info("API 호출: {}/{}", metroApiService.getDailyCallCount(), dailyLimit);

        } catch (Exception e) {
            log.error("업데이트 후처리 중 오류: {}", e.getMessage(), e);
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
        log.error("{}호선 업데이트 실패: {}", lineNumber, error.getMessage());

        // 기존 캐시 데이터 유지 확인
        MetroCacheService.PositionCacheData existingData =
                metroCacheService.getLinePositions(lineNumber);
        if (existingData != null && metroCacheService.isCacheValid(existingData)) {
            log.info("{}호선 기존 캐시 데이터 유지", lineNumber);
        }
    }

    /**
     * 심각한 오류 상황 처리
     */
    private void handleCriticalFailure() {
        String criticalMsg = String.format("연속 %d회 업데이트 실패", MAX_CONSECUTIVE_FAILURES);
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

        if (currentCalls >= dailyLimit * 0.9) {
            log.warn("일일 API 호출 한도 임박: {}/{}", currentCalls, dailyLimit);
        }

        return true;
    }

    // ===== 스케줄링 메서드들 =====

    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyApiCount() {
        metroApiService.resetDailyCallCount();
        consecutiveFailures = 0;
        log.info("=== 일일 API 카운트 초기화 ===");
        metroCacheService.cacheHealthStatus("RESET", "일일 시스템 상태 초기화 완료");
    }

    @Scheduled(cron = "0 0 * * * *")
    public void hourlyHealthCheck() {
        log.info("=== 시간별 시스템 상태 점검 ===");

        try {
            MetroCacheService.CacheStatistics stats = metroCacheService.getCacheStatistics();
            int currentCalls = metroApiService.getDailyCallCount();
            double usagePercentage = (double) currentCalls / dailyLimit * 100;

            LocalDateTime lastUpdate = metroCacheService.getLastUpdateTime();
            boolean isDataFresh = lastUpdate != null &&
                    lastUpdate.isAfter(LocalDateTime.now().minusMinutes(10));

            int frontendStationCount = stationFilter.getFrontendStationIds().size();

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
                healthDetails = String.format("정상 운영중. API: %.1f%%, 활성캐시: %d개, 필터링: %d개역",
                        usagePercentage, stats.getActiveLinesCaches(), frontendStationCount);
            }

            metroCacheService.cacheHealthStatus(healthStatus, healthDetails);

            log.info("시스템 상태: {} - {}", healthStatus, healthDetails);
            log.info("캐시 통계: 활성 {}개, 열차 {}대",
                    stats.getActiveLinesCaches(), stats.getTotalTrains());

        } catch (Exception e) {
            log.error("시간별 상태 점검 실패: {}", e.getMessage(), e);
            metroCacheService.cacheHealthStatus("ERROR", "상태 점검 실패: " + e.getMessage());
        }
    }

    // ===== 관리자용 메서드들 =====

    public void manualUpdate() {
        log.info("=== 수동 업데이트 요청 ===");
        updateAllMetroPositions();
    }

    public void manualLineUpdate(String lineNumber) {
        log.info("=== {}호선 수동 업데이트 요청 ===", lineNumber);
        updateLineData(lineNumber);
    }

    public void emergencyCacheClear() {
        log.warn("=== 긴급 캐시 클리어 실행 ===");
        metroCacheService.evictAllMetroCache();
        consecutiveFailures = 0;
        updateAllMetroPositions(); // 즉시 새 데이터 로드
        log.info("긴급 캐시 클리어 및 재로드 완료");
    }

    /**
     * 🔄 리팩토링: 시스템 상태 조회 (단순화)
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
                .filteringEnabled(true)
                .frontendStationCount(stationFilter.getFrontendStationIds().size())
                .frontendStationsByLine(stationFilter.getFrontendStationCountByLine())
                .build();
    }

    // ===== 시스템 상태 DTO =====

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
        private boolean filteringEnabled;
        private int frontendStationCount;
        private Map<Integer, Integer> frontendStationsByLine;
    }
}