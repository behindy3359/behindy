// MetroCacheService.java
package com.example.backend.service;

import com.example.backend.dto.metro.MetroCacheData;
import com.example.backend.dto.metro.MetroRealtimeDto;
import com.fasterxml.jackson.core.type.TypeReference;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class MetroCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${seoul.metro.cache.ttl:180}")
    private int cacheTtlSeconds;

    // Redis 키 패턴
    private static final String METRO_POSITIONS_KEY = "metro:positions:line:";
    private static final String METRO_ARRIVALS_KEY = "metro:arrivals:station:";
    private static final String METRO_ALL_LINES_KEY = "metro:all_lines";
    private static final String METRO_HEALTH_KEY = "metro:health";
    private static final String METRO_LAST_UPDATE_KEY = "metro:last_update";

    /**
     * 특정 노선의 실시간 위치 데이터 캐시 저장
     */
    public void cacheLinePositions(String lineNumber, List<MetroRealtimeDto> trains) {
        try {
            String key = METRO_POSITIONS_KEY + lineNumber;

            MetroCacheData cacheData = MetroCacheData.builder()
                    .lineNumber(lineNumber)
                    .trains(trains)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdateTime(LocalDateTime.now().plusSeconds(cacheTtlSeconds))
                    .isHealthy(true)
                    .dataSource("API")
                    .build();

            String jsonData = objectMapper.writeValueAsString(cacheData);
            redisTemplate.opsForValue().set(key, jsonData, cacheTtlSeconds, TimeUnit.SECONDS);

            log.debug("{}호선 위치 데이터 캐시 저장: {}대 열차", lineNumber, trains.size());

        } catch (Exception e) {
            log.error("{}호선 위치 데이터 캐시 저장 실패: {}", lineNumber, e.getMessage(), e);
        }
    }

    /**
     * 특정 노선의 실시간 위치 데이터 캐시 조회
     */
    public MetroCacheData getLinePositions(String lineNumber) {
        try {
            String key = METRO_POSITIONS_KEY + lineNumber;
            Object cachedData = redisTemplate.opsForValue().get(key);

            if (cachedData == null) {
                log.debug("{}호선 위치 데이터 캐시 없음", lineNumber);
                return null;
            }

            MetroCacheData result = objectMapper.readValue(cachedData.toString(), MetroCacheData.class);
            log.debug("{}호선 위치 데이터 캐시 조회: {}대 열차", lineNumber,
                    result.getTrains() != null ? result.getTrains().size() : 0);

            return result;

        } catch (Exception e) {
            log.error("{}호선 위치 데이터 캐시 조회 실패: {}", lineNumber, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 전체 노선 실시간 데이터 캐시 저장
     */
    public void cacheAllLinesData(List<MetroRealtimeDto> allTrains) {
        try {
            MetroCacheData cacheData = MetroCacheData.builder()
                    .lineNumber("ALL")
                    .trains(allTrains)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdateTime(LocalDateTime.now().plusSeconds(cacheTtlSeconds))
                    .isHealthy(true)
                    .dataSource("API")
                    .build();

            String jsonData = objectMapper.writeValueAsString(cacheData);
            redisTemplate.opsForValue().set(METRO_ALL_LINES_KEY, jsonData, cacheTtlSeconds, TimeUnit.SECONDS);

            log.info("전체 노선 데이터 캐시 저장: {}대 열차", allTrains.size());

        } catch (Exception e) {
            log.error("전체 노선 데이터 캐시 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 전체 노선 실시간 데이터 캐시 조회
     */
    public MetroCacheData getAllLinesData() {
        try {
            Object cachedData = redisTemplate.opsForValue().get(METRO_ALL_LINES_KEY);

            if (cachedData == null) {
                log.debug("전체 노선 데이터 캐시 없음");
                return null;
            }

            MetroCacheData result = objectMapper.readValue(cachedData.toString(), MetroCacheData.class);
            log.debug("전체 노선 데이터 캐시 조회: {}대 열차",
                    result.getTrains() != null ? result.getTrains().size() : 0);

            return result;

        } catch (Exception e) {
            log.error("전체 노선 데이터 캐시 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 특정 역의 도착정보 캐시 저장
     */
    public void cacheStationArrivals(String stationName, List<MetroRealtimeDto> arrivals) {
        try {
            String key = METRO_ARRIVALS_KEY + stationName;

            MetroCacheData cacheData = MetroCacheData.builder()
                    .lineNumber(stationName) // 역명을 lineNumber 필드에 저장
                    .trains(arrivals)
                    .lastUpdated(LocalDateTime.now())
                    .nextUpdateTime(LocalDateTime.now().plusSeconds(cacheTtlSeconds))
                    .isHealthy(true)
                    .dataSource("API")
                    .build();

            String jsonData = objectMapper.writeValueAsString(cacheData);
            redisTemplate.opsForValue().set(key, jsonData, cacheTtlSeconds, TimeUnit.SECONDS);

            log.debug("{} 역 도착정보 캐시 저장: {}건", stationName, arrivals.size());

        } catch (Exception e) {
            log.error("{} 역 도착정보 캐시 저장 실패: {}", stationName, e.getMessage(), e);
        }
    }

    /**
     * 특정 역의 도착정보 캐시 조회
     */
    public MetroCacheData getStationArrivals(String stationName) {
        try {
            String key = METRO_ARRIVALS_KEY + stationName;
            Object cachedData = redisTemplate.opsForValue().get(key);

            if (cachedData == null) {
                log.debug("{} 역 도착정보 캐시 없음", stationName);
                return null;
            }

            MetroCacheData result = objectMapper.readValue(cachedData.toString(), MetroCacheData.class);
            log.debug("{} 역 도착정보 캐시 조회: {}건", stationName,
                    result.getTrains() != null ? result.getTrains().size() : 0);

            return result;

        } catch (Exception e) {
            log.error("{} 역 도착정보 캐시 조회 실패: {}", stationName, e.getMessage(), e);
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
    public boolean isCacheValid(MetroCacheData cacheData) {
        if (cacheData == null || cacheData.getLastUpdated() == null) {
            return false;
        }

        LocalDateTime expireTime = cacheData.getLastUpdated().plusSeconds(cacheTtlSeconds);
        boolean isValid = LocalDateTime.now().isBefore(expireTime);

        if (!isValid) {
            log.debug("캐시 데이터 만료: 마지막 업데이트 {}", cacheData.getLastUpdated());
        }

        return isValid;
    }

    /**
     * 특정 노선 캐시 삭제
     */
    public void evictLineCache(String lineNumber) {
        try {
            String key = METRO_POSITIONS_KEY + lineNumber;
            redisTemplate.delete(key);
            log.debug("{}호선 캐시 삭제", lineNumber);

        } catch (Exception e) {
            log.error("{}호선 캐시 삭제 실패: {}", lineNumber, e.getMessage(), e);
        }
    }

    /**
     * 전체 지하철 캐시 삭제 (긴급 시) - 활성화된 노선만
     */
    public void evictAllMetroCache() {
        try {
            // 🎯 활성화된 노선별 캐시만 삭제 (1-4호선)
            for (String line : Arrays.asList("1", "2", "3", "4")) {
                evictLineCache(line);
            }

            // 전체 노선 캐시 삭제
            redisTemplate.delete(METRO_ALL_LINES_KEY);

            // 건강 상태 및 업데이트 시간 삭제
            redisTemplate.delete(METRO_HEALTH_KEY);
            redisTemplate.delete(METRO_LAST_UPDATE_KEY);

            log.info("활성화된 노선 캐시 삭제 완료 (1-4호선)");

        } catch (Exception e) {
            log.error("캐시 삭제 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 캐시 통계 조회 - 활성화된 노선만
     */
    public CacheStatistics getCacheStatistics() {
        try {
            int activeCaches = 0;
            int totalTrains = 0;
            LocalDateTime oldestUpdate = LocalDateTime.now();

            // 🎯 활성화된 노선 캐시만 확인 (1-4호선)
            for (String line : Arrays.asList("1", "2", "3", "4")) {
                MetroCacheData lineData = getLinePositions(line);
                if (lineData != null && isCacheValid(lineData)) {
                    activeCaches++;
                    if (lineData.getTrains() != null) {
                        totalTrains += lineData.getTrains().size();
                    }
                    if (lineData.getLastUpdated().isBefore(oldestUpdate)) {
                        oldestUpdate = lineData.getLastUpdated();
                    }
                }
            }

            // 전체 노선 캐시 확인
            MetroCacheData allData = getAllLinesData();
            boolean hasAllLinesCache = allData != null && isCacheValid(allData);

            return new CacheStatistics(activeCaches, totalTrains, hasAllLinesCache,
                    oldestUpdate, getLastUpdateTime());

        } catch (Exception e) {
            log.error("캐시 통계 조회 실패: {}", e.getMessage(), e);
            return new CacheStatistics(0, 0, false, LocalDateTime.now(), null);
        }
    }

    // === 내부 클래스들 ===

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
        public boolean hasAllLinesCache;
        public LocalDateTime oldestCacheTime;
        public LocalDateTime lastUpdateTime;

        public CacheStatistics(int activeLinesCaches, int totalTrains, boolean hasAllLinesCache,
                               LocalDateTime oldestCacheTime, LocalDateTime lastUpdateTime) {
            this.activeLinesCaches = activeLinesCaches;
            this.totalTrains = totalTrains;
            this.hasAllLinesCache = hasAllLinesCache;
            this.oldestCacheTime = oldestCacheTime;
            this.lastUpdateTime = lastUpdateTime;
        }

        // Getters
        public int getActiveLinesCaches() { return activeLinesCaches; }
        public int getTotalTrains() { return totalTrains; }
        public boolean isHasAllLinesCache() { return hasAllLinesCache; }
        public LocalDateTime getOldestCacheTime() { return oldestCacheTime; }
        public LocalDateTime getLastUpdateTime() { return lastUpdateTime; }
    }
}
