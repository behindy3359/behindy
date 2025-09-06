package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.service.CharacterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    /**
     * 캐릭터 생성
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CharacterResponse> createCharacter(@Valid @RequestBody CharacterCreateRequest request) {
        log.info("🎮 캐릭터 생성 요청 수신: charName={}", request.getCharName());

        try {
            CharacterResponse response = characterService.createCharacter(request);
            log.info("✅ 캐릭터 생성 성공: charId={}, charName={}, userId={}",
                    response.getCharId(), response.getCharName(), response.getUserId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException e) {
            log.warn("⚠️ 캐릭터 생성 실패 - 기존 캐릭터 존재: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ 캐릭터 생성 실패 - 잘못된 입력: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ 캐릭터 생성 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 현재 살아있는 캐릭터 조회
     */
    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CharacterResponse> getCurrentCharacter() {
        log.info("🔍 현재 캐릭터 조회 요청");

        try {
            CharacterResponse response = characterService.getCurrentCharacter();
            log.info("✅ 현재 캐릭터 조회 성공: charId={}, charName={}, health={}, sanity={}",
                    response.getCharId(), response.getCharName(), response.getCharHealth(), response.getCharSanity());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 현재 캐릭터 조회 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 캐릭터 존재 여부 확인 (게임 진입 전 체크용)
     */
    @GetMapping("/exists")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> checkCharacterExists() {
        log.info("🔍 캐릭터 존재 여부 확인 요청");

        try {
            Optional<CharacterResponse> character = characterService.getCurrentCharacterOptional();
            boolean exists = character.isPresent();

            log.info("✅ 캐릭터 존재 여부 확인 완료: exists={}", exists);
            if (exists) {
                log.info("   캐릭터 정보: charId={}, charName={}, health={}, sanity={}",
                        character.get().getCharId(), character.get().getCharName(),
                        character.get().getCharHealth(), character.get().getCharSanity());
            }

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message(exists ? "살아있는 캐릭터가 있습니다." : "캐릭터가 없습니다.")
                    .data(character.orElse(null))
                    .build());

        } catch (Exception e) {
            log.error("❌ 캐릭터 존재 여부 확인 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 캐릭터 히스토리 조회
     */
    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CharacterResponse>> getCharacterHistory() {
        log.info("📜 캐릭터 히스토리 조회 요청");

        try {
            List<CharacterResponse> characters = characterService.getCharacterHistory();
            log.info("✅ 캐릭터 히스토리 조회 성공: 총 {}개 캐릭터", characters.size());

            characters.forEach(character ->
                    log.debug("   캐릭터: charId={}, charName={}, alive={}, createdAt={}",
                            character.getCharId(), character.getCharName(),
                            character.isAlive(), character.getCreatedAt())
            );

            return ResponseEntity.ok(characters);

        } catch (Exception e) {
            log.error("❌ 캐릭터 히스토리 조회 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 캐릭터 사망 처리
     */
    @DeleteMapping("/{charId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> killCharacter(@PathVariable Long charId) {
        log.info("💀 캐릭터 사망 처리 요청: charId={}", charId);

        try {
            characterService.killCharacter(charId);
            log.info("✅ 캐릭터 사망 처리 완료: charId={}", charId);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("캐릭터가 사망 처리되었습니다.")
                    .build());

        } catch (Exception e) {
            log.error("❌ 캐릭터 사망 처리 실패: charId={}, error={}", charId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 캐릭터 스탯 업데이트
     */
    @PatchMapping("/{charId}/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CharacterResponse> updateCharacterStats(
            @PathVariable Long charId,
            @RequestParam(required = false) Integer healthChange,
            @RequestParam(required = false) Integer sanityChange) {

        log.info("📊 캐릭터 스탯 업데이트 요청: charId={}, healthChange={}, sanityChange={}",
                charId, healthChange, sanityChange);

        try {
            CharacterResponse response = characterService.updateCharacterStats(charId, healthChange, sanityChange);
            log.info("✅ 캐릭터 스탯 업데이트 완료: charId={}, newHealth={}, newSanity={}, alive={}",
                    response.getCharId(), response.getCharHealth(), response.getCharSanity(), response.isAlive());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ 캐릭터 스탯 업데이트 실패: charId={}, error={}", charId, e.getMessage(), e);
            throw e;
        }
    }
}