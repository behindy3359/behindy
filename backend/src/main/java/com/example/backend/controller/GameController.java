package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.game.*;
import com.example.backend.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.game.GameEnterResponse;
import com.example.backend.dto.character.CharacterGameStatusResponse;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    /**
     * 게임 진입 자격 확인
     */
    @GetMapping("/eligibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameEligibilityResponse> checkGameEligibility() {
        GameEligibilityResponse response = gameService.checkGameEligibility();
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 게임 상태 조회
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStateResponse> getCurrentGameState() {
        GameStateResponse response = gameService.getCurrentGameState();
        return ResponseEntity.ok(response);
    }

    /**
     * 게임 시작
     */
    @PostMapping("/start/{storyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStartResponse> startGame(@PathVariable Long storyId) {
        GameStartResponse response = gameService.startGame(storyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 역 기반 게임 진입 (핵심 기능)
     */
    @PostMapping("/enter/station/{stationName}/line/{lineNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameEnterResponse> enterGameByStation(
            @PathVariable String stationName,
            @PathVariable Integer lineNumber) {
        GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * 게임 재개 (기존 진행 상황 이어서)
     */
    @PostMapping("/resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameResumeResponse> resumeGame() {
        GameResumeResponse response = gameService.resumeGame();
        return ResponseEntity.ok(response);
    }

    /**
     * 선택지 선택
     */
    @PostMapping("/choice/{optionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChoiceResultResponse> makeChoice(@PathVariable Long optionId) {
        ChoiceResultResponse response = gameService.makeChoice(optionId);
        return ResponseEntity.ok(response);
    }

    /**
     * 게임 포기
     */
    @PostMapping("/quit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameQuitResponse> quitGame() {
        GameQuitResponse response = gameService.quitGame();
        return ResponseEntity.ok(response);
    }

    // === 관리자용 API ===

    /**
     * 진행 중인 모든 게임 세션 조회 (관리자용)
     */
    @GetMapping("/admin/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActiveGameSessionResponse>> getAllActiveGameSessions() {
        List<ActiveGameSessionResponse> sessions = gameService.getAllActiveGameSessions();
        return ResponseEntity.ok(sessions);
    }

    /**
     * 특정 스토리의 진행 통계 조회 (관리자용)
     */
    @GetMapping("/admin/stories/{storyId}/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoryStatisticsResponse> getStoryStatistics(@PathVariable Long storyId) {
        StoryStatisticsResponse statistics = gameService.getStoryStatistics(storyId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 오래된 게임 세션 정리 (관리자용)
     */
    @DeleteMapping("/admin/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> cleanupOldGameSessions(
            @RequestParam(defaultValue = "7") int daysOld) {
        int cleanedCount = gameService.cleanupOldGameSessions(daysOld);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message(String.format("%d개의 오래된 게임 세션이 정리되었습니다.", cleanedCount))
                .data(cleanedCount)
                .build());
    }
}