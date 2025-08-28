package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.service.AIStoryService;
import com.example.backend.service.AIStoryScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ai-stories")
@RequiredArgsConstructor
public class AIStoryController {

    private final AIStoryService aiStoryService;
    private final AIStoryScheduler aiStoryScheduler;

    /**
     * 🔍 AI 서버 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> checkAIServerHealth() {
        boolean isHealthy = aiStoryService.isAIServerHealthy();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(isHealthy)
                .message(isHealthy ? "AI 서버 정상 동작" : "AI 서버 연결 불가")
                .data(Map.of(
                        "aiServerHealthy", isHealthy,
                        "fallbackMode", !isHealthy ? "Mock 데이터 모드" : "정상 모드"
                ))
                .build());
    }

    // ===== 🆕 배치 생성 관리 API =====

    /**
     * 📊 AI 스토리 배치 시스템 상태 조회
     */
    @GetMapping("/batch/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getBatchSystemStatus() {
        try {
            AIStoryScheduler.AIStorySystemStatus status = aiStoryScheduler.getSystemStatus();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("AI 스토리 배치 시스템 상태 조회 완료")
                    .data(status)
                    .build());

        } catch (Exception e) {
            log.error("배치 시스템 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("시스템 상태 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 🚀 수동 배치 스토리 생성 실행
     */
    @PostMapping("/batch/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> triggerManualBatchGeneration() {
        try {
            log.info("=== 관리자 요청: 수동 배치 스토리 생성 ===");

            // 비동기로 실행 (응답 지연 방지)
            new Thread(() -> {
                try {
                    aiStoryScheduler.manualBatchGeneration();
                } catch (Exception e) {
                    log.error("수동 배치 생성 실행 중 오류: {}", e.getMessage(), e);
                }
            }).start();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("배치 스토리 생성이 시작되었습니다. 진행 상황은 로그를 확인해주세요.")
                    .data(Map.of(
                            "execution", "ASYNC",
                            "message", "백그라운드에서 실행 중입니다.",
                            "note", "5분 타임아웃이 적용됩니다."
                    ))
                    .build());

        } catch (Exception e) {
            log.error("수동 배치 생성 실행 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("배치 생성 실행 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 🎯 특정 역의 스토리 수동 생성
     */
    @PostMapping("/batch/generate/station")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> generateStoryForSpecificStation(
            @RequestParam String stationName,
            @RequestParam Integer lineNumber) {

        try {
            log.info("=== 관리자 요청: 특정 역 스토리 생성 - {}-{}호선 ===", stationName, lineNumber);

            boolean success = aiStoryScheduler.manualStationGeneration(stationName, lineNumber);

            if (success) {
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .message(String.format("%s-%d호선 스토리 생성이 완료되었습니다. (5분 타임아웃 적용)",
                                stationName, lineNumber))
                        .data(Map.of(
                                "stationName", stationName,
                                "lineNumber", lineNumber,
                                "result", "SUCCESS",
                                "timeout", "5분"
                        ))
                        .build());
            } else {
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(false)
                        .message(String.format("%s-%d호선 스토리 생성에 실패했습니다.", stationName, lineNumber))
                        .data(Map.of(
                                "stationName", stationName,
                                "lineNumber", lineNumber,
                                "result", "FAILED"
                        ))
                        .build());
            }

        } catch (Exception e) {
            log.error("특정 역 스토리 생성 실패: {}-{}호선, {}", stationName, lineNumber, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("스토리 생성 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * 📈 스토리 부족 역 목록 조회
     */
    @GetMapping("/batch/stations-needing-stories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getStationsNeedingStories() {
        try {
            AIStoryScheduler.AIStorySystemStatus status = aiStoryScheduler.getSystemStatus();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("스토리 부족 역 정보 조회 완료")
                    .data(Map.of(
                            "stationsNeedingStories", status.getStationsNeedingStories(),
                            "dailyGenerated", status.getDailyGeneratedCount(),
                            "dailyLimit", status.getDailyGenerationLimit(),
                            "generationEnabled", status.getIsGenerationEnabled(),
                            "aiServerEnabled", status.getIsAIServerEnabled(),
                            "isGenerating", status.getIsGenerating()
                    ))
                    .build());

        } catch (Exception e) {
            log.error("스토리 부족 역 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("역 정보 조회 중 오류가 발생했습니다.")
                    .build());
        }
    }

    // ===== 🔧 개발/디버깅용 API =====

    /**
     * 🧪 AI 서버 연결 테스트 (개발용)
     */
    @GetMapping("/dev/test-ai-connection")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> testAIConnection() {
        try {
            boolean isHealthy = aiStoryService.isAIServerHealthy();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("AI 서버 연결 테스트 완료")
                    .data(Map.of(
                            "healthCheck", isHealthy,
                            "aiServerUrl", "확인됨",
                            "timeout", Map.of(
                                    "healthCheck", "10초",
                                    "storyGeneration", "5분"
                            )
                    ))
                    .build());

        } catch (Exception e) {
            log.error("AI 서버 연결 테스트 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("AI 서버 연결 테스트 실패: " + e.getMessage())
                    .build());
        }
    }

    /**
     * 🔧 스케줄러 강제 실행 (개발용)
     */
    @PostMapping("/dev/force-schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> forceScheduleExecution() {
        try {
            log.info("=== 개발용: 스케줄러 강제 실행 (5분 타임아웃) ===");

            // 별도 스레드에서 실행
            new Thread(() -> {
                try {
                    aiStoryScheduler.manualBatchGeneration();
                } catch (Exception e) {
                    log.error("강제 스케줄 실행 오류: {}", e.getMessage(), e);
                }
            }).start();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("스케줄러가 강제 실행되었습니다. (5분 타임아웃 적용)")
                    .data(Map.of(
                            "execution", "FORCED",
                            "mode", "DEVELOPMENT",
                            "timeout", "300초"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("스케줄러 강제 실행 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("스케줄러 실행 실패: " + e.getMessage())
                    .build());
        }
    }

}