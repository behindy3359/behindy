package com.example.backend.service;

import com.example.backend.dto.game.*;
import com.example.backend.entity.Character;
import com.example.backend.entity.User;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final GameSessionService sessionService;
    private final GameFlowService flowService;
    private final GameChoiceService choiceService;
    private final GameAnalyticsService analyticsService;
    private final AuthService authService;
    private final CharacterRepository characterRepository;
    private final StoryRepository storyRepository;

    /**
     * 역 기반 게임 진입
     */
    @Transactional
    public GameEnterResponse enterGameByStation(String stationName, Integer lineNumber) {
        log.info("게임 진입 요청: station={}, line={}", stationName, lineNumber);
        return flowService.enterGameByStation(stationName, lineNumber);
    }

    /**
     * 게임 시작
     */
    @Transactional
    public GameStartResponse startGame(Long storyId) {
        log.info("게임 시작 요청: storyId={}", storyId);
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);
        return sessionService.startNewGame(character, storyId);
    }

    /**
     * 게임 재개
     */
    @Transactional(readOnly = true)
    public GameResumeResponse resumeGame() {
        log.info("게임 재개 요청");
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);
        return sessionService.resumeGame(character);
    }

    /**
     * 현재 게임 상태 조회
     */
    @Transactional(readOnly = true)
    public GameStateResponse getCurrentGameState() {
        log.info("현재 게임 상태 조회 요청");
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);
        return sessionService.getCurrentGameState(character);
    }

    /**
     * 선택지 선택
     */
    @Transactional
    public ChoiceResultResponse makeChoice(Long optionId) {
        log.info("선택지 처리 요청: optionId={}", optionId);
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);
        return choiceService.makeChoice(character, optionId);
    }

    /**
     * 게임 포기
     */
    @Transactional
    public GameQuitResponse quitGame() {
        log.info("게임 포기 요청");
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);
        return sessionService.quitGame(character);
    }

    /**
     * 게임 진입 자격 확인
     */
    @Transactional(readOnly = true)
    public GameEligibilityResponse checkGameEligibility() {
        log.info("게임 자격 확인 요청");
        return flowService.checkGameEligibility();
    }

    /**
     * 진행 중인 모든 게임 세션 조회
     */
    @Transactional(readOnly = true)
    public List<ActiveGameSessionResponse> getAllActiveGameSessions() {
        log.info("활성 게임 세션 조회 요청");
        return sessionService.getAllActiveSessions();
    }

    /**
     * 특정 스토리의 진행 통계 조회
     */
    @Transactional(readOnly = true)
    public StoryStatisticsResponse getStoryStatistics(Long storyId) {
        log.info("스토리 통계 조회 요청: storyId={}", storyId);

        var story = storyRepository.findById(storyId)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Story", "id", storyId));

        var statistics = analyticsService.getStoryStatistics(storyId);
        long activePlayers = sessionService.getAllActiveSessions().stream()
                .filter(session -> storyId.equals(session.getStoryId()))
                .count();

        return StoryStatisticsResponse.builder()
                .storyId(storyId)
                .storyTitle(story.getStoTitle())
                .storyLength(story.getStoLength())
                .totalPages(statistics.getTotalPlays())
                .currentPlayers((int) activePlayers)
                .stationName(story.getStation().getStaName())
                .stationLine(story.getStation().getStaLine())
                .totalPlays(statistics.getTotalPlays())
                .completions(statistics.getCompletions())
                .completionRate(statistics.getCompletionRate())
                .build();
    }

    /**
     * 오래된 게임 세션 정리
     */
    @Transactional
    public int cleanupOldGameSessions(int daysOld) {
        log.info("오래된 게임 세션 정리 요청: daysOld={}", daysOld);
        return sessionService.cleanupOldSessions(daysOld);
    }

    /**
     * 살아있는 캐릭터 조회
     */
    private Character getAliveCharacter(User user) {
        return characterRepository.findByUserAndDeletedAtIsNull(user)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException(
                        "Living Character", "userId", user.getUserId()));
    }
}