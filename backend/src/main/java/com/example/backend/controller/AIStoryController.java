package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.game.PageResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.service.AIStoryService;
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

    /**
     * AI 서버에서 동적 스토리 생성 (GET 방식)
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
     * AI 서버 상태 확인
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

        // TODO: 실제 구현
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("구현 예정")
                .data(Map.of("station", stationName, "line", lineNumber))
                .build());
    }

    /**
     * 🔄 내부 API: 배치 스토리 생성
     */
    @PostMapping("/internal/batch-generate")
    public ResponseEntity<ApiResponse> batchGenerateStories() {

        log.info("내부 API - 배치 스토리 생성 시작");

        // TODO: 실제 구현
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("배치 생성 구현 예정")
                .build());
    }
}