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
public class GameSessionService {

    private final NowRepository nowRepository;
    private final CharacterRepository characterRepository;
    private final StoryRepository storyRepository;
    private final PageRepository pageRepository;
    private final EntityDtoMapper entityDtoMapper;

    /**
     * 게임 세션 조회
     */
    @Transactional(readOnly = true)
    public Optional<Now> findActiveSession(Character character) {
        return nowRepository.findByCharacter(character);
    }

    /**
     * 게임 세션 조회 (비관적 락)
     */
    @Transactional
    public Optional<Now> findActiveSessionWithLock(Character character) {
        return nowRepository.findByCharacterForUpdate(character);
    }

    /**
     * 게임 시작
     */
    @Transactional
    public GameStartResponse startNewGame(Character character, Long storyId) {
        log.info("[Session] 게임 시작: charId={}, storyId={}", character.getCharId(), storyId);

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> {
                    log.warn("[Session] 스토리를 찾을 수 없음: storyId={}", storyId);
                    return new ResourceNotFoundException("Story", "id", storyId);
                });

        log.info("[Session] 기존 게임 세션 확인 중 (비관적 락 사용)...");
        Optional<Now> existingGame = nowRepository.findByCharacterForUpdate(character);
        if (existingGame.isPresent()) {
            log.warn("[Session] 이미 진행 중인 게임 존재: pageId={}", existingGame.get().getPage().getPageId());
            throw new IllegalStateException("이미 진행 중인 게임이 있습니다.");
        }

        log.info("[Session] 첫 번째 페이지 조회 중: storyId={}", storyId);
        Page firstPage = pageRepository.findFirstPageByStoryId(storyId)
                .orElseThrow(() -> {
                    log.warn("[Session] 첫 번째 페이지를 찾을 수 없음: storyId={}", storyId);
                    return new ResourceNotFoundException("First Page", "storyId", storyId);
                });

        log.info("[Session] 게임 세션 생성 중...");
        Now gameSession = Now.builder()
                .character(character)
                .page(firstPage)
                .build();
        Now savedSession = nowRepository.save(gameSession);
        log.info("[Session] 게임 세션 저장 완료: nowId={}, createdAt={}", savedSession.getNowId(), savedSession.getCreatedAt());

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
    public GameResumeResponse resumeGame(Character character) {
        log.info("[Session] 게임 재개: charId={}", character.getCharId());

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
    public GameStateResponse getCurrentGameState(Character character) {
        log.info("[Session] 현재 게임 상태 조회: charId={}", character.getCharId());

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

    /**
     * 게임 포기
     */
    @Transactional
    public GameQuitResponse quitGame(Character character) {
        log.info("[Session] 게임 포기: charId={}", character.getCharId());

        Now gameSession = nowRepository.findByCharacter(character)
                .orElseThrow(() -> new ResourceNotFoundException("Active Game", "characterId", character.getCharId()));

        nowRepository.deleteByCharacter(character);

        log.info("[Session] 게임 포기 완료: charId={}, pageId={}", character.getCharId(), gameSession.getPage().getPageId());

        return GameQuitResponse.builder()
                .success(true)
                .character(entityDtoMapper.toCharacterResponse(character))
                .message("게임을 포기했습니다.")
                .build();
    }

    /**
     * 세션 종료
     */
    @Transactional
    public void endSession(Character character) {
        log.info("[Session] 세션 종료: charId={}", character.getCharId());
        nowRepository.deleteByCharacter(character);
    }

    /**
     * 오래된 세션 정리
     */
    @Transactional
    public int cleanupOldSessions(int daysOld) {
        log.info("[Session] 오래된 세션 정리 시작: daysOld={}", daysOld);

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Now> oldSessions = nowRepository.findOldGameSessions(cutoffDate);

        int cleanedCount = oldSessions.size();

        for (Now session : oldSessions) {
            nowRepository.delete(session);
            log.info("[Session] 오래된 게임 세션 정리: charId={}, 생성일={}",
                    session.getCharacter().getCharId(), session.getCreatedAt());
        }

        log.info("[Session] 오래된 세션 정리 완료: {}개", cleanedCount);
        return cleanedCount;
    }

    /**
     * 활성 세션 목록
     */
    @Transactional(readOnly = true)
    public List<ActiveGameSessionResponse> getAllActiveSessions() {
        log.info("[Session] 모든 활성 세션 조회");

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
}