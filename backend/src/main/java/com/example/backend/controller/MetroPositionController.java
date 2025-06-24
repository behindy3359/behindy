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
 * 단순화된 지하철 위치 정보 API 컨트롤러
 * 노선도 애니메이션에 최적화된 엔드포인트 제공
 */
@Slf4j
@RestController
@RequestMapping("/api/metro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동용 (실제 배포시 수정 필요)
public class MetroPositionController {

    private final MetroPositionService metroPositionService;

    /**
     * 전체 노선 열차 위치 정보 조회 (새로운 API)
     * 기존 /api/metro/realtime/all 을 대체
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
                    .data(createEmptyPositionsResponse())
                    .build());
        }
    }

    /**
     * 특정 노선 열차 위치 정보 조회 (새로운 API)
     * 기존 /api/metro/realtime/line/{lineNumber} 를 대체
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
                    .data(createEmptyPositionsResponse())
                    .build());
        }
    }

    /**
     * 활성화된 노선 목록 조회
     */
    @GetMapping("/lines/enabled")
    public ResponseEntity<ApiResponse> getEnabledLines() {
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("활성화된 노선 목록 조회 성공")
                    .data(metroPositionService.getEnabledLines())
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
    @GetMapping("/lines/{lineNumber}/enabled")
    public ResponseEntity<ApiResponse> isLineEnabled(@PathVariable Integer lineNumber) {
        try {
            boolean enabled = metroPositionService.isLineEnabled(lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(lineNumber + "호선 활성화 여부 확인 완료")
                    .data(Map.of(
                            "lineNumber", lineNumber,
                            "enabled", enabled,
                            "message", enabled ? "활성화된 노선입니다" : "비활성화된 노선입니다"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("노선 활성화 여부 확인 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("노선 활성화 여부 확인 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 간단한 위치 정보 요약 (디버깅용)
     */
    @GetMapping("/positions/summary")
    public ResponseEntity<ApiResponse> getPositionsSummary() {
        try {
            MetroPositionResponse positions = metroPositionService.getAllPositions();

            Map<String, Object> summary = Map.of(
                    "totalTrains", positions.getTotalTrains(),
                    "activeLines", positions.getActiveLineCount(),
                    "lineStatistics", positions.getLineStatistics(),
                    "dataSource", positions.getDataSource(),
                    "isRealtime", positions.getIsRealtime(),
                    "systemStatus", positions.getSystemStatus(),
                    "lastUpdated", positions.getLastUpdated(),
                    "isFresh", positions.isFresh()
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

    // === 유틸리티 메서드들 ===

    /**
     * 노선 번호 유효성 검사 - 활성화된 노선만 허용
     */
    private boolean isValidLineNumber(Integer lineNumber) {
        try {
            return metroPositionService.isLineEnabled(lineNumber);
        } catch (Exception e) {
            log.warn("노선 번호 유효성 검사 실패: {}", lineNumber);
            return false;
        }
    }

    /**
     * 빈 위치 응답 생성 (오류 시 대체 데이터)
     */
    private MetroPositionResponse createEmptyPositionsResponse() {
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