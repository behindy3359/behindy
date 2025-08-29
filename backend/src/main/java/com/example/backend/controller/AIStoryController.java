// 🔥 간소화된 AIStoryController.java - LLM 서버 상태 확인만
package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.service.AIStoryService;
import com.example.backend.service.AIStoryScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * LLM 서버 상태 확인 및 기본 관리
 */
@Slf4j
@RestController
@RequestMapping("/api/ai-stories")
@RequiredArgsConstructor
public class AIStoryController {

    private final AIStoryService aiStoryService;
    private final AIStoryScheduler aiStoryScheduler;

    /**
     * LLM 서버 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> checkLLMServerHealth() {
        boolean isHealthy = aiStoryService.isLLMServerHealthy();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(isHealthy)
                .message(isHealthy ? "LLM 서버 정상 동작" : "LLM 서버 연결 불가")
                .data(aiStoryScheduler.getSystemStatus())
                .build());
    }
}