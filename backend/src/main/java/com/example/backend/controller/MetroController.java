package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.metro.MetroPositionResponse;
import com.example.backend.service.MetroPositionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 지하철 위치 정보 API 컨트롤러 (최종 버전)
 * 깔끔하고 단순한 구조로 완전히 새롭게 설계
 */
@Slf4j
@RestController
@RequestMapping("/api/metro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용 (실제 배포시 수정 필요)
public class MetroController {

    private final MetroPositionService metroPositionService;

    // ===== 핵심 위치 API =====

    /**
     * 전체 노선 열차 위치 정보 조회
     * 프론트엔드에서 가장 많이 사용할 주요 API
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
                    .message(lineNumber + "호선 위치 정보 조회 성공")
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
                            "description", "현재 서비스 중인 지하철 노선"
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
                            "description", enabled ?
                                    lineNumber + "호선 실시간 위치 서비스가 제공됩니다" :
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
            MetroPositionResponse allPositions = metroPositionService.getAllPositions();

            Map<String, Object> statusInfo = Map.of(
                    "systemStatus", allPositions.getSystemStatus(),
                    "totalTrains", allPositions.getTotalTrains(),
                    "activeLines", allPositions.getActiveLineCount(),
                    "lineStatistics", allPositions.getLineStatistics(),
                    "dataSource", allPositions.getDataSource(),
                    "isRealtime", allPositions.getIsRealtime(),
                    "lastUpdated", allPositions.getLastUpdated(),
                    "isFresh", allPositions.isFresh(),
                    "summary", allPositions.getSummary()
            );

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("시스템 상태 조회 성공")
                    .data(statusInfo)
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
                            "systemStatus", positions.getSystemStatus()
                    ),
                    "timing", Map.of(
                            "lastUpdated", positions.getLastUpdated(),
                            "nextUpdate", positions.getNextUpdate(),
                            "isFresh", positions.isFresh()
                    )
            );

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("위치 정보 요약 조회 성공")
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

    // ===== 호환성 API (기존 API 리다이렉트) =====

    /**
     * 기존 API 호환성 - 전체 노선
     * @deprecated /api/metro/positions 사용 권장
     */
    @GetMapping("/realtime/all")
    @Deprecated
    public ResponseEntity<ApiResponse> getLegacyAllPositions() {
        log.warn("⚠️ Deprecated API 호출: /realtime/all → /positions 로 리다이렉트");
        return getAllPositions();
    }

    /**
     * 기존 API 호환성 - 특정 노선
     * @deprecated /api/metro/positions/{lineNumber} 사용 권장
     */
    @GetMapping("/realtime/line/{lineNumber}")
    @Deprecated
    public ResponseEntity<ApiResponse> getLegacyLinePositions(@PathVariable String lineNumber) {
        log.warn("⚠️ Deprecated API 호출: /realtime/line/{} → /positions/{} 로 리다이렉트",
                lineNumber, lineNumber);

        try {
            Integer line = Integer.parseInt(lineNumber);
            return getLinePositions(line);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("유효하지 않은 노선 번호입니다: " + lineNumber)
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