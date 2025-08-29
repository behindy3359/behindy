package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.service.CharacterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
        CharacterResponse response = characterService.createCharacter(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 현재 살아있는 캐릭터 조회
     */
    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CharacterResponse> getCurrentCharacter() {
        CharacterResponse response = characterService.getCurrentCharacter();
        return ResponseEntity.ok(response);
    }

    /**
     * 캐릭터 존재 여부 확인 (게임 진입 전 체크용)
     */
    @GetMapping("/exists")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> checkCharacterExists() {
        Optional<CharacterResponse> character = characterService.getCurrentCharacterOptional();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message(character.isPresent() ? "살아있는 캐릭터가 있습니다." : "캐릭터가 없습니다.")
                .data(character.orElse(null))
                .build());
    }

    /**
     * 캐릭터 히스토리 조회
     */
    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CharacterResponse>> getCharacterHistory() {
        List<CharacterResponse> characters = characterService.getCharacterHistory();
        return ResponseEntity.ok(characters);
    }

    /**
     * 캐릭터 사망 처리
     */
    @DeleteMapping("/{charId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> killCharacter(@PathVariable Long charId) {
        characterService.killCharacter(charId);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("캐릭터가 사망 처리되었습니다.")
                .build());
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

        CharacterResponse response = characterService.updateCharacterStats(charId, healthChange, sanityChange);
        return ResponseEntity.ok(response);
    }
}