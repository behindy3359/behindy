package com.example.backend.service;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.game.GameEligibilityResponse;
import com.example.backend.dto.game.GameEnterResponse;
import com.example.backend.dto.game.GameStartResponse;
import com.example.backend.dto.game.PageResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameFlowService {

    private final GameSessionService gameSessionService;
    private final StoryService storyService;
    private final CharacterRepository characterRepository;
    private final NowRepository nowRepository;
    private final StoryRepository storyRepository;
    private final AuthService authService;
    private final EntityDtoMapper entityDtoMapper;

    /**
     * 역 기반 게임 진입
     */
    @Transactional
    public GameEnterResponse enterGameByStation(String stationName, Integer lineNumber) {
        log.info("[Flow] 역 기반 게임 진입: station={}, line={}", stationName, lineNumber);

        User currentUser = authService.getCurrentUser();
        Character character = getAliveCharacter(currentUser);

        Optional<Now> existingGame = nowRepository.findByCharacter(character);

        if (existingGame.isPresent()) {
            log.info("[Flow] 기존 게임 발견: pageId={}", existingGame.get().getPage().getPageId());
            return handleExistingGame(existingGame.get(), character, stationName, lineNumber);
        }

        log.info("[Flow] 진행 중인 게임 없음, 새 게임 준비");

        List<StoryResponse> uncompletedStories = storyService.getUncompletedStoriesByStation(
                stationName, lineNumber, character.getCharId());

        log.info("[Flow] 미완료 스토리 수: {}", uncompletedStories.size());

        if (uncompletedStories.isEmpty()) {
            log.warn("[Flow] 플레이 가능한 스토리가 없음: station={}, line={}", stationName, lineNumber);
            return GameEnterResponse.builder()
                    .success(false)
                    .action("NO_STORIES")
                    .message(String.format("%s역 %d호선에 플레이 가능한 스토리가 없습니다.", stationName, lineNumber))
                    .character(entityDtoMapper.toCharacterResponse(character))
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .build();
        }

        StoryResponse selectedStory = selectAppropriateStory(uncompletedStories, character);
        log.info("[Flow] 선택된 스토리: storyId={}, title={}", selectedStory.getStoryId(), selectedStory.getStoryTitle());

        GameStartResponse startResponse = gameSessionService.startNewGame(character, selectedStory.getStoryId());

        log.info("[Flow] 역 기반 게임 진입 완료: action=START_NEW, storyId={}", selectedStory.getStoryId());

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
        log.info("[Flow] 기존 게임 처리 시작");

        Page currentPage = existingGame.getPage();
        Story currentStory = storyRepository.findById(currentPage.getStoId())
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", currentPage.getStoId()));

        Station currentStation = currentStory.getStation();

        if (currentStation.getStaName().equals(requestedStation) &&
                currentStation.getStaLine().equals(requestedLine)) {

            log.info("[Flow] 같은 역, 기존 게임 재개");

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

        log.info("[Flow] 다른 역, 기존 게임 정보 안내");

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

    /**
     * 스토리 선택
     */
    private StoryResponse selectAppropriateStory(List<StoryResponse> uncompletedStories, Character character) {
        return uncompletedStories.get(0);
    }

    /**
     * 게임 자격 확인
     */
    @Transactional(readOnly = true)
    public GameEligibilityResponse checkGameEligibility() {
        log.info("[Flow] 게임 자격 확인 시작");

        try {
            User currentUser = authService.getCurrentUser();

            Optional<Character> characterOpt = characterRepository.findByUserAndDeletedAtIsNull(currentUser);
            if (characterOpt.isEmpty()) {
                log.info("[Flow] 살아있는 캐릭터가 없음");
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("살아있는 캐릭터가 없습니다.")
                        .requiresCharacterCreation(true)
                        .build();
            }

            Character character = characterOpt.get();
            CharacterResponse characterResponse = entityDtoMapper.toCharacterResponse(character);

            if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
                log.info("[Flow] 캐릭터 상태 불량: health={}, sanity={}",
                        character.getCharHealth(), character.getCharSanity());
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("캐릭터가 게임을 진행할 수 없는 상태입니다.")
                        .character(characterResponse)
                        .build();
            }

            Optional<Now> existingGame = nowRepository.findByCharacterId(character.getCharId());
            if (existingGame.isPresent()) {
                log.info("[Flow] 진행 중인 게임 존재");
                return GameEligibilityResponse.builder()
                        .canStartGame(false)
                        .reason("이미 진행 중인 게임이 있습니다.")
                        .hasActiveGame(true)
                        .character(characterResponse)
                        .build();
            }

            log.info("[Flow] 게임 진입 가능");
            return GameEligibilityResponse.builder()
                    .canStartGame(true)
                    .reason("게임을 시작할 수 있습니다.")
                    .character(characterResponse)
                    .build();

        } catch (Exception e) {
            log.warn("[Flow] 게임 자격 확인 실패: {}", e.getMessage());
            return GameEligibilityResponse.builder()
                    .canStartGame(false)
                    .reason("사용자 인증이 필요합니다.")
                    .requiresLogin(true)
                    .build();
        }
    }

    /**
     * 살아있는 캐릭터 조회
     */
    private Character getAliveCharacter(User user) {
        log.info("[Flow] 살아있는 캐릭터 조회: userId={}", user.getUserId());

        return characterRepository.findByUserAndDeletedAtIsNull(user)
                .orElseThrow(() -> {
                    log.warn("[Flow] 살아있는 캐릭터를 찾을 수 없음: userId={}", user.getUserId());
                    return new ResourceNotFoundException("Living Character", "userId", user.getUserId());
                });
    }
}