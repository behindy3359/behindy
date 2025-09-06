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

    @Transactional
    public CharacterResponse createCharacter(CharacterCreateRequest request) {
        log.info("🎮 캐릭터 생성 서비스 시작: charName={}", request.getCharName());

        User currentUser = authService.getCurrentUser();
        log.info("   현재 사용자: userId={}, userName={}", currentUser.getUserId(), currentUser.getUserName());

        // 1. 기존 살아있는 캐릭터 확인
        boolean hasExistingCharacter = characterRepository.existsByUserAndDeletedAtIsNull(currentUser);
        log.info("   기존 살아있는 캐릭터 존재 여부: {}", hasExistingCharacter);

        if (hasExistingCharacter) {
            log.warn("⚠️ 캐릭터 생성 실패 - 기존 살아있는 캐릭터 존재");
            throw new IllegalStateException("이미 살아있는 캐릭터가 있습니다. 기존 캐릭터가 사망해야 새 캐릭터를 생성할 수 있습니다.");
        }

        // 2. 캐릭터 이름 중복 확인
        String sanitizedName = htmlSanitizer.sanitize(request.getCharName());
        log.info("   캐릭터 이름 검증: 원본={}, 정제됨={}", request.getCharName(), sanitizedName);

        boolean nameExists = characterRepository.existsByCharNameAndDeletedAtIsNull(sanitizedName);
        log.info("   캐릭터 이름 중복 여부: {}", nameExists);

        if (nameExists) {
            log.warn("⚠️ 캐릭터 생성 실패 - 캐릭터 이름 중복: {}", sanitizedName);
            throw new IllegalArgumentException("이미 사용 중인 캐릭터 이름입니다.");
        }

        // 3. 캐릭터 생성
        log.info("   캐릭터 엔티티 생성 중...");
        Character character = Character.builder()
                .user(currentUser)
                .charName(sanitizedName)
                .charHealth(100)
                .charSanity(100)
                .build();

        log.info("   데이터베이스에 캐릭터 저장 중...");
        Character savedCharacter = characterRepository.save(character);
        log.info("✅ 캐릭터 데이터베이스 저장 완료: charId={}", savedCharacter.getCharId());

        CharacterResponse response = entityDtoMapper.toCharacterResponse(savedCharacter);
        log.info("✅ 캐릭터 생성 서비스 완료: charId={}, charName={}, health={}, sanity={}",
                response.getCharId(), response.getCharName(), response.getCharHealth(), response.getCharSanity());

        return response;
    }

    @Transactional(readOnly = true)
    public CharacterResponse getCurrentCharacter() {
        log.info("🔍 현재 캐릭터 조회 서비스 시작");

        User currentUser = authService.getCurrentUser();
        log.info("   현재 사용자: userId={}", currentUser.getUserId());

        log.info("   데이터베이스에서 살아있는 캐릭터 조회 중...");
        Optional<Character> characterOpt = characterRepository.findByUserAndDeletedAtIsNull(currentUser);

        if (characterOpt.isEmpty()) {
            log.warn("⚠️ 살아있는 캐릭터를 찾을 수 없음: userId={}", currentUser.getUserId());
            throw new ResourceNotFoundException("Character", "user", currentUser.getUserId());
        }

        Character character = characterOpt.get();
        log.info("✅ 캐릭터 조회 완료: charId={}, charName={}, health={}, sanity={}, alive={}",
                character.getCharId(), character.getCharName(), character.getCharHealth(),
                character.getCharSanity(), !character.isDeleted());

        return entityDtoMapper.toCharacterResponse(character);
    }

    @Transactional(readOnly = true)
    public Optional<CharacterResponse> getCurrentCharacterOptional() {
        log.info("🔍 현재 캐릭터 선택적 조회 서비스 시작");

        User currentUser = authService.getCurrentUser();
        log.info("   현재 사용자: userId={}", currentUser.getUserId());

        log.info("   데이터베이스에서 살아있는 캐릭터 조회 중...");
        Optional<Character> characterOpt = characterRepository.findByUserAndDeletedAtIsNull(currentUser);

        if (characterOpt.isEmpty()) {
            log.info("   살아있는 캐릭터가 없음");
            return Optional.empty();
        }

        Character character = characterOpt.get();
        log.info("✅ 캐릭터 조회 완료: charId={}, charName={}, health={}, sanity={}",
                character.getCharId(), character.getCharName(), character.getCharHealth(), character.getCharSanity());

        return Optional.of(entityDtoMapper.toCharacterResponse(character));
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

    @Transactional(readOnly = true)
    public List<CharacterResponse> getCharacterHistory() {
        log.info("📜 캐릭터 히스토리 조회 서비스 시작");

        User currentUser = authService.getCurrentUser();
        log.info("   현재 사용자: userId={}", currentUser.getUserId());

        log.info("   데이터베이스에서 사용자의 모든 캐릭터 조회 중...");
        List<Character> characters = characterRepository.findByUserOrderByCreatedAtDesc(currentUser);
        log.info("   조회된 캐릭터 수: {}", characters.size());

        List<CharacterResponse> responses = characters.stream()
                .map(character -> {
                    log.debug("     캐릭터: charId={}, charName={}, alive={}, createdAt={}",
                            character.getCharId(), character.getCharName(),
                            !character.isDeleted(), character.getCreatedAt());
                    return entityDtoMapper.toCharacterResponse(character);
                })
                .collect(Collectors.toList());

        log.info("✅ 캐릭터 히스토리 조회 완료: {}개 캐릭터", responses.size());
        return responses;
    }

    @Transactional
    public void killCharacter(Long charId) {
        log.info("💀 캐릭터 사망 처리 서비스 시작: charId={}", charId);

        User currentUser = authService.getCurrentUser();
        log.info("   현재 사용자: userId={}", currentUser.getUserId());

        log.info("   데이터베이스에서 살아있는 캐릭터 조회 중...");
        Character character = characterRepository.findAliveCharacterById(charId)
                .orElseThrow(() -> {
                    log.warn("⚠️ 살아있는 캐릭터를 찾을 수 없음: charId={}", charId);
                    return new ResourceNotFoundException("Character", "id", charId);
                });

        log.info("   캐릭터 권한 확인: charOwner={}, currentUser={}",
                character.getUser().getUserId(), currentUser.getUserId());

        if (!character.getUser().getUserId().equals(currentUser.getUserId())) {
            log.warn("⚠️ 캐릭터 삭제 권한 없음: charId={}, charOwner={}, currentUser={}",
                    charId, character.getUser().getUserId(), currentUser.getUserId());
            throw new AccessDeniedException("캐릭터를 삭제할 권한이 없습니다.");
        }

        log.info("   캐릭터 사망 처리 중: charName={}", character.getCharName());
        // 캐릭터 사망 처리
        character.delete();
        Character savedCharacter = characterRepository.save(character);
        log.info("   데이터베이스에 사망 처리 저장 완료: deletedAt={}", savedCharacter.getDeletedAt());

        // 게임 진행 데이터 정리
        log.info("   게임 진행 데이터 정리 시작...");
        cleanupGameProgress(character);

        log.info("✅ 캐릭터 사망 처리 완료: charId={}, charName={}", charId, character.getCharName());
    }

    @Transactional
    public CharacterResponse updateCharacterStats(Long charId, Integer healthChange, Integer sanityChange) {
        log.info("📊 캐릭터 스탯 업데이트 서비스 시작: charId={}, healthChange={}, sanityChange={}",
                charId, healthChange, sanityChange);

        log.info("   데이터베이스에서 살아있는 캐릭터 조회 중...");
        Character character = characterRepository.findAliveCharacterById(charId)
                .orElseThrow(() -> {
                    log.warn("⚠️ 살아있는 캐릭터를 찾을 수 없음: charId={}", charId);
                    return new ResourceNotFoundException("Character", "id", charId);
                });

        int oldHealth = character.getCharHealth();
        int oldSanity = character.getCharSanity();
        log.info("   현재 스탯: health={}, sanity={}", oldHealth, oldSanity);

        // 스탯 업데이트
        if (healthChange != null) {
            int newHealth = Math.max(0, character.getCharHealth() + healthChange);
            character.setCharHealth(newHealth);
            log.info("   체력 변경: {} + {} = {} (0~100 범위 적용)", oldHealth, healthChange, newHealth);
        }

        if (sanityChange != null) {
            int newSanity = Math.max(0, character.getCharSanity() + sanityChange);
            character.setCharSanity(newSanity);
            log.info("   정신력 변경: {} + {} = {} (0~100 범위 적용)", oldSanity, sanityChange, newSanity);
        }

        // 자동 사망 체크
        log.info("   자동 사망 체크 중: health={}, sanity={}", character.getCharHealth(), character.getCharSanity());
        checkAndProcessDeath(character);

        log.info("   데이터베이스에 스탯 변경 저장 중...");
        Character savedCharacter = characterRepository.save(character);

        CharacterResponse response = entityDtoMapper.toCharacterResponse(savedCharacter);
        log.info("✅ 캐릭터 스탯 업데이트 완료: charId={}, finalHealth={}, finalSanity={}, alive={}",
                response.getCharId(), response.getCharHealth(), response.getCharSanity(), response.isAlive());

        return response;
    }

    @Transactional
    public void checkAndProcessDeath(Character character) {
        boolean isDying = character.getCharHealth() <= 0 || character.getCharSanity() <= 0;
        log.info("   사망 조건 확인: health={}, sanity={}, isDying={}",
                character.getCharHealth(), character.getCharSanity(), isDying);

        if (isDying) {
            log.warn("💀 캐릭터 자동 사망 처리: charId={}, health={}, sanity={}",
                    character.getCharId(), character.getCharHealth(), character.getCharSanity());

            character.delete();
            characterRepository.save(character);
            cleanupGameProgress(character);

            log.info("✅ 자동 사망 처리 완료: charId={}", character.getCharId());
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

    private void cleanupGameProgress(Character character) {
        log.info("🧹 게임 진행 데이터 정리 시작: charId={}", character.getCharId());

        try {
            // Now 테이블의 현재 위치 정보 정리
            log.info("   Now 테이블에서 캐릭터 데이터 삭제 중...");
            nowRepository.deleteByCharacter(character);
            log.info("✅ 캐릭터 {}의 게임 진행 데이터 정리 완료", character.getCharId());

        } catch (Exception e) {
            log.error("❌ 게임 진행 데이터 정리 실패: charId={}, error={}", character.getCharId(), e.getMessage(), e);
            // 정리 실패는 치명적이지 않으므로 예외를 다시 던지지 않음
        }
    }
}