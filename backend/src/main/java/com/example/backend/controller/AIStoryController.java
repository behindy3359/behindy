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
     * AI 서버에서 동적 스토리 생성
     */
    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> generateDynamicStory(
            @RequestParam String stationName,
            @RequestParam Integer lineNumber,
            @RequestParam(defaultValue = "80") Integer characterHealth,
            @RequestParam(defaultValue = "80") Integer characterSanity) {

        try {
            log.info("동적 스토리 생성 요청: {}, {}호선", stationName, lineNumber);

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
     * AI 서버에서 스토리 진행
     */
    @PostMapping("/continue")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> continueStory(
            @RequestParam String stationName,
            @RequestParam Integer lineNumber,
            @RequestParam Integer characterHealth,
            @RequestParam Integer characterSanity,
            @RequestParam String previousChoice,
            @RequestParam(required = false) String storyContext) {

        try {
            log.info("AI 스토리 진행 요청: {}, 선택: {}", stationName, previousChoice);

            PageResponse page = aiStoryService.continueStory(
                    stationName, lineNumber, characterHealth, characterSanity,
                    previousChoice, storyContext
            );

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("AI 스토리 진행 완료")
                    .data(page)
                    .build());

        } catch (Exception e) {
            log.error("AI 스토리 진행 실패: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("스토리 진행 중 오류가 발생했습니다.")
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
}