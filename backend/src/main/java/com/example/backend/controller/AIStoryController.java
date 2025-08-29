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

/**
 * llm 통신용 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/ai-stories")
@RequiredArgsConstructor
public class AIStoryController {

    private final AIStoryService aiStoryService;
    private final AIStoryScheduler aiStoryScheduler;

    /**
     *  AI 서버 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> checkAIServerHealth() {
        boolean isHealthy = aiStoryService.isAIServerHealthy();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(isHealthy)
                .message(isHealthy ? "AI 서버 정상 동작" : "AI 서버 연결 불가")
                .data(Map.of(
                        "aiServerHealthy", isHealthy,
                        "status", isHealthy ? "HEALTHY" : "UNAVAILABLE"
                ))
                .build());
    }


}