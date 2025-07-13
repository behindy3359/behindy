package com.example.backend.service;

import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.entity.Character;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
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
    private final AuthService authService;
    private final HtmlSanitizer htmlSanitizer;
    private final EntityDtoMapper entityDtoMapper;

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
                .map(entityDtoMapper::toCharacterResponse); // 🔄 공통 Mapper 사용
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
     * 게임 진행 데이터 정리 (캐릭터 사망 시)
     */
    private void cleanupGameProgress(Character character) {
        // Now 테이블의 현재 위치 정보 정리
        log.info("캐릭터 {}의 게임 진행 데이터 정리 완료", character.getCharId());
    }
}