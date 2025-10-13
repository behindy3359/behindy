package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.metro.MetroPositionResponse;
import com.example.backend.dto.metro.TrainPosition;
import com.example.backend.service.MetroPositionService;
import com.example.backend.service.MetroCacheService;
import com.example.backend.service.MetroStationFilter;
import com.example.backend.service.MetroDataScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 지하철 위치 정보 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/metro")
@RequiredArgsConstructor
public class MetroController {

    private final MetroPositionService metroPositionService;
    private final MetroCacheService metroCacheService;
    private final MetroStationFilter stationFilter;
    private final MetroDataScheduler dataScheduler;

    /**
     * 전체 노선 열차 위치 정보 조회
     */
    @GetMapping("/positions")
    public ResponseEntity<ApiResponse> getAllPositions() {
        log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] ========== 프론트엔드 요청 수신: /api/metro/positions ==========");

        try {
            // 1. Redis 캐시에서 실제 API 데이터 조회 시도
            log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] Redis 캐시 조회 시도");
            MetroCacheService.PositionCacheData cacheData = metroCacheService.getAllPositions();

            if (cacheData != null && metroCacheService.isCacheValid(cacheData)) {
                log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] 캐시 데이터 발견 - {}대 열차, dataSource: {}",
                    cacheData.getPositions() != null ? cacheData.getPositions().size() : 0,
                    cacheData.getDataSource());

                // 캐시 데이터를 MetroPositionResponse로 변환
                MetroPositionResponse positions = convertCacheToResponse(cacheData);

                log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] ✅ 실제 API 데이터 반환 - 열차 수: {}, dataSource: {}, isRealtime: {}",
                    positions.getTotalTrains(),
                    positions.getDataSource(),
                    positions.isRealtime());

                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .message("전체 노선 위치 정보 조회 성공 (실시간)")
                        .data(positions)
                        .build());
            }

            // 2. 캐시가 없으면 Mock 데이터 반환 (폴백)
            log.warn("🚇 DEBUG_LOG: [MetroController.getAllPositions] ⚠️ 캐시 없음 - Mock 데이터로 폴백");
            log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] MetroPositionService.getAllPositions() 호출");
            MetroPositionResponse positions = metroPositionService.getAllPositions();

            log.info("🚇 DEBUG_LOG: [MetroController.getAllPositions] Mock 데이터 반환 - 열차 수: {}, dataSource: {}, isRealtime: {}",
                positions != null ? positions.getTotalTrains() : 0,
                positions != null ? positions.getDataSource() : "null",
                positions != null ? positions.isRealtime() : false);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("전체 노선 위치 정보 조회 성공 (테스트 데이터)")
                    .data(positions)
                    .build());

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroController.getAllPositions] 예외 발생: {}", e.getMessage());
            log.error("전체 위치 정보 조회 API 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("위치 정보 조회 중 오류가 발생했습니다.")
                    .data(createEmptyPositionResponse())
                    .build());
        }
    }

    /**
     * 특정 노선 열차 위치 정보 조회
     */
    @GetMapping("/positions/{lineNumber}")
    public ResponseEntity<ApiResponse> getLinePositions(@PathVariable Integer lineNumber) {
        log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] ========== 프론트엔드 요청 수신: /api/metro/positions/{} ==========",
            lineNumber);

        try {
            // 노선 번호 유효성 검사
            if (!isValidLineNumber(lineNumber)) {
                log.warn("🚇 DEBUG_LOG: [MetroController.getLinePositions] 유효하지 않은 노선 번호: {}", lineNumber);
                return ResponseEntity.badRequest().body(ApiResponse.builder()
                        .success(false)
                        .message("유효하지 않은 노선 번호입니다: " + lineNumber)
                        .build());
            }

            // 1. Redis 캐시에서 실제 API 데이터 조회 시도
            log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] Redis 캐시 조회 시도 - {}호선", lineNumber);
            MetroCacheService.PositionCacheData cacheData = metroCacheService.getLinePositions(String.valueOf(lineNumber));

            if (cacheData != null && metroCacheService.isCacheValid(cacheData)) {
                log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] 캐시 데이터 발견 - {}대 열차, dataSource: {}",
                    cacheData.getPositions() != null ? cacheData.getPositions().size() : 0,
                    cacheData.getDataSource());

                // 캐시 데이터를 MetroPositionResponse로 변환
                MetroPositionResponse positions = convertCacheToResponse(cacheData);

                log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] ✅ 실제 API 데이터 반환 - {}호선, 열차 수: {}, dataSource: {}, isRealtime: {}",
                    lineNumber,
                    positions.getTotalTrains(),
                    positions.getDataSource(),
                    positions.isRealtime());

                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .message(lineNumber + "호선 위치 정보 조회 성공 (실시간)")
                        .data(positions)
                        .build());
            }

            // 2. 캐시가 없으면 Mock 데이터 반환 (폴백)
            log.warn("🚇 DEBUG_LOG: [MetroController.getLinePositions] ⚠️ 캐시 없음 - Mock 데이터로 폴백");
            log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] MetroPositionService.getLinePositions({}) 호출",
                lineNumber);
            MetroPositionResponse positions = metroPositionService.getLinePositions(lineNumber);

            log.info("🚇 DEBUG_LOG: [MetroController.getLinePositions] Mock 데이터 반환 - 열차 수: {}, dataSource: {}",
                positions != null ? positions.getTotalTrains() : 0,
                positions != null ? positions.getDataSource() : "null");

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 위치 정보 조회 성공 (테스트 데이터)")
                    .data(positions)
                    .build());

        } catch (Exception e) {
            log.error("🚇 DEBUG_LOG: [MetroController.getLinePositions] 예외 발생: {}", e.getMessage());
            log.error("{}호선 위치 정보 조회 API 실패: {}", lineNumber, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("위치 정보 조회 중 오류가 발생했습니다.")
                    .data(createEmptyPositionResponse())
                    .build());
        }
    }

    /**
     * 프론트엔드 역 필터 정보 조회
     */
    @GetMapping("/filter/info")
    public ResponseEntity<ApiResponse> getFilterInfo() {
        try {
            Map<String, Object> filterInfo = metroPositionService.getFilterInfo();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("필터 정보 조회 성공")
                    .data(filterInfo)
                    .build());

        } catch (Exception e) {
            log.error("필터 정보 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("필터 정보 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    // ===== 시스템 정보 API =====

    /**
     * 활성화된 노선 목록 조회
     */
    @GetMapping("/lines")
    public ResponseEntity<ApiResponse> getEnabledLines() {
        try {
            List<Integer> enabledLines = metroPositionService.getEnabledLines();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("활성화된 노선 목록 조회 성공")
                    .data(Map.of(
                            "lines", enabledLines,
                            "count", enabledLines.size(),
                            "description", "현재 서비스 중인 지하철 노선",
                            "filteringEnabled", true
                    ))
                    .build());

        } catch (Exception e) {
            log.error("활성화된 노선 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("노선 목록 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 특정 노선 활성화 여부 확인
     */
    @GetMapping("/lines/{lineNumber}")
    public ResponseEntity<ApiResponse> checkLineStatus(@PathVariable Integer lineNumber) {
        try {
            boolean enabled = metroPositionService.isLineEnabled(lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 상태 확인 완료")
                    .data(Map.of(
                            "lineNumber", lineNumber,
                            "enabled", enabled,
                            "status", enabled ? "서비스 중" : "서비스 중단",
                            "filteringEnabled", true,
                            "description", enabled ?
                                    lineNumber + "호선 실시간 위치 서비스가 제공됩니다 " :
                                    lineNumber + "호선은 현재 서비스되지 않습니다"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("노선 상태 확인 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("노선 상태 확인 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 시스템 상태 요약 정보
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse> getSystemStatus() {
        try {
            MetroDataScheduler.SystemStatus systemStatus = dataScheduler.getSystemStatus();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("시스템 상태 조회 성공")
                    .data(systemStatus)
                    .build());

        } catch (Exception e) {
            log.error("시스템 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("시스템 상태 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 노선 번호 유효성 검사
     */
    private boolean isValidLineNumber(Integer lineNumber) {
        try {
            return lineNumber != null &&
                    lineNumber > 0 &&
                    lineNumber <= 10 &&
                    metroPositionService.isLineEnabled(lineNumber);
        } catch (Exception e) {
            log.warn("노선 번호 유효성 검사 실패: {}", lineNumber);
            return false;
        }
    }

    /**
     * 캐시 데이터를 MetroPositionResponse로 변환
     */
    private MetroPositionResponse convertCacheToResponse(MetroCacheService.PositionCacheData cacheData) {
        List<TrainPosition> positions = cacheData.getPositions() != null ?
                cacheData.getPositions() : List.of();

        // 노선별 통계 생성
        Map<String, Integer> lineStatistics = positions.stream()
                .filter(pos -> pos != null && pos.getLineNumber() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        pos -> pos.getLineNumber().toString(),
                        java.util.stream.Collectors.collectingAndThen(
                                java.util.stream.Collectors.counting(),
                                Math::toIntExact
                        )
                ));

        return MetroPositionResponse.builder()
                .positions(positions)
                .totalTrains(positions.size())
                .lineStatistics(lineStatistics)
                .lastUpdated(cacheData.getLastUpdated() != null ?
                        cacheData.getLastUpdated() : LocalDateTime.now())
                .nextUpdate(cacheData.getNextUpdateTime())
                .dataSource("API") // 실제 API 데이터임을 명시
                .realtime(true) // 실시간 데이터임을 명시
                .systemStatus("HEALTHY")
                .build();
    }

    /**
     * 빈 위치 응답 생성 (오류 시 대체 데이터)
     */
    private MetroPositionResponse createEmptyPositionResponse() {
        return MetroPositionResponse.builder()
                .positions(List.of())
                .totalTrains(0)
                .lineStatistics(Map.of())
                .lastUpdated(LocalDateTime.now())
                .dataSource("ERROR")
                .realtime(false)
                .systemStatus("ERROR")
                .build();
    }
}