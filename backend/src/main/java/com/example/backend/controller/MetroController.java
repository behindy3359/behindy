package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.metro.MetroPositionResponse;
import com.example.backend.service.MetroPositionService;
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
@CrossOrigin(origins = "*") // 프론트엔드 연동용 (실제 배포시 수정 필요)
public class MetroController {

    private final MetroPositionService metroPositionService;
    private final MetroStationFilter stationFilter;
    private final MetroDataScheduler dataScheduler;

    /**
     * 전체 노선 열차 위치 정보 조회
     */
    @GetMapping("/positions")
    public ResponseEntity<ApiResponse> getAllPositions() {
        try {
            MetroPositionResponse positions = metroPositionService.getAllPositions();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("전체 노선 위치 정보 조회 성공")
                    .data(positions)
                    .build());

        } catch (Exception e) {
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
        try {
            // 노선 번호 유효성 검사
            if (!isValidLineNumber(lineNumber)) {
                return ResponseEntity.badRequest().body(ApiResponse.builder()
                        .success(false)
                        .message("유효하지 않은 노선 번호입니다: " + lineNumber)
                        .build());
            }

            MetroPositionResponse positions = metroPositionService.getLinePositions(lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 위치 정보 조회 성공 ")
                    .data(positions)
                    .build());

        } catch (Exception e) {
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
     * 위치 정보 요약 (프론트엔드 디버깅용)
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getPositionSummary() {
        try {
            MetroPositionResponse positions = metroPositionService.getAllPositions();

            Map<String, Object> summary = Map.of(
                    "overview", positions.getSummary(),
                    "statistics", Map.of(
                            "totalTrains", positions.getTotalTrains(),
                            "upTrains", positions.getUpTrainCount(),
                            "downTrains", positions.getDownTrainCount(),
                            "lineBreakdown", positions.getLineStatisticsSummary()
                    ),
                    "systemInfo", Map.of(
                            "dataSource", positions.getDataSource(),
                            "isRealtime", positions.getIsRealtime(),
                            "isMockData", positions.isMockData(),
                            "systemStatus", positions.getSystemStatus(),
                            "filteringEnabled", true
                    ),
                    "timing", Map.of(
                            "lastUpdated", positions.getLastUpdated(),
                            "nextUpdate", positions.getNextUpdate(),
                            "isFresh", positions.isFresh()
                    ),
                    "filtering", Map.of(
                            "frontendStationCount", stationFilter.getFrontendStationIds().size(),
                            "stationsByLine", stationFilter.getFrontendStationCountByLine(),
                            "description", "프론트엔드 132개 역만 필터링하여 제공"
                    )
            );

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("위치 정보 요약 조회 성공 ")
                    .data(summary)
                    .build());

        } catch (Exception e) {
            log.error("위치 정보 요약 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("위치 정보 요약 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    // ===== 관리자용 API =====

    /**
     * 수동 데이터 업데이트 (관리자용)
     */
    @PostMapping("/admin/update")
    public ResponseEntity<ApiResponse> manualUpdate() {
        try {
            dataScheduler.manualUpdate();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("수동 업데이트가 시작되었습니다 ")
                    .data(Map.of(
                            "updateTime", LocalDateTime.now(),
                            "filteringEnabled", true,
                            "description", "프론트엔드 역만 필터링하여 업데이트됩니다"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("수동 업데이트 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("수동 업데이트 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 특정 노선 수동 업데이트 (관리자용)
     */
    @PostMapping("/admin/update/{lineNumber}")
    public ResponseEntity<ApiResponse> manualLineUpdate(@PathVariable String lineNumber) {
        try {
            dataScheduler.manualLineUpdate(lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 수동 업데이트가 시작되었습니다 ")
                    .data(Map.of(
                            "lineNumber", lineNumber,
                            "updateTime", LocalDateTime.now(),
                            "filteringEnabled", true
                    ))
                    .build());

        } catch (Exception e) {
            log.error("{}호선 수동 업데이트 실패: {}", lineNumber, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message(lineNumber + "호선 수동 업데이트 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 긴급 캐시 클리어 (관리자용)
     */
    @DeleteMapping("/admin/cache/clear")
    public ResponseEntity<ApiResponse> emergencyCacheClear() {
        try {
            dataScheduler.emergencyCacheClear();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("긴급 캐시 클리어가 완료되었습니다 (필터링 시스템 유지)")
                    .data(Map.of(
                            "clearTime", LocalDateTime.now(),
                            "filteringEnabled", true,
                            "description", "캐시가 클리어되고 필터링이 적용된 새 데이터로 재로드됩니다"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("긴급 캐시 클리어 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("긴급 캐시 클리어 중 오류가 발생했습니다.")
                    .build());
        }
    }

    // ===== 유틸리티 메서드들 =====

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
     * 빈 위치 응답 생성 (오류 시 대체 데이터)
     */
    private MetroPositionResponse createEmptyPositionResponse() {
        return MetroPositionResponse.builder()
                .positions(List.of())
                .totalTrains(0)
                .lineStatistics(Map.of())
                .lastUpdated(LocalDateTime.now())
                .dataSource("ERROR")
                .isRealtime(false)
                .systemStatus("ERROR")
                .build();
    }
}