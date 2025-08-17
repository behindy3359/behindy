package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.game.PageResponse;
import com.example.backend.dto.game.StoryResponse;
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
    private final AIStoryScheduler aiStoryScheduler; // 🆕 스케줄러 추가

    /**
     * AI 서버에서 동적 스토리 생성 (GET 방식) - 기존 유지
     */
    @GetMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> generateDynamicStoryGet(
            @RequestParam String stationName,
            @RequestParam Integer lineNumber,
            @RequestParam(defaultValue = "80") Integer characterHealth,
            @RequestParam(defaultValue = "80") Integer characterSanity) {

        try {
            log.info("동적 스토리 생성 요청 (GET): {}, {}호선", stationName, lineNumber);

            StoryResponse story = aiStoryService.generateStory(
                    stationName, lineNumber, characterHealth, characterSanity
            );

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("AI 스토리 생성 완료")
                    .data(story)
                    .build());

        } catch (Exception e) {
            log.error("동적 스토리 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("스토리 생성 중 오류가 발생했습니다.")
                    .build());
        }
    }

    /**
     * AI 서버 상태 확인 - 기존 유지
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

    // ===== 🆕 배치 생성 관련 API =====

    /**
     * AI 스토리 배치 시스템 상태 조회
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
     * 수동 배치 스토리 생성 실행
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
                            "message", "백그라운드에서 실행 중입니다."
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
     * 특정 역의 스토리 수동 생성
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
                        .message(String.format("%s-%d호선 스토리 생성이 완료되었습니다.", stationName, lineNumber))
                        .data(Map.of(
                                "stationName", stationName,
                                "lineNumber", lineNumber,
                                "result", "SUCCESS"
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
     * 스토리 부족 역 목록 조회
     */
    @GetMapping("/batch/stations-needing-stories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getStationsNeedingStories() {
        try {
            // 스케줄러에서 스토리 부족 역 정보를 가져오기 위해 시스템 상태 조회
            AIStoryScheduler.AIStorySystemStatus status = aiStoryScheduler.getSystemStatus();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("스토리 부족 역 정보 조회 완료")
                    .data(Map.of(
                            "stationsNeedingStories", status.getStationsNeedingStories(),
                            "dailyGenerated", status.getDailyGeneratedCount(),
                            "dailyLimit", status.getDailyGenerationLimit(),
                            "generationEnabled", status.getIsGenerationEnabled()
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

    // ===== 기존 내부 API들 유지 =====

    /**
     * 내부 API 파이프라인 테스트
     */
    @PostMapping("/internal/test-pipeline")
    public ResponseEntity<ApiResponse> testInternalPipeline() {
        log.info("=== 내부 API 파이프라인 테스트 시작 ===");

        try {
            // 1. AI 서버 호출 시뮬레이션
            log.info("1. AI 서버 호출 (Mock)");

            // 2. 데이터 변환 시뮬레이션
            log.info("2. 응답 데이터 변환");

            // 3. DB 저장 시뮬레이션
            log.info("3. 데이터베이스 저장");

            log.info("=== 파이프라인 테스트 완료 ===");

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("내부 API 파이프라인 테스트 성공")
                    .data(Map.of(
                            "step1", "AI 서버 호출 완료",
                            "step2", "데이터 변환 완료",
                            "step3", "DB 저장 완료"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("내부 API 파이프라인 테스트 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("파이프라인 테스트 실패: " + e.getMessage())
                    .build());
        }
    }

    /**
     * 🚀 내부 API: 특정 역의 스토리 생성
     */
    @PostMapping("/internal/generate-for-station")
    public ResponseEntity<ApiResponse> generateForStation(
            @RequestParam String stationName,
            @RequestParam Integer lineNumber) {

        log.info("내부 API - 특정 역 스토리 생성 요청: {}, {}호선", stationName, lineNumber);

        try {
            boolean success = aiStoryScheduler.manualStationGeneration(stationName, lineNumber);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(success)
                    .message(success ? "스토리 생성 완료" : "스토리 생성 실패")
                    .data(Map.of(
                            "station", stationName,
                            "line", lineNumber,
                            "result", success ? "SUCCESS" : "FAILED"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("내부 API 스토리 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("스토리 생성 중 오류 발생: " + e.getMessage())
                    .build());
        }
    }

    /**
     * 🔄 내부 API: 배치 스토리 생성
     */
    @PostMapping("/internal/batch-generate")
    public ResponseEntity<ApiResponse> batchGenerateStories() {

        log.info("내부 API - 배치 스토리 생성 시작");

        try {
            // 비동기 실행
            new Thread(() -> {
                try {
                    aiStoryScheduler.manualBatchGeneration();
                } catch (Exception e) {
                    log.error("내부 API 배치 생성 실행 중 오류: {}", e.getMessage(), e);
                }
            }).start();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("배치 스토리 생성이 시작되었습니다.")
                    .data(Map.of(
                            "execution", "ASYNC",
                            "status", "STARTED"
                    ))
                    .build());

        } catch (Exception e) {
            log.error("내부 API 배치 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("배치 생성 실패: " + e.getMessage())
                    .build());
        }
    }

    /**
     * 🔍 내부 API: 시스템 상태 조회
     */
    @GetMapping("/internal/system-status")
    public ResponseEntity<ApiResponse> getInternalSystemStatus() {
        try {
            AIStoryScheduler.AIStorySystemStatus status = aiStoryScheduler.getSystemStatus();
            boolean aiServerHealthy = aiStoryService.isAIServerHealthy();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("시스템 상태 조회 완료")
                    .data(Map.of(
                            "batchSystem", status,
                            "aiServerHealthy", aiServerHealthy,
                            "timestamp", System.currentTimeMillis()
                    ))
                    .build());

        } catch (Exception e) {
            log.error("내부 API 시스템 상태 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("시스템 상태 조회 실패: " + e.getMessage())
                    .build());
        }
    }

    // ===== 🔧 개발/디버깅용 API =====

    /**
     * 개발용: AI 서버 연결 테스트
     */
    @GetMapping("/dev/test-ai-connection")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> testAIConnection() {
        try {
            boolean isHealthy = aiStoryService.isAIServerHealthy();

            // 간단한 스토리 생성 테스트
            StoryResponse testStory = aiStoryService.generateStory("시청", 1, 80, 80);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("AI 서버 연결 테스트 완료")
                    .data(Map.of(
                            "healthCheck", isHealthy,
                            "storyGeneration", testStory != null,
                            "testStory", testStory
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
     * 개발용: 스케줄러 강제 실행 (테스트용)
     */
    @PostMapping("/dev/force-schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> forceScheduleExecution() {
        try {
            log.info("=== 개발용: 스케줄러 강제 실행 ===");

            // 별도 스레드에서 실행
            new Thread(() -> {
                try {
                    aiStoryScheduler.testStoryGeneration();
                } catch (Exception e) {
                    log.error("강제 스케줄 실행 오류: {}", e.getMessage(), e);
                }
            }).start();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("스케줄러가 강제 실행되었습니다.")
                    .data(Map.of(
                            "execution", "FORCED",
                            "mode", "DEVELOPMENT"
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