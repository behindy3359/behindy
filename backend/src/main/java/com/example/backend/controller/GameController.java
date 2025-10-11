package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.game.*;
import com.example.backend.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "게임 API", description = "게임 플레이, 선택지 진행, 게임 상태 관리 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @Operation(summary = "게임 진입 자격 확인", description = "현재 사용자가 게임을 시작할 수 있는지 확인합니다. 살아있는 캐릭터 존재 여부, 진행 중인 게임 유무 등을 체크합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "자격 확인 완료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @GetMapping("/eligibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameEligibilityResponse> checkGameEligibility() {
        GameEligibilityResponse response = gameService.checkGameEligibility();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "현재 게임 상태 조회", description = "진행 중인 게임의 현재 상태를 조회합니다. 현재 노드, 캐릭터 스탯, 사용 가능한 선택지 등을 반환합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게임 상태 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "진행 중인 게임 없음")
    })
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStateResponse> getCurrentGameState() {
        GameStateResponse response = gameService.getCurrentGameState();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 시작", description = "특정 스토리를 선택하여 새로운 게임을 시작합니다. 게임 세션이 생성되고 첫 번째 노드로 이동합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "게임 시작 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "이미 진행 중인 게임이 있음")
    })
    @PostMapping("/start/{storyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameStartResponse> startGame(
            @Parameter(description = "시작할 스토리 ID", required = true) @PathVariable Long storyId) {
        GameStartResponse response = gameService.startGame(storyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "역 기반 게임 진입", description = "사용자의 실제 위치(지하철역)를 기반으로 게임에 진입합니다. 해당 역의 스토리가 자동으로 선택되어 게임이 시작됩니다. (핵심 기능)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게임 진입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "해당 역의 스토리 없음")
    })
    @PostMapping("/enter/station/{stationName}/line/{lineNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameEnterResponse> enterGameByStation(
            @Parameter(description = "현재 위치한 지하철역 이름 (예: 강남)", required = true) @PathVariable String stationName,
            @Parameter(description = "현재 위치한 노선 번호 (예: 2)", required = true) @PathVariable Integer lineNumber) {
        GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 재개", description = "이전에 중단했던 게임을 이어서 진행합니다. 마지막으로 저장된 지점부터 다시 시작합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게임 재개 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "재개할 게임 없음")
    })
    @PostMapping("/resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameResumeResponse> resumeGame() {
        GameResumeResponse response = gameService.resumeGame();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "선택지 선택", description = "게임 진행 중 제시된 선택지 중 하나를 선택합니다. 선택에 따라 다음 노드로 이동하고 캐릭터 스탯이 변경될 수 있습니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "선택 처리 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "선택지를 찾을 수 없음")
    })
    @PostMapping("/choice/{optionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChoiceResultResponse> makeChoice(
            @Parameter(description = "선택할 선택지 ID", required = true) @PathVariable Long optionId) {
        ChoiceResultResponse response = gameService.makeChoice(optionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 포기", description = "진행 중인 게임을 포기하고 종료합니다. 게임 세션이 종료되고 결과가 기록됩니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게임 포기 처리 완료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "진행 중인 게임 없음")
    })
    @PostMapping("/quit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GameQuitResponse> quitGame() {
        GameQuitResponse response = gameService.quitGame();
        return ResponseEntity.ok(response);
    }

    // === 관리자용 API ===

    @Operation(summary = "[관리자] 진행 중인 모든 게임 세션 조회", description = "시스템에서 현재 진행 중인 모든 게임 세션을 조회합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "세션 목록 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    })
    @GetMapping("/admin/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActiveGameSessionResponse>> getAllActiveGameSessions() {
        List<ActiveGameSessionResponse> sessions = gameService.getAllActiveGameSessions();
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "[관리자] 특정 스토리의 진행 통계 조회", description = "특정 스토리의 플레이 통계를 조회합니다. 총 플레이 수, 완료율, 평균 플레이 시간 등의 정보를 제공합니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "통계 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자 권한 필요"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "스토리를 찾을 수 없음")
    })
    @GetMapping("/admin/stories/{storyId}/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoryStatisticsResponse> getStoryStatistics(
            @Parameter(description = "통계를 조회할 스토리 ID", required = true) @PathVariable Long storyId) {
        StoryStatisticsResponse statistics = gameService.getStoryStatistics(storyId);
        return ResponseEntity.ok(statistics);
    }

    @Operation(summary = "[관리자] 오래된 게임 세션 정리", description = "지정된 기간 동안 활동이 없는 오래된 게임 세션을 정리합니다. 시스템 유지보수용 API입니다. 관리자 권한이 필요합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "세션 정리 완료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    })
    @DeleteMapping("/admin/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> cleanupOldGameSessions(
            @Parameter(description = "정리할 세션의 기준 일수 (기본값: 7일)", required = false) @RequestParam(defaultValue = "7") int daysOld) {
        int cleanedCount = gameService.cleanupOldGameSessions(daysOld);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message(String.format("%d개의 오래된 게임 세션이 정리되었습니다.", cleanedCount))
                .data(cleanedCount)
                .build());
    }
}