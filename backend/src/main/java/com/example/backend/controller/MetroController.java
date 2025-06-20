package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.metro.MetroCacheData;
import com.example.backend.service.MetroCacheService;
import com.example.backend.service.MetroDataScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/metro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용 (실제 배포시 수정 필요)
public class MetroController {

    private final MetroCacheService metroCacheService;
    private final MetroDataScheduler metroDataScheduler;

    /**
     * 전체 노선 실시간 데이터 조회 (공개 API)
     */
    @GetMapping("/realtime/all")
    public ResponseEntity<ApiResponse> getAllLinesRealtime() {
        try {
            MetroCacheData cacheData = metroCacheService.getAllLinesData();

            if (cacheData == null || !metroCacheService.isCacheValid(cacheData)) {
                log.warn("전체 노선 캐시 데이터 없음 또는 만료");
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(false)
                        .message("실시간 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.")
                        .data(createEmptyRealtimeResponse())
                        .build());
            }

            Map<String, Object> response = createRealtimeResponse(cacheData);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("실시간 데이터 조회 성공")
                    .data(response)
                    .build());

        } catch (Exception e) {
            log.error("전체 노선 실시간 데이터 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("데이터 조회 중 오류가 발생했습니다.")
                    .data(createEmptyRealtimeResponse())
                    .build());
        }
    }

    /**
     * 특정 노선 실시간 데이터 조회 (공개 API)
     */
    @GetMapping("/realtime/line/{lineNumber}")
    public ResponseEntity<ApiResponse> getLineRealtime(@PathVariable String lineNumber) {
        try {
            // 노선 번호 유효성 검사
            if (!isValidLineNumber(lineNumber)) {
                return ResponseEntity.badRequest().body(ApiResponse.builder()
                        .success(false)
                        .message("유효하지 않은 노선 번호입니다: " + lineNumber)
                        .build());
            }

            MetroCacheData cacheData = metroCacheService.getLinePositions(lineNumber);

            if (cacheData == null || !metroCacheService.isCacheValid(cacheData)) {
                log.warn("{}호선 캐시 데이터 없음 또는 만료", lineNumber);
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(false)
                        .message(lineNumber + "호선 실시간 데이터를 불러올 수 없습니다.")
                        .data(createEmptyLineResponse(lineNumber))
                        .build());
            }

            Map<String, Object> response = createLineResponse(lineNumber, cacheData);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 실시간 데이터 조회 성공")
                    .data(response)
                    .build());

        } catch (Exception e) {
            log.error("{}호선 실시간 데이터 조회 실패: {}", lineNumber, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("데이터 조회 중 오류가 발생했습니다.")
                    .data(createEmptyLineResponse(lineNumber))
                    .build());
        }
    }

    /**
     * 특정 역 도착정보 조회 (공개 API)
     */
    @GetMapping("/arrivals/station/{stationName}")
    public ResponseEntity<ApiResponse> getStationArrivals(@PathVariable String stationName) {
        try {
            MetroCacheData cacheData = metroCacheService.getStationArrivals(stationName);

            if (cacheData == null || !metroCacheService.isCacheValid(cacheData)) {
                log.warn("{} 역 도착정보 캐시 데이터 없음 또는 만료", stationName);
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(false)
                        .message(stationName + " 역 도착정보를 불러올 수 없습니다.")
                        .data(createEmptyStationResponse(stationName))
                        .build());
            }

            Map<String, Object> response = createStationResponse(stationName, cacheData);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(stationName + " 역 도착정보 조회 성공")
                    .data(response)
                    .build());

        } catch (Exception e) {
            log.error("{} 역 도착정보 조회 실패: {}", stationName, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("데이터 조회 중 오류가 발생했습니다.")
                    .data(createEmptyStationResponse(stationName))
                    .build());
        }
    }

    /**
     * 시스템 상태 조회 (공개 API)
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse> getSystemStatus() {
        try {
            MetroDataScheduler.SystemStatus status = metroDataScheduler.getSystemStatus();

            Map<String, Object> response = new HashMap<>();
            response.put("status", status.getHealthStatus());
            response.put("message", status.getHealthDetails());
            response.put("lastUpdate", status.getLastUpdateTime());
            response.put("isHealthy", "HEALTHY".equals(status.getHealthStatus()));
            response.put("apiUsage", String.format("%.1f%% (%d/%d)",
                    status.getApiUsagePercentage(), status.getDailyApiCalls(), status.getDailyApiLimit()));
            response.put("activeCaches", status.getActiveCaches());
            response.put("totalTrains", status.getTotalTrains());
            response.put("isUpdating", status.isUpdating());

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("시스템 상태 조회 성공")
                    .data(response)
                    .build());

        } catch (Exception e) {
            log.error("시스템 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("시스템 상태를 확인할 수 없습니다.")
                    .build());
        }
    }

    // === 관리자용 API (인증 필요) ===

    /**
     * 수동 데이터 업데이트 (관리자용)
     */
    @PostMapping("/admin/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> manualUpdate() {
        try {
            metroDataScheduler.manualUpdate();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("수동 업데이트가 시작되었습니다.")
                    .build());

        } catch (Exception e) {
            log.error("수동 업데이트 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("수동 업데이트 실행 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 특정 노선 수동 업데이트 (관리자용)
     */
    @PostMapping("/admin/update/line/{lineNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> manualLineUpdate(@PathVariable String lineNumber) {
        try {
            if (!isValidLineNumber(lineNumber)) {
                return ResponseEntity.badRequest().body(ApiResponse.builder()
                        .success(false)
                        .message("유효하지 않은 노선 번호입니다: " + lineNumber)
                        .build());
            }

            metroDataScheduler.manualLineUpdate(lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 수동 업데이트가 시작되었습니다.")
                    .build());

        } catch (Exception e) {
            log.error("{}호선 수동 업데이트 실패: {}", lineNumber, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("수동 업데이트 실행 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 상세 시스템 상태 조회 (관리자용)
     */
    @GetMapping("/admin/status/detailed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getDetailedSystemStatus() {
        try {
            MetroDataScheduler.SystemStatus status = metroDataScheduler.getSystemStatus();
            MetroCacheService.CacheStatistics cacheStats = metroCacheService.getCacheStatistics();

            Map<String, Object> response = new HashMap<>();
            response.put("systemStatus", status);
            response.put("cacheStatistics", cacheStats);
            response.put("healthStatus", metroCacheService.getHealthStatus());

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("상세 시스템 상태 조회 성공")
                    .data(response)
                    .build());

        } catch (Exception e) {
            log.error("상세 시스템 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("상세 시스템 상태를 확인할 수 없습니다.")
                    .build());
        }
    }

    /**
     * 긴급 캐시 클리어 (관리자용)
     */
    @DeleteMapping("/admin/cache/clear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> emergencyCacheClear() {
        try {
            metroDataScheduler.emergencyCacheClear();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("긴급 캐시 클리어가 완료되었습니다.")
                    .build());

        } catch (Exception e) {
            log.error("긴급 캐시 클리어 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("캐시 클리어 실행 중 오류가 발생했습니다.")
                    .build());
        }
    }

    // === 유틸리티 메서드들 ===

    /**
     * 노선 번호 유효성 검사 - 활성화된 노선만 허용
     */
    private boolean isValidLineNumber(String lineNumber) {
        try {
            // 🎯 활성화된 노선(1-4호선)만 허용
            return Arrays.asList("1", "2", "3", "4").contains(lineNumber);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 실시간 데이터 응답 생성
     */
    private Map<String, Object> createRealtimeResponse(MetroCacheData cacheData) {
        Map<String, Object> response = new HashMap<>();
        response.put("trains", cacheData.getTrains() != null ? cacheData.getTrains() : new ArrayList<>());
        response.put("lastUpdated", cacheData.getLastUpdated());
        response.put("nextUpdate", cacheData.getNextUpdateTime());
        response.put("totalTrains", cacheData.getTrains() != null ? cacheData.getTrains().size() : 0);
        response.put("dataSource", cacheData.getDataSource());
        response.put("isRealtime", true);

        // 노선별 통계
        Map<String, Integer> lineStats = new HashMap<>();
        if (cacheData.getTrains() != null) {
            cacheData.getTrains().forEach(train -> {
                String line = train.getSubwayLine();
                lineStats.put(line, lineStats.getOrDefault(line, 0) + 1);
            });
        }
        response.put("lineStatistics", lineStats);

        return response;
    }

    /**
     * 노선별 데이터 응답 생성
     */
    private Map<String, Object> createLineResponse(String lineNumber, MetroCacheData cacheData) {
        Map<String, Object> response = new HashMap<>();
        response.put("lineNumber", lineNumber);
        response.put("trains", cacheData.getTrains() != null ? cacheData.getTrains() : new ArrayList<>());
        response.put("lastUpdated", cacheData.getLastUpdated());
        response.put("nextUpdate", cacheData.getNextUpdateTime());
        response.put("trainCount", cacheData.getTrains() != null ? cacheData.getTrains().size() : 0);
        response.put("dataSource", cacheData.getDataSource());
        response.put("isRealtime", true);

        return response;
    }

    /**
     * 역별 도착정보 응답 생성
     */
    private Map<String, Object> createStationResponse(String stationName, MetroCacheData cacheData) {
        Map<String, Object> response = new HashMap<>();
        response.put("stationName", stationName);
        response.put("arrivals", cacheData.getTrains() != null ? cacheData.getTrains() : new ArrayList<>());
        response.put("lastUpdated", cacheData.getLastUpdated());
        response.put("nextUpdate", cacheData.getNextUpdateTime());
        response.put("arrivalCount", cacheData.getTrains() != null ? cacheData.getTrains().size() : 0);
        response.put("dataSource", cacheData.getDataSource());
        response.put("isRealtime", true);

        return response;
    }

    /**
     * 빈 실시간 데이터 응답 생성
     */
    private Map<String, Object> createEmptyRealtimeResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("trains", new ArrayList<>());
        response.put("lastUpdated", null);
        response.put("nextUpdate", null);
        response.put("totalTrains", 0);
        response.put("dataSource", "NONE");
        response.put("isRealtime", false);
        response.put("lineStatistics", new HashMap<>());

        return response;
    }

    /**
     * 빈 노선 응답 생성
     */
    private Map<String, Object> createEmptyLineResponse(String lineNumber) {
        Map<String, Object> response = new HashMap<>();
        response.put("lineNumber", lineNumber);
        response.put("trains", new ArrayList<>());
        response.put("lastUpdated", null);
        response.put("nextUpdate", null);
        response.put("trainCount", 0);
        response.put("dataSource", "NONE");
        response.put("isRealtime", false);

        return response;
    }

    /**
     * 빈 역 응답 생성
     */
    private Map<String, Object> createEmptyStationResponse(String stationName) {
        Map<String, Object> response = new HashMap<>();
        response.put("stationName", stationName);
        response.put("arrivals", new ArrayList<>());
        response.put("lastUpdated", null);
        response.put("nextUpdate", null);
        response.put("arrivalCount", 0);
        response.put("dataSource", "NONE");
        response.put("isRealtime", false);

        return response;
    }
}