package com.example.backend.service;

import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterGameStatusResponse;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.entity.Character;
import com.example.backend.entity.User;
import com.example.backend.entity.Now;
import com.example.backend.entity.Page;
import com.example.backend.entity.Story;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.repository.LogERepository;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final AuthService authService;
    private final HtmlSanitizer htmlSanitizer;
    private final EntityDtoMapper entityDtoMapper;
    private final NowRepository nowRepository;
    private final StoryRepository storyRepository;
    private final LogERepository logERepository;

    /**
     * 캐릭터 생성
     */
    @Transactional
    public CharacterResponse createCharacter(CharacterCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        // 1. 기존 살아있는 캐릭터 확인
        if (characterRepository.existsByUserAndDeletedAtIsNull(currentUser)) {
            throw new IllegalStateException("이미 살아있는 캐릭터가 있습니다. 기존 캐릭터가 사망해야 새 캐릭터를 생성할 수 있습니다.");
        }

        // 2. 캐릭터 이름 중복 확인
        String sanitizedName = htmlSanitizer.sanitize(request.getCharName());
        if (characterRepository.existsByCharNameAndDeletedAtIsNull(sanitizedName)) {
            throw new IllegalArgumentException("이미 사용 중인 캐릭터 이름입니다.");
        }

        // 3. 캐릭터 생성
        Character character = Character.builder()
                .user(currentUser)
                .charName(sanitizedName)
                .charHealth(100)
                .charSanity(100)
                .build();

        Character savedCharacter = characterRepository.save(character);
        log.info("새 캐릭터 생성됨: userId={}, charId={}, charName={}",
                currentUser.getUserId(), savedCharacter.getCharId(), sanitizedName);

        return entityDtoMapper.toCharacterResponse(savedCharacter);
    }

    /**
     * 현재 사용자의 살아있는 캐릭터 조회
     */
    @Transactional(readOnly = true)
    public CharacterResponse getCurrentCharacter() {
        User currentUser = authService.getCurrentUser();

        Character character = characterRepository.findByUserAndDeletedAtIsNull(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "user", currentUser.getUserId()));

        return entityDtoMapper.toCharacterResponse(character);
    }

    /**
     * 현재 사용자의 살아있는 캐릭터 조회 (Optional)
     */
    @Transactional(readOnly = true)
    public Optional<CharacterResponse> getCurrentCharacterOptional() {
        User currentUser = authService.getCurrentUser();

        return characterRepository.findByUserAndDeletedAtIsNull(currentUser)
                .map(entityDtoMapper::toCharacterResponse);
    }

    /**
     * 캐릭터 게임 상태 조회 (게임 컨텍스트 포함)
     */
    @Transactional(readOnly = true)
    public CharacterGameStatusResponse getCharacterGameStatus() {
        User currentUser = authService.getCurrentUser();
        Character character = characterRepository.findByUserAndDeletedAtIsNull(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "user", currentUser.getUserId()));

        // 기본 캐릭터 정보
        boolean isAlive = !character.isDeleted();
        boolean isDying = isAlive && (character.getCharHealth() <= 20 || character.getCharSanity() <= 20);
        String statusMessage = getCharacterStatusMessage(character);

        // 게임 진행 상태 확인
        Optional<Now> activeGame = nowRepository.findByCharacterIdWithPage(character.getCharId());
        boolean hasActiveGame = activeGame.isPresent();

        Long currentStoryId = null;
        String currentStoryTitle = null;
        Long currentPageNumber = null;
        LocalDateTime gameStartTime = null;

        if (hasActiveGame) {
            Now gameSession = activeGame.get();
            Page currentPage = gameSession.getPage();
            currentPageNumber = currentPage.getPageNumber();
            gameStartTime = gameSession.getCreatedAt();

            Story story = storyRepository.findById(currentPage.getStoId()).orElse(null);
            if (story != null) {
                currentStoryId = story.getStoId();
                currentStoryTitle = story.getStoTitle();
            }
        }

        // 캐릭터 통계 조회
        Long totalClears = logERepository.countCompletionsByCharacter(character.getCharId());
        Long totalPlays = logERepository.countTotalPlaysByCharacter(character.getCharId());
        Double clearRate = totalPlays > 0 ? (double) totalClears / totalPlays * 100 : 0.0;

        // 새 게임 진입 가능 여부
        boolean canEnterNewGame = isAlive && !hasActiveGame && character.getCharHealth() > 0 && character.getCharSanity() > 0;
        String cannotEnterReason = null;

        if (!isAlive) {
            cannotEnterReason = "캐릭터가 사망한 상태입니다.";
        } else if (hasActiveGame) {
            cannotEnterReason = "이미 진행 중인 게임이 있습니다.";
        } else if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            cannotEnterReason = "캐릭터 상태가 게임을 진행하기에 적합하지 않습니다.";
        }

        return CharacterGameStatusResponse.builder()
                .charId(character.getCharId())
                .charName(character.getCharName())
                .charHealth(character.getCharHealth())
                .charSanity(character.getCharSanity())
                .isAlive(isAlive)
                .isDying(isDying)
                .statusMessage(statusMessage)
                .hasActiveGame(hasActiveGame)
                .currentStoryId(currentStoryId)
                .currentStoryTitle(currentStoryTitle)
                .currentPageNumber(currentPageNumber)
                .gameStartTime(gameStartTime)
                .totalClears(totalClears)
                .totalPlays(totalPlays)
                .clearRate(clearRate)
                .canEnterNewGame(canEnterNewGame)
                .cannotEnterReason(cannotEnterReason)
                .build();
    }

    /**
     * 사용자의 모든 캐릭터 조회 (사망한 것 포함)
     */
    @Transactional(readOnly = true)
    public List<CharacterResponse> getCharacterHistory() {
        User currentUser = authService.getCurrentUser();

        List<Character> characters = characterRepository.findByUserOrderByCreatedAtDesc(currentUser);

        return characters.stream()
                .map(entityDtoMapper::toCharacterResponse)
                .collect(Collectors.toList());
    }

    /**
     * 캐릭터 사망 처리 (수동)
     */
    @Transactional
    public void killCharacter(Long charId) {
        User currentUser = authService.getCurrentUser();

        Character character = characterRepository.findAliveCharacterById(charId)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "id", charId));

        if (!character.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("캐릭터를 삭제할 권한이 없습니다.");
        }

        // 캐릭터 사망 처리
        character.delete();
        characterRepository.save(character);

        // 게임 진행 데이터 정리
        cleanupGameProgress(character);

        log.info("캐릭터 사망 처리됨: charId={}, charName={}, userId={}",
                charId, character.getCharName(), currentUser.getUserId());
    }

    /**
     * 캐릭터 스탯 업데이트 및 자동 사망 체크
     */
    @Transactional
    public CharacterResponse updateCharacterStats(Long charId, Integer healthChange, Integer sanityChange) {
        Character character = characterRepository.findAliveCharacterById(charId)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "id", charId));

        // 스탯 업데이트
        if (healthChange != null) {
            int newHealth = Math.max(0, character.getCharHealth() + healthChange);
            character.setCharHealth(newHealth);
        }

        if (sanityChange != null) {
            int newSanity = Math.max(0, character.getCharSanity() + sanityChange);
            character.setCharSanity(newSanity);
        }

        // 자동 사망 체크
        checkAndProcessDeath(character);

        Character savedCharacter = characterRepository.save(character);

        return entityDtoMapper.toCharacterResponse(savedCharacter);
    }

    /**
     * 자동 사망 체크 및 처리
     */
    @Transactional
    public void checkAndProcessDeath(Character character) {
        if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            character.delete();
            characterRepository.save(character);
            cleanupGameProgress(character);

            log.info("캐릭터 자동 사망: charId={}, health={}, sanity={}",
                    character.getCharId(), character.getCharHealth(), character.getCharSanity());
        }
    }

    /**
     * 캐릭터 상태 메시지 생성
     */
    private String getCharacterStatusMessage(Character character) {
        if (character.isDeleted()) {
            return "사망";
        }

        if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            return "위험 - 즉시 치료 필요";
        }

        if (character.getCharHealth() <= 20 || character.getCharSanity() <= 20) {
            return "주의 - 상태가 좋지 않음";
        }

        if (character.getCharHealth() >= 80 && character.getCharSanity() >= 80) {
            return "건강";
        }

        return "보통";
    }

    /**
     * 게임 진행 데이터 정리 (캐릭터 사망 시)
     */
    private void cleanupGameProgress(Character character) {
        // Now 테이블의 현재 위치 정보 정리
        nowRepository.deleteByCharacter(character);
        log.info("캐릭터 {}의 게임 진행 데이터 정리 완료", character.getCharId());
    }
}