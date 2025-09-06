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
        log.info("🔍 게임 진입 자격 확인 요청");

        try {
            GameEligibilityResponse response = gameService.checkGameEligibility();
            log.info("✅ 게임 진입 자격 확인 완료: canStart={}, reason={}, hasActiveGame={}",
                    response.isCanStartGame(), response.getReason(), response.isHasActiveGame());

            if (response.getCharacter() != null) {
                log.info("   캐릭터 정보: charId={}, health={}, sanity={}",
                        response.getCharacter().getCharId(),
                        response.getCharacter().getCharHealth(),
                        response.getCharacter().getCharSanity());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 게임 진입 자격 확인 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 현재 게임 상태 조회
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStateResponse> getCurrentGameState() {
        log.info("🔍 현재 게임 상태 조회 요청");

        try {
            GameStateResponse response = gameService.getCurrentGameState();
            log.info("✅ 현재 게임 상태 조회 완료: hasActiveGame={}", response.isHasActiveGame());

            if (response.isHasActiveGame()) {
                log.info("   게임 정보: storyId={}, storyTitle={}, currentPage={}, startTime={}",
                        response.getStoryId(), response.getStoryTitle(),
                        response.getCurrentPage() != null ? response.getCurrentPage().getPageNumber() : "null",
                        response.getGameStartTime());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 현재 게임 상태 조회 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 게임 시작
     */
    @PostMapping("/start/{storyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStartResponse> startGame(@PathVariable Long storyId) {
        log.info("🎮 게임 시작 요청: storyId={}", storyId);

        try {
            GameStartResponse response = gameService.startGame(storyId);
            log.info("✅ 게임 시작 성공: storyId={}, storyTitle={}, charId={}",
                    response.getStoryId(), response.getStoryTitle(),
                    response.getCharacter() != null ? response.getCharacter().getCharId() : "null");

            if (response.getCurrentPage() != null) {
                log.info("   시작 페이지: pageId={}, pageNumber={}, options={}개",
                        response.getCurrentPage().getPageId(),
                        response.getCurrentPage().getPageNumber(),
                        response.getCurrentPage().getOptions() != null ? response.getCurrentPage().getOptions().size() : 0);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException e) {
            log.warn("⚠️ 게임 시작 실패 - 이미 진행 중: storyId={}, error={}", storyId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ 게임 시작 실패: storyId={}, error={}", storyId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 역 기반 게임 진입 (핵심 기능)
     */
    @PostMapping("/enter/station/{stationName}/line/{lineNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameEnterResponse> enterGameByStation(
            @PathVariable String stationName,
            @PathVariable Integer lineNumber) {

        log.info("🚇 역 기반 게임 진입 요청: station={}, line={}", stationName, lineNumber);

        try {
            GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);
            log.info("✅ 역 기반 게임 진입 처리 완료: success={}, action={}, station={}-{}",
                    response.isSuccess(), response.getAction(), stationName, lineNumber);

            if (response.getSelectedStoryId() != null) {
                log.info("   새 게임: storyId={}, storyTitle={}",
                        response.getSelectedStoryId(), response.getSelectedStoryTitle());
            }

            if (response.getResumeStoryId() != null) {
                log.info("   기존 게임: storyId={}, storyTitle={}",
                        response.getResumeStoryId(), response.getResumeStoryTitle());
            }

            if (response.getAvailableStories() != null) {
                log.info("   사용 가능한 스토리: {}개", response.getAvailableStories().size());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 역 기반 게임 진입 실패: station={}, line={}, error={}",
                    stationName, lineNumber, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 게임 재개 (기존 진행 상황 이어서)
     */
    @PostMapping("/resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameResumeResponse> resumeGame() {
        log.info("▶️ 게임 재개 요청");

        try {
            GameResumeResponse response = gameService.resumeGame();
            log.info("✅ 게임 재개 성공: storyId={}, storyTitle={}, currentPage={}, startTime={}",
                    response.getStoryId(), response.getStoryTitle(),
                    response.getCurrentPage() != null ? response.getCurrentPage().getPageNumber() : "null",
                    response.getGameStartTime());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 게임 재개 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 선택지 선택
     */
    @PostMapping("/choice/{optionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChoiceResultResponse> makeChoice(@PathVariable Long optionId) {
        log.info("🎯 선택지 선택 요청: optionId={}", optionId);

        try {
            ChoiceResultResponse response = gameService.makeChoice(optionId);
            log.info("✅ 선택지 처리 완료: optionId={}, success={}, isGameOver={}, result={}",
                    optionId, response.isSuccess(), response.isGameOver(), response.getResult());

            if (response.getUpdatedCharacter() != null) {
                log.info("   캐릭터 상태: health={}, sanity={}, alive={}",
                        response.getUpdatedCharacter().getCharHealth(),
                        response.getUpdatedCharacter().getCharSanity(),
                        response.getUpdatedCharacter().isAlive());
            }

            if (response.getNextPage() != null) {
                log.info("   다음 페이지: pageId={}, pageNumber={}, options={}개",
                        response.getNextPage().getPageId(),
                        response.getNextPage().getPageNumber(),
                        response.getNextPage().getOptions() != null ? response.getNextPage().getOptions().size() : 0);
            }

            if (response.isGameOver()) {
                log.info("🏁 게임 종료: reason={}", response.getGameOverReason());
            }

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("⚠️ 잘못된 선택지: optionId={}, error={}", optionId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ 선택지 처리 실패: optionId={}, error={}", optionId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 게임 포기
     */
    @PostMapping("/quit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameQuitResponse> quitGame() {
        log.info("🏃 게임 포기 요청");

        try {
            GameQuitResponse response = gameService.quitGame();
            log.info("✅ 게임 포기 처리 완료: success={}", response.isSuccess());

            if (response.getCharacter() != null) {
                log.info("   캐릭터 상태: charId={}, health={}, sanity={}",
                        response.getCharacter().getCharId(),
                        response.getCharacter().getCharHealth(),
                        response.getCharacter().getCharSanity());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 게임 포기 처리 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    // === 관리자용 API ===

    /**
     * 진행 중인 모든 게임 세션 조회 (관리자용)
     */
    @GetMapping("/admin/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActiveGameSessionResponse>> getAllActiveGameSessions() {
        log.info("👑 관리자 - 활성 게임 세션 조회 요청");

        try {
            List<ActiveGameSessionResponse> sessions = gameService.getAllActiveGameSessions();
            log.info("✅ 활성 게임 세션 조회 완료: {}개 세션", sessions.size());

            sessions.forEach(session ->
                    log.debug("   세션: charId={}, charName={}, storyId={}, page={}, startTime={}",
                            session.getCharacterId(), session.getCharacterName(),
                            session.getStoryId(), session.getCurrentPageNumber(), session.getGameStartTime())
            );

            return ResponseEntity.ok(sessions);

        } catch (Exception e) {
            log.error("❌ 활성 게임 세션 조회 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 특정 스토리의 진행 통계 조회 (관리자용)
     */
    @GetMapping("/admin/stories/{storyId}/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoryStatisticsResponse> getStoryStatistics(@PathVariable Long storyId) {
        log.info("👑 관리자 - 스토리 통계 조회 요청: storyId={}", storyId);

        try {
            StoryStatisticsResponse statistics = gameService.getStoryStatistics(storyId);
            log.info("✅ 스토리 통계 조회 완료: storyId={}, title={}, currentPlayers={}, totalPages={}",
                    statistics.getStoryId(), statistics.getStoryTitle(),
                    statistics.getCurrentPlayers(), statistics.getTotalPages());

            return ResponseEntity.ok(statistics);

        } catch (Exception e) {
            log.error("❌ 스토리 통계 조회 실패: storyId={}, error={}", storyId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 오래된 게임 세션 정리 (관리자용)
     */
    @DeleteMapping("/admin/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> cleanupOldGameSessions(
            @RequestParam(defaultValue = "7") int daysOld) {

        log.info("👑 관리자 - 오래된 게임 세션 정리 요청: daysOld={}", daysOld);

        try {
            int cleanedCount = gameService.cleanupOldGameSessions(daysOld);
            log.info("✅ 오래된 게임 세션 정리 완료: {}개 세션 정리", cleanedCount);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(String.format("%d개의 오래된 게임 세션이 정리되었습니다.", cleanedCount))
                    .data(cleanedCount)
                    .build());

        } catch (Exception e) {
            log.error("❌ 오래된 게임 세션 정리 실패: daysOld={}, error={}", daysOld, e.getMessage(), e);
            throw e;
        }
    }
}