// GameService.java
package com.example.backend.service;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.game.*;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import com.example.backend.service.mapper.EntityDtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final StoryRepository storyRepository;
    private final PageRepository pageRepository;
    private final OptionsRepository optionsRepository;
    private final NowRepository nowRepository;
    private final CharacterRepository characterRepository;
    private final LogERepository logERepository;
    private final LogORepository logORepository;
    private final OpsLogBRepository opsLogBRepository;
    private final CharacterService characterService;
    private final AuthService authService;
    private final StoryService storyService;
    private final EntityDtoMapper entityDtoMapper;

    @Transactional
    public GameEnterResponse enterGameByStation(String stationName, Integer lineNumber) {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Optional<Now> existingGame = nowRepository.findByCharacter(character);

        if (existingGame.isPresent()) {
            return handleExistingGame(existingGame.get(), character, stationName, lineNumber);
        }

        List<StoryResponse> uncompletedStories = storyService.getUncompletedStoriesByStation(
                stationName, lineNumber, character.getCharId());

        if (uncompletedStories.isEmpty()) {
            return GameEnterResponse.builder()
                    .success(false)
                    .action("NO_STORIES")
                    .message(String.format("%s역 %d호선에 플레이 가능한 스토리가 없습니다.", stationName, lineNumber))
                    .character(entityDtoMapper.toCharacterResponse(character))
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .build();
        }

        StoryResponse selectedStory = uncompletedStories.get(0);
        GameStartResponse startResponse = startGame(selectedStory.getStoryId());

        return GameEnterResponse.builder()
                .success(true)
                .action("START_NEW")
                .message(String.format("새로운 스토리를 시작합니다: %s", selectedStory.getStoryTitle()))
                .selectedStoryId(selectedStory.getStoryId())
                .selectedStoryTitle(selectedStory.getStoryTitle())
                .firstPage(startResponse.getCurrentPage())
                .character(startResponse.getCharacter())
                .stationName(stationName)
                .stationLine(lineNumber)
                .availableStories(uncompletedStories.size() > 1 ? uncompletedStories : null)
                .build();
    }

    /**
     * 기존 진행 중인 게임 처리
     */
    private GameEnterResponse handleExistingGame(Now existingGame, Character character,
                                                 String requestedStation, Integer requestedLine) {
        Page currentPage = existingGame.getPage();
        Story currentStory = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        Station currentStation = currentStory.getStation();

        // 같은 역인 경우 기존 게임 재개
        if (currentStation.getStaName().equals(requestedStation) &&
                currentStation.getStaLine().equals(requestedLine)) {

            PageResponse pageResponse = entityDtoMapper.toPageResponse(currentPage);
            CharacterResponse characterResponse = entityDtoMapper.toCharacterResponse(character);

            return GameEnterResponse.builder()
                    .success(true)
                    .action("RESUME_EXISTING")
                    .message(String.format("진행 중인 게임을 재개합니다: %s", currentStory.getStoTitle()))
                    .resumeStoryId(currentStory.getStoId())
                    .resumeStoryTitle(currentStory.getStoTitle())
                    .currentPage(pageResponse)
                    .character(characterResponse)
                    .stationName(requestedStation)
                    .stationLine(requestedLine)
                    .build();
        }

        // 다른 역인 경우 기존 게임 정보와 함께 안내
        return GameEnterResponse.builder()
                .success(false)
                .action("RESUME_EXISTING")
                .message(String.format("다른 역에서 진행 중인 게임이 있습니다: %s역 %d호선 - %s",
                        currentStation.getStaName(), currentStation.getStaLine(), currentStory.getStoTitle()))
                .resumeStoryId(currentStory.getStoId())
                .resumeStoryTitle(currentStory.getStoTitle())
                .currentPage(entityDtoMapper.toPageResponse(currentPage))
                .character(entityDtoMapper.toCharacterResponse(character))
                .stationName(requestedStation)
                .stationLine(requestedLine)
                .build();
    }

    @Transactional
    public GameStartResponse startGame(Long storyId) {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", storyId));

        Optional<Now> existingGame = nowRepository.findByCharacter(character);
        if (existingGame.isPresent()) {
            throw new IllegalStateException("이미 진행 중인 게임이 있습니다.");
        }

        Page firstPage = pageRepository.findFirstPageByStoryId(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("First Page", "storyId", storyId));

        Now gameSession = Now.builder()
                .character(character)
                .page(firstPage)
                .pageEnteredAt(LocalDateTime.now())
                .build();
        nowRepository.save(gameSession);

        PageResponse pageResponse = entityDtoMapper.toPageResponse(firstPage);
        CharacterResponse characterResponse = entityDtoMapper.toCharacterResponse(character);

        return GameStartResponse.builder()
                .storyId(storyId)
                .storyTitle(story.getStoTitle())
                .currentPage(pageResponse)
                .character(characterResponse)
                .message("게임이 시작되었습니다.")
                .build();
    }

    /**
     * 게임 재개
     */
    @Transactional(readOnly = true)
    public GameResumeResponse resumeGame() {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Now gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId())
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        Page currentPage = gameSession.getPage();
        Story story = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        PageResponse pageResponse = entityDtoMapper.toPageResponse(currentPage);
        CharacterResponse characterResponse = entityDtoMapper.toCharacterResponse(character);

        return GameResumeResponse.builder()
                .storyId(story.getStoId())
                .storyTitle(story.getStoTitle())
                .currentPage(pageResponse)
                .character(characterResponse)
                .gameStartTime(gameSession.getCreatedAt())
                .message("게임을 이어서 진행합니다.")
                .build();
    }

    /**
     * 현재 게임 상태 조회
     */
    @Transactional(readOnly = true)
    public GameStateResponse getCurrentGameState() {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Optional<Now> gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId());

        if (gameSession.isEmpty()) {
            return GameStateResponse.builder()
                    .hasActiveGame(false)
                    .character(entityDtoMapper.toCharacterResponse(character))
                    .message("진행 중인 게임이 없습니다.")
                    .build();
        }

        Page currentPage = gameSession.get().getPage();
        Story story = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        PageResponse pageResponse = entityDtoMapper.toPageResponse(currentPage);
        CharacterResponse characterResponse = entityDtoMapper.toCharacterResponse(character);

        return GameStateResponse.builder()
                .hasActiveGame(true)
                .storyId(story.getStoId())
                .storyTitle(story.getStoTitle())
                .currentPage(pageResponse)
                .character(characterResponse)
                .gameStartTime(gameSession.get().getCreatedAt())
                .message("게임이 진행 중입니다.")
                .build();
    }

    @Transactional
    public ChoiceResultResponse makeChoice(Long optionId) {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Now gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId())
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        Page currentPage = gameSession.getPage();

        Options selectedOption = optionsRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Option", "id", optionId));

        if (selectedOption.getPageId() != currentPage.getPageId()) {
            throw new IllegalArgumentException("잘못된 선택지입니다.");
        }

        // 페이지 체류 시간 계산
        long durationMs = 0;
        if (gameSession.getPageEnteredAt() != null) {
            durationMs = java.time.Duration.between(
                    gameSession.getPageEnteredAt(),
                    LocalDateTime.now()
            ).toMillis();
        }

        ChoiceEffect effect = applyChoiceEffect(character, selectedOption);
        characterRepository.save(character);

        // 플레이 로그 기록 (체류 시간 포함)
        recordPlayLog(currentPage, selectedOption, durationMs);

        if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            return handleGameOver(character, gameSession, selectedOption, effect, "캐릭터 사망");
        }

        Optional<Page> nextPage = determineNextPage(currentPage, selectedOption);

        if (nextPage.isEmpty()) {
            return handleStoryComplete(character, gameSession, selectedOption, effect);
        }

        // 다음 페이지로 이동 및 진입 시간 업데이트
        gameSession.setPage(nextPage.get());
        gameSession.setPageEnteredAt(LocalDateTime.now());
        nowRepository.save(gameSession);

        recordChoice(character, selectedOption);

        PageResponse nextPageResponse = entityDtoMapper.toPageResponse(nextPage.get());
        CharacterResponse updatedCharacter = entityDtoMapper.toCharacterResponse(character);

        return ChoiceResultResponse.builder()
                .success(true)
                .result(effect.getEffectDescription())
                .updatedCharacter(updatedCharacter)
                .nextPage(nextPageResponse)
                .isGameOver(false)
                .message("선택이 적용되었습니다.")
                .build();
    }

    /**
     * 다음 페이지 결정 로직
     */
    private Optional<Page> determineNextPage(Page currentPage, Options selectedOption) {
        // 기본적으로 순차적 진행
        long nextPageNumber = currentPage.getPageNumber() + 1;
        return pageRepository.findByStoIdAndPageNumber(currentPage.getStoId(), nextPageNumber);
    }

    /**
     * 게임 포기
     */
    @Transactional
    public GameQuitResponse quitGame() {
        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Now gameSession = nowRepository.findByCharacter(character)
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        // 게임 세션 삭제
        nowRepository.deleteByCharacter(character);

        log.info("게임 포기: charId={}, pageId={}", character.getCharId(), gameSession.getPage().getPageId());

        return GameQuitResponse.builder()
                .success(true)
                .character(characterService.getCurrentCharacter())
                .message("게임을 포기했습니다.")
                .build();
    }

    private ChoiceEffect applyChoiceEffect(Character character, Options option) {
        String effectType = option.getOptEffect();
        int amount = option.getOptAmount();

        if (effectType == null || amount == 0) {
            return ChoiceEffect.builder()
                    .effectType("none")
                    .amount(0)
                    .effectDescription("변화 없음")
                    .build();
        }

        int oldHealth = character.getCharHealth();
        int oldSanity = character.getCharSanity();
        String description;

        switch (effectType.toLowerCase()) {
            case "health":
                int newHealth = Math.max(0, Math.min(100, character.getCharHealth() + amount));
                character.setCharHealth(newHealth);
                description = amount > 0 ?
                        String.format("체력이 %d 회복되었습니다. (%d → %d)", amount, oldHealth, newHealth) :
                        String.format("체력이 %d 감소했습니다. (%d → %d)", Math.abs(amount), oldHealth, newHealth);
                break;

            case "sanity":
                int newSanity = Math.max(0, Math.min(100, character.getCharSanity() + amount));
                character.setCharSanity(newSanity);
                description = amount > 0 ?
                        String.format("정신력이 %d 회복되었습니다. (%d → %d)", amount, oldSanity, newSanity) :
                        String.format("정신력이 %d 감소했습니다. (%d → %d)", Math.abs(amount), oldSanity, newSanity);
                break;

            default:
                description = "알 수 없는 효과";
        }

        return ChoiceEffect.builder()
                .effectType(effectType)
                .amount(amount)
                .effectDescription(description)
                .build();
    }

    /**
     * 게임 오버 처리
     */
    private ChoiceResultResponse handleGameOver(Character character, Now gameSession,
                                                Options selectedOption, ChoiceEffect effect, String reason) {
        // 게임 세션 삭제
        nowRepository.deleteByCharacter(character);

        // 캐릭터 사망 처리
        characterService.killCharacter(character.getCharId());

        // 종료 로그 기록
        recordGameEnd(character, gameSession.getPage(), "DEATH", reason);

        return ChoiceResultResponse.builder()
                .success(true)
                .result(effect.getEffectDescription())
                .updatedCharacter(null)
                .nextPage(null)
                .isGameOver(true)
                .gameOverReason(reason)
                .message("게임이 종료되었습니다. " + reason)
                .build();
    }

    /**
     * 스토리 완료 처리
     */
    private ChoiceResultResponse handleStoryComplete(Character character, Now gameSession,
                                                     Options selectedOption, ChoiceEffect effect) {
        // 게임 세션 삭제
        nowRepository.deleteByCharacter(character);

        // 완료 로그 기록
        recordGameEnd(character, gameSession.getPage(), "COMPLETE", "스토리 클리어");

        CharacterResponse updatedCharacter = characterService.getCurrentCharacter();

        return ChoiceResultResponse.builder()
                .success(true)
                .result(effect.getEffectDescription())
                .updatedCharacter(updatedCharacter)
                .nextPage(null)
                .isGameOver(true)
                .gameOverReason("스토리 완료")
                .message("축하합니다! 스토리를 완료했습니다.")
                .build();
    }


    private Character getAliveCharacter(User user) {
        return characterRepository.findByUserAndDeletedAtIsNull(user)
                .orElseThrow(() -> new ResourceNotFoundException("Living Character", "userId", user.getUserId()));
    }

    /**
     * 선택 로그 기록
     */
    private void recordChoice(Character character, Options selectedOption) {
        try {
            LogO choiceLog = LogO.builder()
                    .character(character)
                    .options(selectedOption)
                    .build();

            logORepository.save(choiceLog);
        } catch (Exception e) {
            log.error("선택 로그 기록 실패: charId={}, optionId={}",
                    character.getCharId(), selectedOption.getOptId(), e);
            // 로그 저장 실패가 게임 진행에 영향을 주지 않도록 예외를 삼킴
        }
    }

    /**
     * 플레이 분석 로그 기록 (페이지 체류 시간 포함)
     */
    private void recordPlayLog(Page currentPage, Options selectedOption, long durationMs) {
        try {
            // 현재는 캐릭터를 직접 가져올 수 없으므로 makeChoice에서 전달받도록 수정 필요
            // 임시로 현재 사용자의 캐릭터 조회
            User currentUser = authService.getCurrentUser();
            Character character = getAliveCharacter(currentUser);

            OpsLogB playLog = OpsLogB.builder()
                    .character(character)
                    .loge(null)  // 게임 종료 시 연결 예정
                    .logbPage(currentPage.getPageId())
                    .logbOpt(selectedOption.getOptId())
                    .logbDur(durationMs)
                    .build();

            opsLogBRepository.save(playLog);
        } catch (Exception e) {
            log.error("플레이 로그 기록 실패: pageId={}, optionId={}",
                    currentPage.getPageId(), selectedOption.getOptId(), e);
            // 로그 저장 실패가 게임 진행에 영향을 주지 않도록 예외를 삼킴
        }
    }

    /**
     * 게임 종료 로그 기록 및 플레이 로그 연결
     */
    private void recordGameEnd(Character character, Page lastPage, String endType, String reason) {
        try {
            Story story = storyRepository.findById(lastPage.getStoId())
                    .orElse(null);

            if (story != null) {
                // LogE 생성 및 저장
                LogE endLog = LogE.builder()
                        .character(character)
                        .story(story)
                        .logeResult(reason)
                        .logeEnding(endType.equals("COMPLETE") ? 1 : 0)
                        .build();

                logERepository.save(endLog);
                log.info("게임 종료 로그 저장 완료: charId={}, storyId={}, result={}",
                        character.getCharId(), story.getStoId(), endType);

                // 해당 캐릭터의 미연결 플레이 로그 찾아서 LogE와 연결
                List<OpsLogB> unlinkedPlayLogs = opsLogBRepository.findUnlinkedPlayLogsByCharacter(character.getCharId());
                if (!unlinkedPlayLogs.isEmpty()) {
                    for (OpsLogB playLog : unlinkedPlayLogs) {
                        playLog.setLoge(endLog);
                    }
                    opsLogBRepository.saveAll(unlinkedPlayLogs);
                    log.info("플레이 로그 연결 완료: charId={}, logeId={}, count={}",
                            character.getCharId(), endLog.getLogeId(), unlinkedPlayLogs.size());
                }
            }
        } catch (Exception e) {
            log.error("게임 종료 로그 기록 실패: charId={}", character.getCharId(), e);
            // 로그 저장 실패가 게임 종료에 영향을 주지 않도록 예외를 삼킴
        }
    }

    // === 관리자용 메서드들 ===

    /**
     * 진행 중인 모든 게임 세션 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public List<ActiveGameSessionResponse> getAllActiveGameSessions() {
        List<Now> activeSessions = nowRepository.findAllActiveGameSessions();

        return activeSessions.stream()
                .map(session -> {
                    Story story = storyRepository.findById(session.getPage().getStoId()).orElse(null);
                    return ActiveGameSessionResponse.builder()
                            .characterId(session.getCharacter().getCharId())
                            .characterName(session.getCharacter().getCharName())
                            .userName(session.getCharacter().getUser().getUserName())
                            .storyId(story != null ? story.getStoId() : null)
                            .storyTitle(story != null ? story.getStoTitle() : "Unknown")
                            .currentPageNumber(session.getPage().getPageNumber())
                            .gameStartTime(session.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 특정 스토리의 진행 통계 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public StoryStatisticsResponse getStoryStatistics(Long storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", storyId));

        // 현재 플레이 중인 캐릭터 수
        List<Now> currentPlayers = nowRepository.findCharactersInStory(storyId);

        // 총 페이지 수
        Long totalPages = pageRepository.countPagesByStoryId(storyId);

        return StoryStatisticsResponse.builder()
                .storyId(storyId)
                .storyTitle(story.getStoTitle())
                .storyLength(story.getStoLength())
                .totalPages(totalPages)
                .currentPlayers(currentPlayers.size())
                .stationName(story.getStation().getStaName())
                .stationLine(story.getStation().getStaLine())
                .build();
    }

    /**
     * 오래된 게임 세션 정리 (배치용)
     */
    @Transactional
    public int cleanupOldGameSessions(int daysOld) {
        java.time.LocalDateTime cutoffDate = java.time.LocalDateTime.now().minusDays(daysOld);
        List<Now> oldSessions = nowRepository.findOldGameSessions(cutoffDate);

        int cleanedCount = oldSessions.size();

        for (Now session : oldSessions) {
            nowRepository.delete(session);
            log.info("오래된 게임 세션 정리: charId={}, 생성일={}",
                    session.getCharacter().getCharId(), session.getCreatedAt());
        }

        return cleanedCount;
    }

    /**
     * 게임 진행 가능 여부 확인
     */
    @Transactional(readOnly = true)
    public GameEligibilityResponse checkGameEligibility() {
        try {
            User currentUser = authService.getCurrentUser();

            // 살아있는 캐릭터 확인
            Optional<CharacterResponse> characterOpt = characterService.getCurrentCharacterOptional();
            if (characterOpt.isEmpty()) {
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("살아있는 캐릭터가 없습니다.")
                        .requiresCharacterCreation(true)
                        .build();
            }

            CharacterResponse character = characterOpt.get();

            // 캐릭터 상태 확인
            if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("캐릭터가 게임을 진행할 수 없는 상태입니다.")
                        .character(character)
                        .build();
            }

            // 진행 중인 게임 확인
            Optional<Now> existingGame = nowRepository.findByCharacterId(character.getCharId());
            if (existingGame.isPresent()) {
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("이미 진행 중인 게임이 있습니다.")
                        .hasActiveGame(true)
                        .character(character)
                        .build();
            }

            return GameEligibilityResponse.builder()
                    .canStartGame(true)
                    .reason("게임을 시작할 수 있습니다.")
                    .character(character)
                    .build();

        } catch (Exception e) {
            return GameEligibilityResponse.builder()
                    .canStartGame(false)
                    .reason("사용자 인증이 필요합니다.")
                    .requiresLogin(true)
                    .build();
        }
    }

    // === 내부 헬퍼 클래스들 ===

    @lombok.Data
    @lombok.Builder
    private static class ChoiceEffect {
        private String effectType;
        private Integer amount;
        private String effectDescription;
    }
}