// GameService.java
package com.example.backend.service;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.game.*;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final CharacterService characterService;
    private final AuthService authService;

    /**
     * 게임 시작
     */
    @Transactional
    public GameStartResponse startGame(Long storyId) {
        // 1. 현재 사용자의 살아있는 캐릭터 확인
        Users currentUsers = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUsers);

        // 2. 스토리 존재 확인
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", storyId));

        // 3. 이미 진행 중인 게임이 있는지 확인
        Optional<Now> existingGame = nowRepository.findByCharacter(character);
        if (existingGame.isPresent()) {
            throw new IllegalStateException("이미 진행 중인 게임이 있습니다. 기존 게임을 종료하거나 이어서 플레이하세요.");
        }

        // 4. 첫 번째 페이지 조회
        Page firstPage = pageRepository.findFirstPageByStoryId(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("First Page", "storyId", storyId));

        // 5. 게임 시작 위치 저장
        Now gameSession = Now.builder()
                .character(character)
                .page(firstPage)
                .build();
        nowRepository.save(gameSession);

        // 6. 응답 생성
        PageResponse pageResponse = createPageResponse(firstPage);
        CharacterResponse characterResponse = characterService.getCurrentCharacter();

        log.info("게임 시작: userId={}, charId={}, storyId={}",
                currentUsers.getUserId(), character.getCharId(), storyId);

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
        Users currentUsers = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUsers);

        // 진행 중인 게임 확인
        Now gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId())
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        Page currentPage = gameSession.getPage();
        Story story = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        PageResponse pageResponse = createPageResponse(currentPage);
        CharacterResponse characterResponse = characterService.getCurrentCharacter();

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
        Users currentUsers = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUsers);

        Optional<Now> gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId());

        if (gameSession.isEmpty()) {
            return GameStateResponse.builder()
                    .hasActiveGame(false)
                    .character(characterService.getCurrentCharacter())
                    .message("진행 중인 게임이 없습니다.")
                    .build();
        }

        Page currentPage = gameSession.get().getPage();
        Story story = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        PageResponse pageResponse = createPageResponse(currentPage);
        CharacterResponse characterResponse = characterService.getCurrentCharacter();

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
    /**
     * 선택지 선택 및 처리
     */
    @Transactional
    public ChoiceResultResponse makeChoice(Long optionId) {
        Users currentUsers = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUsers);

        // 1. 진행 중인 게임 확인
        Now gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId())
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        // 2. 선택지 확인
        Options selectedOption = optionsRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Option", "id", optionId));

        // 3. 선택지가 현재 페이지의 것인지 확인
        Page currentPage = gameSession.getPage();
        if (selectedOption.getPageId() != currentPage.getPageId()) {
            throw new IllegalArgumentException("잘못된 선택지입니다.");
        }

        // 4. 선택지 효과 적용 및 캐릭터 저장
        ChoiceEffect effect = applyChoiceEffect(character, selectedOption);
        characterRepository.save(character);

        // 5. 게임 종료 조건 확인
        if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            return handleGameOver(character, gameSession, selectedOption, effect, "캐릭터 사망");
        }

        // 6. 다음 페이지 결정
        Optional<Page> nextPage = determineNextPage(currentPage, selectedOption);

        if (nextPage.isEmpty()) {
            return handleStoryComplete(character, gameSession, selectedOption, effect);
        }

        // 7. 다음 페이지로 이동
        gameSession.setPage(nextPage.get());
        nowRepository.save(gameSession);

        // 8. 로그 기록
        recordChoice(character, selectedOption);

        // 9. 응답 생성
        PageResponse nextPageResponse = createPageResponse(nextPage.get());
        CharacterResponse updatedCharacter = characterService.getCurrentCharacter();

        log.info("선택지 처리: charId={}, optionId={}, effect={}, currentPage={}, nextPage={}",
                character.getCharId(), optionId, effect.getEffectDescription(),
                currentPage.getPageNumber(), nextPage.get().getPageNumber());

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
        Users currentUsers = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUsers);

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

    /**
     * 선택지 효과 적용
     */
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


    /**
     * 페이지 응답 생성 (타입 수정)
     */
    private PageResponse createPageResponse(Page page) {
        List<Options> options = optionsRepository.findByPageId(page.getPageId());

        List<OptionResponse> optionResponses = options.stream()
                .map(option -> OptionResponse.builder()
                        .optionId(option.getOptId())
                        .content(option.getOptContents())
                        .effect(option.getOptEffect())
                        .amount(option.getOptAmount())
                        .effectPreview(createEffectPreview(option))
                        .build())
                .collect(Collectors.toList());

        // 전체 페이지 수 조회
        Long totalPages = pageRepository.countPagesByStoryId(page.getStoId());

        // 마지막 페이지 여부 확인 (long 타입 사용)
        long nextPageNumber = page.getPageNumber() + 1;
        boolean isLastPage = !pageRepository.existsNextPage(page.getStoId(), nextPageNumber);

        return PageResponse.builder()
                .pageId(page.getPageId())
                .pageNumber(page.getPageNumber())
                .content(page.getPageContents())
                .options(optionResponses)
                .isLastPage(isLastPage)
                .totalPages(totalPages.intValue())
                .build();
    }

    /**
     * 선택지 효과 미리보기 생성 (Integer null 체크 수정)
     */
    private String createEffectPreview(Options option) {
        if (option.getOptEffect() == null || option.getOptAmount() == 0) {
            return null;
        }

        String effectType = option.getOptEffect().toLowerCase();
        int amount = option.getOptAmount(); // primitive int 사용

        switch (effectType) {
            case "health":
                return amount > 0 ?
                        String.format("체력 +%d", amount) :
                        String.format("체력 %d", amount);
            case "sanity":
                return amount > 0 ?
                        String.format("정신력 +%d", amount) :
                        String.format("정신력 %d", amount);
            default:
                return null;
        }
    }


    /**
     * 살아있는 캐릭터 조회
     */
    private Character getAliveCharacter(Users users) {
        return characterService.getCurrentCharacterOptional()
                .map(characterResponse -> {
                    // CharacterResponse에서 Character 엔티티로 변환 (실제로는 Repository에서 직접 조회)
                    return characterRepository.findByUserAndDeletedAtIsNull(users)
                            .orElseThrow(() -> new ResourceNotFoundException("Living Character", "userId", users.getUserId()));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Living Character", "userId", users.getUserId()));
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

            // LogO Repository가 있다면 저장
            // logORepository.save(choiceLog);

            log.debug("선택 로그 기록: charId={}, optionId={}",
                    character.getCharId(), selectedOption.getOptId());
        } catch (Exception e) {
            log.error("선택 로그 기록 실패", e);
            // 로그 기록 실패는 게임 진행에 영향을 주지 않음
        }
    }

    /**
     * 게임 종료 로그 기록
     */
    private void recordGameEnd(Character character, Page lastPage, String endType, String reason) {
        try {
            // Story 조회
            Story story = storyRepository.findById(lastPage.getStoId())
                    .orElse(null);

            if (story != null) {
                LogE endLog = LogE.builder()
                        .character(character)
                        .story(story)
                        .logeResult(reason)
                        .logeEnding(endType.equals("COMPLETE") ? 1 : 0) // 1: 성공, 0: 실패
                        .build();

                // LogE Repository가 있다면 저장
                // logERepository.save(endLog);

                log.info("게임 종료 로그 기록: charId={}, storyId={}, endType={}, reason={}",
                        character.getCharId(), story.getStoId(), endType, reason);
            }
        } catch (Exception e) {
            log.error("게임 종료 로그 기록 실패", e);
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
                            .userName(session.getCharacter().getUsers().getUserName())
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
            Users currentUsers = authService.getCurrentUser();

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