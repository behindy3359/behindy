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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 지하철 데이터 스케줄러 - null 안전 처리
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
        log.info("프론트엔드 역 필터링: {}개 역",
                stationFilter.getFrontendStationIds() != null ?
                        stationFilter.getFrontendStationIds().size() : 0);

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
     * 전체 지하철 위치 데이터 업데이트 - null 안전 처리
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

            // 단순화된 업데이트 로직 - null 안전 처리 추가
            if (metroApiService != null) {
                metroApiService.getAllLinesRealtime()
                        .subscribe(
                                this::handleSuccessfulUpdate,
                                this::handleFailedUpdate
                        );
            } else {
                log.error("MetroApiService가 null입니다");
            }

        } catch (Exception e) {
            handleFailedUpdate(e);
        } finally {
            isUpdating.set(false);
        }
    }

    /**
     * 특정 노선 업데이트 - null 안전 처리
     */
    public void updateLineData(String lineNumber) {
        if (!apiEnabled || !checkApiLimit() || metroApiService == null) {
            return;
        }

        log.info("{}호선 위치 데이터 업데이트 시작", lineNumber);

        metroApiService.getRealtimePositions(lineNumber)
                .subscribe(
                        allTrains -> {
                            if (allTrains != null && stationFilter != null) {
                                try {
                                    // 프론트엔드 역만 필터링
                                    List<TrainPosition> filteredTrains = stationFilter.filterLineStations(
                                            allTrains, Integer.parseInt(lineNumber));

                                    // 캐시 저장
                                    if (metroCacheService != null) {
                                        metroCacheService.cacheLinePositions(lineNumber, filteredTrains);
                                    }

                                    log.info("{}호선 업데이트 완료: {}대 → {}대",
                                            lineNumber, allTrains.size(), filteredTrains.size());
                                } catch (Exception e) {
                                    log.error("{}호선 데이터 처리 중 오류: {}", lineNumber, e.getMessage());
                                }
                            }
                        },
                        error -> {
                            log.error("{}호선 업데이트 실패: {}", lineNumber, error.getMessage());
                            handleLineUpdateFailure(lineNumber, error);
                        }
                );
    }

    // 성공적인 업데이트 처리 - null 안전
    private void handleSuccessfulUpdate(List<TrainPosition> allTrains) {
        if (allTrains == null) {
            log.warn("업데이트 데이터가 null입니다");
            return;
        }

        try {
            // 1. 프론트엔드 역 필터링
            List<TrainPosition> filteredTrains = null;
            if (stationFilter != null) {
                filteredTrains = stationFilter.filterFrontendStations(allTrains);
            } else {
                filteredTrains = allTrains;
                log.warn("StationFilter가 null - 필터링 없이 진행");
            }

            // 2. 전체 데이터 캐시
            if (metroCacheService != null && filteredTrains != null) {
                metroCacheService.cacheAllPositions(filteredTrains);
            }

            // 3. 노선별 캐시
            if (metroApiService != null && metroCacheService != null && filteredTrains != null) {
                List<String> enabledLines = metroApiService.getEnabledLines();
                if (enabledLines != null) {
                    for (String lineNum : enabledLines) {
                        List<TrainPosition> lineTrains = filteredTrains.stream()
                                .filter(train -> train != null &&
                                        lineNum.equals(String.valueOf(train.getLineNumber())))
                                .toList();
                        metroCacheService.cacheLinePositions(lineNum, lineTrains);
                    }
                }
            }

            // 4. 성공 기록
            lastSuccessfulUpdate = LocalDateTime.now();
            consecutiveFailures = 0;
            if (metroCacheService != null) {
                metroCacheService.setLastUpdateTime(lastSuccessfulUpdate);
            }

            // 5. 통계 생성
            String statsMessage = "정상 업데이트 완료";
            if (stationFilter != null && filteredTrains != null) {
                MetroStationFilter.FilteringStatistics stats =
                        stationFilter.generateFilteringStats(allTrains, filteredTrains);
                if (stats != null) {
                    statsMessage = String.format("정상 업데이트 완료. %s", stats.getSummary());
                }
            }

            if (metroCacheService != null) {
                metroCacheService.cacheHealthStatus("HEALTHY", statsMessage);
            }

            int filteredCount = filteredTrains != null ? filteredTrains.size() : 0;
            int dailyCalls = metroApiService != null ? metroApiService.getDailyCallCount() : 0;

            log.info("=== 업데이트 성공 ===");
            log.info("원본: {}대 → 필터링: {}대", allTrains.size(), filteredCount);
            log.info("API 호출: {}/{}", dailyCalls, dailyLimit);

        } catch (Exception e) {
            log.error("업데이트 후처리 중 오류: {}", e.getMessage(), e);
        }
    }

    /**
     * 실패한 업데이트 처리 - null 안전
     */
    private void handleFailedUpdate(Throwable error) {
        consecutiveFailures++;
        String errorMsg = String.format("업데이트 실패 (%d/%d): %s",
                consecutiveFailures, MAX_CONSECUTIVE_FAILURES,
                error != null ? error.getMessage() : "Unknown error");

        log.error(errorMsg, error);

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            handleCriticalFailure();
        } else {
            if (metroCacheService != null) {
                metroCacheService.cacheHealthStatus("WARNING", errorMsg);
            }
        }
    }

    /**
     * 특정 노선 업데이트 실패 처리 - null 안전
     */
    private void handleLineUpdateFailure(String lineNumber, Throwable error) {
        log.error("{}호선 업데이트 실패: {}", lineNumber,
                error != null ? error.getMessage() : "Unknown error");

        // 기존 캐시 데이터 유지 확인
        if (metroCacheService != null) {
            MetroCacheService.PositionCacheData existingData =
                    metroCacheService.getLinePositions(lineNumber);
            if (existingData != null && metroCacheService.isCacheValid(existingData)) {
                log.info("{}호선 기존 캐시 데이터 유지", lineNumber);
            }
        }
    }

    /**
     * 심각한 오류 상황 처리 - null 안전
     */
    private void handleCriticalFailure() {
        String criticalMsg = String.format("연속 %d회 업데이트 실패", MAX_CONSECUTIVE_FAILURES);
        log.error("=== 심각한 오류: {} ===", criticalMsg);
        if (metroCacheService != null) {
            metroCacheService.cacheHealthStatus("CRITICAL", criticalMsg);
        }
    }

    /**
     * API 호출 한도 확인 - null 안전
     */
    private boolean checkApiLimit() {
        if (metroApiService == null) {
            return false;
        }

        int currentCalls = metroApiService.getDailyCallCount();

        if (currentCalls >= dailyLimit) {
            log.warn("일일 API 호출 한도 도달: {}/{}", currentCalls, dailyLimit);
            if (metroCacheService != null) {
                metroCacheService.cacheHealthStatus("LIMITED", "일일 API 호출 한도 도달");
            }
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
        if (metroApiService != null) {
            metroApiService.resetDailyCallCount();
        }
        consecutiveFailures = 0;
        log.info("=== 일일 API 카운트 초기화 ===");
        if (metroCacheService != null) {
            metroCacheService.cacheHealthStatus("RESET", "일일 시스템 상태 초기화 완료");
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    public void hourlyHealthCheck() {
        log.info("=== 시간별 시스템 상태 점검 ===");

        try {
            MetroCacheService.CacheStatistics stats = metroCacheService != null ?
                    metroCacheService.getCacheStatistics() : null;
            int currentCalls = metroApiService != null ? metroApiService.getDailyCallCount() : 0;
            double usagePercentage = (double) currentCalls / dailyLimit * 100;

            LocalDateTime lastUpdate = metroCacheService != null ?
                    metroCacheService.getLastUpdateTime() : null;
            boolean isDataFresh = lastUpdate != null &&
                    lastUpdate.isAfter(LocalDateTime.now().minusMinutes(10));

            int frontendStationCount = stationFilter != null &&
                    stationFilter.getFrontendStationIds() != null ?
                    stationFilter.getFrontendStationIds().size() : 0;

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
                int activeCaches = stats != null ? stats.getActiveLinesCaches() : 0;
                healthDetails = String.format("정상 운영중. API: %.1f%%, 활성캐시: %d개, 필터링: %d개역",
                        usagePercentage, activeCaches, frontendStationCount);
            }

            if (metroCacheService != null) {
                metroCacheService.cacheHealthStatus(healthStatus, healthDetails);
            }

            log.info("시스템 상태: {} - {}", healthStatus, healthDetails);
            if (stats != null) {
                log.info("캐시 통계: 활성 {}개, 열차 {}대",
                        stats.getActiveLinesCaches(), stats.getTotalTrains());
            }

        } catch (Exception e) {
            log.error("시간별 상태 점검 실패: {}", e.getMessage(), e);
            if (metroCacheService != null) {
                metroCacheService.cacheHealthStatus("ERROR", "상태 점검 실패: " + e.getMessage());
            }
        }
    }

    /**
     * 시스템 상태 조회 - null 안전 처리
     */
    public SystemStatus getSystemStatus() {
        MetroCacheService.HealthStatus health = metroCacheService != null ?
                metroCacheService.getHealthStatus() : null;
        MetroCacheService.CacheStatistics stats = metroCacheService != null ?
                metroCacheService.getCacheStatistics() : null;

        // null 안전 처리로 HashMap 사용
        Map<Integer, Integer> frontendStationsByLine = new HashMap<>();
        if (stationFilter != null) {
            Map<Integer, Integer> filterStats = stationFilter.getFrontendStationCountByLine();
            if (filterStats != null) {
                frontendStationsByLine.putAll(filterStats);
            }
        }

        return SystemStatus.builder()
                .healthStatus(health != null ? health.getStatus() : "UNKNOWN")
                .healthDetails(health != null ? health.getDetails() : "상태 정보 없음")
                .lastHealthCheck(health != null ? health.getTimestamp() : LocalDateTime.now())
                .lastSuccessfulUpdate(lastSuccessfulUpdate) // null 허용
                .lastUpdateTime(metroCacheService != null ?
                        metroCacheService.getLastUpdateTime() : null) // null 허용
                .consecutiveFailures(consecutiveFailures)
                .dailyApiCalls(metroApiService != null ? metroApiService.getDailyCallCount() : 0)
                .dailyApiLimit(dailyLimit)
                .apiUsagePercentage(metroApiService != null ?
                        (double) metroApiService.getDailyCallCount() / dailyLimit * 100 : 0.0)
                .activeCaches(stats != null ? stats.getActiveLinesCaches() : 0)
                .totalTrains(stats != null ? stats.getTotalTrains() : 0)
                .hasAllPositionsCache(stats != null ? stats.isHasAllPositionsCache() : false)
                .isUpdating(isUpdating.get())
                .apiEnabled(apiEnabled)
                .filteringEnabled(stationFilter != null)
                .frontendStationCount(stationFilter != null &&
                        stationFilter.getFrontendStationIds() != null ?
                        stationFilter.getFrontendStationIds().size() : 0)
                .frontendStationsByLine(frontendStationsByLine)
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class SystemStatus {
        private String healthStatus;
        private String healthDetails;
        private LocalDateTime lastHealthCheck;
        private LocalDateTime lastSuccessfulUpdate; // null 허용
        private LocalDateTime lastUpdateTime; // null 허용
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
        private Map<Integer, Integer> frontendStationsByLine; // null 허용
    }
}