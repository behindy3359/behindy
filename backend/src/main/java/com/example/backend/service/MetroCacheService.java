package com.example.backend.service;

import com.example.backend.dto.metro.TrainPosition;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 지하철 캐시 서비스 (최종 버전)
 * 위치 정보만 캐싱하는 단순화된 구조
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetroCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${seoul.metro.cache.ttl:180}")
    private int cacheTtlSeconds;

    // Redis 키 패턴 (단순화)
    private static final String METRO_POSITIONS_KEY = "metro:positions:line:";
    private static final String METRO_ALL_POSITIONS_KEY = "metro:all_positions";
    private static final String METRO_HEALTH_KEY = "metro:health";
    private static final String METRO_LAST_UPDATE_KEY = "metro:last_update";

    /**
     * 특정 노선의 위치 데이터 캐시 저장
     */
    public void cacheLinePositions(String lineNumber, List<TrainPosition> positions) {
        log.info("🚇 DEBUG_LOG: [MetroCacheService.cacheLinePositions] 캐시 저장 시작 - 노선: {}, 열차 수: {}",
            lineNumber, positions != null ? positions.size() : 0);

        try {
            String key = METRO_POSITIONS_KEY + lineNumber;

            PositionCacheData cacheData = PositionCacheData.builder()
                    .lineNumber(lineNumber)
                    .positions(positions)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdateTime(LocalDateTime.now().plusSeconds(cacheTtlSeconds))
                    .isHealthy(true)
                    .dataSource("API")
                    .build();

            String jsonData = objectMapper.writeValueAsString(cacheData);
            redisTemplate.opsForValue().set(key, jsonData, cacheTtlSeconds, TimeUnit.SECONDS);

            log.info("🚇 DEBUG_LOG: [MetroCacheService.cacheLinePositions] 캐시 저장 성공 - key: {}, TTL: {}초",
                key, cacheTtlSeconds);

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroCacheService.cacheLinePositions] 캐시 저장 실패: {}", e.getMessage());
            log.error("{}호선 위치 데이터 캐시 저장 실패: {}", lineNumber, e.getMessage(), e);
        }
    }

    /**
     * 특정 노선의 위치 데이터 캐시 조회
     */
    public PositionCacheData getLinePositions(String lineNumber) {
        log.info("🚇 DEBUG_LOG: [MetroCacheService.getLinePositions] 캐시 조회 시작 - 노선: {}", lineNumber);

        try {
            String key = METRO_POSITIONS_KEY + lineNumber;
            Object cachedData = redisTemplate.opsForValue().get(key);

            if (cachedData == null) {
                log.warn("🚇 DEBUG_LOG: [MetroCacheService.getLinePositions] 캐시 없음 - key: {}", key);
                return null;
            }

            PositionCacheData result = objectMapper.readValue(cachedData.toString(), PositionCacheData.class);
            log.info("🚇 DEBUG_LOG: [MetroCacheService.getLinePositions] 캐시 조회 성공 - {}대 열차, 마지막 업데이트: {}",
                result.getPositions() != null ? result.getPositions().size() : 0,
                result.getLastUpdated());

            return result;

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroCacheService.getLinePositions] 캐시 조회 실패: {}", e.getMessage());
            log.error("{}호선 위치 데이터 캐시 조회 실패: {}", lineNumber, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 전체 노선 위치 데이터 캐시 저장
     */
    public void cacheAllPositions(List<TrainPosition> allPositions) {
        log.info("🚇 DEBUG_LOG: [MetroCacheService.cacheAllPositions] 전체 캐시 저장 시작 - 열차 수: {}",
            allPositions != null ? allPositions.size() : 0);

        try {
            PositionCacheData cacheData = PositionCacheData.builder()
                    .lineNumber("ALL")
                    .positions(allPositions)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdateTime(LocalDateTime.now().plusSeconds(cacheTtlSeconds))
                    .isHealthy(true)
                    .dataSource("API")
                    .build();

            String jsonData = objectMapper.writeValueAsString(cacheData);
            redisTemplate.opsForValue().set(METRO_ALL_POSITIONS_KEY, jsonData, cacheTtlSeconds, TimeUnit.SECONDS);

            log.info("🚇 DEBUG_LOG: [MetroCacheService.cacheAllPositions] 전체 캐시 저장 성공 - key: {}, TTL: {}초",
                METRO_ALL_POSITIONS_KEY, cacheTtlSeconds);
            log.info("전체 노선 위치 데이터 캐시 저장: {}대 열차", allPositions.size());

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroCacheService.cacheAllPositions] 전체 캐시 저장 실패: {}", e.getMessage());
            log.error("전체 노선 위치 데이터 캐시 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 전체 노선 위치 데이터 캐시 조회
     */
    public PositionCacheData getAllPositions() {
        log.info("🚇 DEBUG_LOG: [MetroCacheService.getAllPositions] 전체 캐시 조회 시작");

        try {
            Object cachedData = redisTemplate.opsForValue().get(METRO_ALL_POSITIONS_KEY);

            if (cachedData == null) {
                log.warn("🚇 DEBUG_LOG: [MetroCacheService.getAllPositions] 전체 캐시 없음 - key: {}",
                    METRO_ALL_POSITIONS_KEY);
                return null;
            }

            PositionCacheData result = objectMapper.readValue(cachedData.toString(), PositionCacheData.class);
            log.info("🚇 DEBUG_LOG: [MetroCacheService.getAllPositions] 전체 캐시 조회 성공 - {}대 열차, 마지막 업데이트: {}",
                result.getPositions() != null ? result.getPositions().size() : 0,
                result.getLastUpdated());

            return result;

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroCacheService.getAllPositions] 전체 캐시 조회 실패: {}", e.getMessage());
            log.error("전체 노선 위치 데이터 캐시 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 시스템 건강 상태 저장
     */
    public void cacheHealthStatus(String status, String details) {
        try {
            HealthStatus healthStatus = new HealthStatus(status, details, LocalDateTime.now());
            String jsonData = objectMapper.writeValueAsString(healthStatus);
            redisTemplate.opsForValue().set(METRO_HEALTH_KEY, jsonData, 300, TimeUnit.SECONDS); // 5분 TTL

        } catch (Exception e) {
            log.error("건강 상태 캐시 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 시스템 건강 상태 조회
     */
    public HealthStatus getHealthStatus() {
        try {
            Object cachedData = redisTemplate.opsForValue().get(METRO_HEALTH_KEY);

            if (cachedData == null) {
                return new HealthStatus("UNKNOWN", "상태 정보 없음", LocalDateTime.now());
            }

            return objectMapper.readValue(cachedData.toString(), HealthStatus.class);

        } catch (Exception e) {
            log.error("건강 상태 캐시 조회 실패: {}", e.getMessage(), e);
            return new HealthStatus("ERROR", "상태 조회 실패: " + e.getMessage(), LocalDateTime.now());
        }
    }

    /**
     * 마지막 업데이트 시간 저장
     */
    public void setLastUpdateTime(LocalDateTime updateTime) {
        try {
            redisTemplate.opsForValue().set(METRO_LAST_UPDATE_KEY, updateTime.toString(),
                    cacheTtlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("마지막 업데이트 시간 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 마지막 업데이트 시간 조회
     */
    public LocalDateTime getLastUpdateTime() {
        try {
            Object cachedTime = redisTemplate.opsForValue().get(METRO_LAST_UPDATE_KEY);

            if (cachedTime == null) {
                return null;
            }

            return LocalDateTime.parse(cachedTime.toString());

        } catch (Exception e) {
            log.error("마지막 업데이트 시간 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 캐시 데이터 유효성 검사
     */
    public boolean isCacheValid(PositionCacheData cacheData) {
        if (cacheData == null || cacheData.getLastUpdated() == null) {
            return false;
        }

        LocalDateTime expireTime = cacheData.getLastUpdated().plusSeconds(cacheTtlSeconds);
        boolean isValid = LocalDateTime.now().isBefore(expireTime);

        return isValid;
    }

    /**
     * 특정 노선 캐시 삭제
     */
    public void evictLineCache(String lineNumber) {
        try {
            String key = METRO_POSITIONS_KEY + lineNumber;
            redisTemplate.delete(key);

        } catch (Exception e) {
            log.error("{}호선 캐시 삭제 실패: {}", lineNumber, e.getMessage(), e);
        }
    }

    /**
     * 전체 지하철 캐시 삭제 (긴급 시)
     */
    public void evictAllMetroCache() {
        try {
            // 활성화된 노선별 캐시 삭제 (1-4호선)
            for (String line : Arrays.asList("1", "2", "3", "4")) {
                evictLineCache(line);
            }

            // 전체 노선 캐시 삭제
            redisTemplate.delete(METRO_ALL_POSITIONS_KEY);

            // 건강 상태 및 업데이트 시간 삭제
            redisTemplate.delete(METRO_HEALTH_KEY);
            redisTemplate.delete(METRO_LAST_UPDATE_KEY);

            log.info("전체 지하철 캐시 삭제 완료");

        } catch (Exception e) {
            log.error("캐시 삭제 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 캐시 통계 조회
     */
    public CacheStatistics getCacheStatistics() {
        try {
            int activeCaches = 0;
            int totalTrains = 0;
            LocalDateTime oldestUpdate = LocalDateTime.now();

            // 활성화된 노선 캐시 확인 (1-4호선)
            for (String line : Arrays.asList("1", "2", "3", "4")) {
                PositionCacheData lineData = getLinePositions(line);
                if (lineData != null && isCacheValid(lineData)) {
                    activeCaches++;
                    if (lineData.getPositions() != null) {
                        totalTrains += lineData.getPositions().size();
                    }
                    if (lineData.getLastUpdated().isBefore(oldestUpdate)) {
                        oldestUpdate = lineData.getLastUpdated();
                    }
                }
            }

            // 전체 노선 캐시 확인
            PositionCacheData allData = getAllPositions();
            boolean hasAllPositionsCache = allData != null && isCacheValid(allData);

            return new CacheStatistics(activeCaches, totalTrains, hasAllPositionsCache,
                    oldestUpdate, getLastUpdateTime());

        } catch (Exception e) {
            log.error("캐시 통계 조회 실패: {}", e.getMessage(), e);
            return new CacheStatistics(0, 0, false, LocalDateTime.now(), null);
        }
    }

    // === 내부 클래스들 ===

    public static class PositionCacheData {
        public String lineNumber;
        public List<TrainPosition> positions;
        public LocalDateTime lastUpdated;
        public LocalDateTime nextUpdateTime;
        public Boolean isHealthy;
        public String dataSource;

        public PositionCacheData() {}

        public static PositionCacheDataBuilder builder() {
            return new PositionCacheDataBuilder();
        }

        public static class PositionCacheDataBuilder {
            private PositionCacheData data = new PositionCacheData();

            public PositionCacheDataBuilder lineNumber(String lineNumber) {
                data.lineNumber = lineNumber;
                return this;
            }

            public PositionCacheDataBuilder positions(List<TrainPosition> positions) {
                data.positions = positions;
                return this;
            }

            public PositionCacheDataBuilder lastUpdated(LocalDateTime lastUpdated) {
                data.lastUpdated = lastUpdated;
                return this;
            }

            public PositionCacheDataBuilder nextUpdateTime(LocalDateTime nextUpdateTime) {
                data.nextUpdateTime = nextUpdateTime;
                return this;
            }

            public PositionCacheDataBuilder isHealthy(Boolean isHealthy) {
                data.isHealthy = isHealthy;
                return this;
            }

            public PositionCacheDataBuilder dataSource(String dataSource) {
                data.dataSource = dataSource;
                return this;
            }

            public PositionCacheData build() {
                return data;
            }
        }

        // Getters
        public String getLineNumber() { return lineNumber; }
        public List<TrainPosition> getPositions() { return positions; }
        public LocalDateTime getLastUpdated() { return lastUpdated; }
        public LocalDateTime getNextUpdateTime() { return nextUpdateTime; }
        public Boolean getIsHealthy() { return isHealthy; }
        public String getDataSource() { return dataSource; }
    }

    public static class HealthStatus {
        public String status;
        public String details;
        public LocalDateTime timestamp;

        public HealthStatus() {}

        public HealthStatus(String status, String details, LocalDateTime timestamp) {
            this.status = status;
            this.details = details;
            this.timestamp = timestamp;
        }

        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    public static class CacheStatistics {
        public int activeLinesCaches;
        public int totalTrains;
        public boolean hasAllPositionsCache;
        public LocalDateTime oldestCacheTime;
        public LocalDateTime lastUpdateTime;

        public CacheStatistics(int activeLinesCaches, int totalTrains, boolean hasAllPositionsCache,
                               LocalDateTime oldestCacheTime, LocalDateTime lastUpdateTime) {
            this.activeLinesCaches = activeLinesCaches;
            this.totalTrains = totalTrains;
            this.hasAllPositionsCache = hasAllPositionsCache;
            this.oldestCacheTime = oldestCacheTime;
            this.lastUpdateTime = lastUpdateTime;
        }

        // Getters
        public int getActiveLinesCaches() { return activeLinesCaches; }
        public int getTotalTrains() { return totalTrains; }
        public boolean isHasAllPositionsCache() { return hasAllPositionsCache; }
        public LocalDateTime getOldestCacheTime() { return oldestCacheTime; }
        public LocalDateTime getLastUpdateTime() { return lastUpdateTime; }
    }
}