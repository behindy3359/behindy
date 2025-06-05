package com.example.backend.service;

import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.entity.Character;
import com.example.backend.entity.Now;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
//import com.example.backend.repository.NowRepository;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
//    private final NowRepository nowRepository; // 게임 진행 상태 확인용 (필요시 생성)
    private final AuthService authService;
    private final HtmlSanitizer htmlSanitizer;

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

        // 2. 캐릭터 이름 중복 확인 (전체 유저 대상)
        String sanitizedName = htmlSanitizer.sanitize(request.getCharName());
        if (characterRepository.existsByCharNameAndDeletedAtIsNull(sanitizedName)) {
            throw new IllegalArgumentException("이미 사용 중인 캐릭터 이름입니다.");
        }

        // 3. 캐릭터 생성
        Character character = Character.builder()
                .user(currentUser)
                .charName(sanitizedName)
                .charHealth(100) // 기본 체력
                .charSanity(100) // 기본 정신력
                .build();

        Character savedCharacter = characterRepository.save(character);
        log.info("새 캐릭터 생성됨: userId={}, charId={}, charName={}",
                currentUser.getUserId(), savedCharacter.getCharId(), sanitizedName);

        return mapToCharacterResponse(savedCharacter);
    }

    /**
     * 현재 사용자의 살아있는 캐릭터 조회
     */
    @Transactional(readOnly = true)
    public CharacterResponse getCurrentCharacter() {
        User currentUser = authService.getCurrentUser();

        Character character = characterRepository.findByUserAndDeletedAtIsNull(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "user", currentUser.getUserId()));

        return mapToCharacterResponse(character);
    }

    /**
     * 현재 사용자의 살아있는 캐릭터 조회 (Optional)
     */
    @Transactional(readOnly = true)
    public Optional<CharacterResponse> getCurrentCharacterOptional() {
        User currentUser = authService.getCurrentUser();

        return characterRepository.findByUserAndDeletedAtIsNull(currentUser)
                .map(this::mapToCharacterResponse);
    }

    /**
     * 사용자의 모든 캐릭터 조회 (사망한 것 포함)
     */
    @Transactional(readOnly = true)
    public List<CharacterResponse> getCharacterHistory() {
        User currentUser = authService.getCurrentUser();

        List<Character> characters = characterRepository.findByUserOrderByCreatedAtDesc(currentUser);

        return characters.stream()
                .map(this::mapToCharacterResponse)
                .collect(Collectors.toList());
    }

    /**
     * 캐릭터 사망 처리 (수동)
     */
    @Transactional
    public void killCharacter(Long charId) {
        User currentUser = authService.getCurrentUser();

        // 캐릭터 조회 및 소유권 확인
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
        return mapToCharacterResponse(savedCharacter);
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
     * 게임 진행 데이터 정리 (캐릭터 사망 시)
     */
    private void cleanupGameProgress(Character character) {
        // Now 테이블의 현재 위치 정보 정리
        // 실제 구현에서는 NowRepository를 사용하여 해당 캐릭터의 진행 상태를 정리
        log.info("캐릭터 {}의 게임 진행 데이터 정리 완료", character.getCharId());
    }

    /**
     * Character 엔티티를 CharacterResponse DTO로 변환
     */
    private CharacterResponse mapToCharacterResponse(Character character) {
        boolean isAlive = !character.isDeleted();
        boolean isDying = isAlive && (character.getCharHealth() <= 20 || character.getCharSanity() <= 20);
        String statusMessage = getStatusMessage(character);

        // 게임 진행 상태 확인 (실제 구현에서는 Now 테이블 조회)
        boolean hasGameProgress = false;
        Long currentStoryId = null;

        return CharacterResponse.builder()
                .charId(character.getCharId())
                .charName(character.getCharName())
                .charHealth(character.getCharHealth())
                .charSanity(character.getCharSanity())
                .userId(character.getUser().getUserId())
                .userName(character.getUser().getUserName())
                .isAlive(isAlive)
                .isDying(isDying)
                .statusMessage(statusMessage)
                .hasGameProgress(hasGameProgress)
                .currentStoryId(currentStoryId)
                .createdAt(character.getCreatedAt())
                .updatedAt(character.getUpdatedAt())
                .deletedAt(character.getDeletedAt())
                .build();
    }

    /**
     * 캐릭터 상태 메시지 생성
     */
    private String getStatusMessage(Character character) {
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
}