package com.example.backend.service;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.game.ChoiceResultResponse;
import com.example.backend.dto.game.PageResponse;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.OptionsRepository;
import com.example.backend.repository.PageRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameChoiceService {

    private final OptionsRepository optionsRepository;
    private final CharacterRepository characterRepository;
    private final NowRepository nowRepository;
    private final PageRepository pageRepository;
    private final GameSessionService gameSessionService;
    private final GameAnalyticsService analyticsService;
    private final CharacterService characterService;
    private final EntityDtoMapper entityDtoMapper;

    /**
     * 선택지 처리
     */
    @Transactional
    public ChoiceResultResponse makeChoice(Character character, Long optionId) {
        log.info("[Choice] 선택지 처리 시작: charId={}, optionId={}", character.getCharId(), optionId);

        Now gameSession = nowRepository.findByCharacterIdWithPage(character.getCharId())
                .orElseThrow(() -> {
                    log.warn("[Choice] 활성 게임을 찾을 수 없음: charId={}", character.getCharId());
                    return new ResourceNotFoundException("Active Game", "characterId", character.getCharId());
                });

        Page currentPage = gameSession.getPage();
        log.info("[Choice] 현재 페이지: pageId={}, pageNumber={}", currentPage.getPageId(), currentPage.getPageNumber());

        Options selectedOption = optionsRepository.findById(optionId)
                .orElseThrow(() -> {
                    log.warn("[Choice] 선택지를 찾을 수 없음: optionId={}", optionId);
                    return new ResourceNotFoundException("Option", "id", optionId);
                });

        validateOption(selectedOption, currentPage);

        ChoiceEffect effect = applyChoiceEffect(character, selectedOption);
        log.info("[Choice] 효과 적용 결과: {}", effect.getEffectDescription());

        characterRepository.save(character);

        if (!isCharacterAlive(character)) {
            log.warn("[Choice] 캐릭터 사망으로 게임 종료: health={}, sanity={}",
                    character.getCharHealth(), character.getCharSanity());
            return handleGameOver(character, gameSession, selectedOption, effect, "캐릭터 사망");
        }

        Optional<Page> nextPage = determineNextPage(currentPage, selectedOption);

        if (nextPage.isEmpty()) {
            log.info("[Choice] 스토리 완료");
            return handleStoryComplete(character, gameSession, selectedOption, effect);
        }

        gameSession.setPage(nextPage.get());
        nowRepository.save(gameSession);

        analyticsService.recordChoice(character, selectedOption);

        PageResponse nextPageResponse = entityDtoMapper.toPageResponse(nextPage.get());
        CharacterResponse updatedCharacter = entityDtoMapper.toCharacterResponse(character);

        log.info("[Choice] 선택지 처리 완료: optionId={}, nextPage={}, health={}, sanity={}",
                optionId, nextPage.get().getPageNumber(), character.getCharHealth(), character.getCharSanity());

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
     * 선택지 효과 적용
     */
    private ChoiceEffect applyChoiceEffect(Character character, Options option) {
        String effectType = option.getOptEffect();
        int amount = option.getOptAmount();

        log.info("[Choice] 선택지 효과 분석: type={}, amount={}", effectType, amount);

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
                log.info("[Choice] 체력 변경: {} → {}", oldHealth, newHealth);
                break;

            case "sanity":
                int newSanity = Math.max(0, Math.min(100, character.getCharSanity() + amount));
                character.setCharSanity(newSanity);
                description = amount > 0 ?
                        String.format("정신력이 %d 회복되었습니다. (%d → %d)", amount, oldSanity, newSanity) :
                        String.format("정신력이 %d 감소했습니다. (%d → %d)", Math.abs(amount), oldSanity, newSanity);
                log.info("[Choice] 정신력 변경: {} → {}", oldSanity, newSanity);
                break;

            default:
                description = "알 수 없는 효과";
                log.warn("[Choice] 알 수 없는 효과 타입: {}", effectType);
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
        log.info("[Choice] 게임 오버 처리: charId={}, reason={}", character.getCharId(), reason);

        gameSessionService.endSession(character);
        characterService.killCharacter(character.getCharId());
        analyticsService.recordGameEnd(character, gameSession.getPage(), "DEATH", reason);

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
        log.info("[Choice] 스토리 완료 처리: charId={}", character.getCharId());

        gameSessionService.endSession(character);
        analyticsService.recordGameEnd(character, gameSession.getPage(), "COMPLETE", "스토리 클리어");

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
     * 다음 페이지 결정
     */
    private Optional<Page> determineNextPage(Page currentPage, Options selectedOption) {
        long nextPageNumber = currentPage.getPageNumber() + 1;
        return pageRepository.findByStoIdAndPageNumber(currentPage.getStoId(), nextPageNumber);
    }

    /**
     * 캐릭터 생존 체크
     */
    private boolean isCharacterAlive(Character character) {
        return character.getCharHealth() > 0 && character.getCharSanity() > 0;
    }

    /**
     * 선택지 유효성 검증
     */
    private void validateOption(Options option, Page currentPage) {
        if (option.getPageId() != currentPage.getPageId()) {
            log.warn("[Choice] 잘못된 선택지: optionPageId={}, currentPageId={}",
                    option.getPageId(), currentPage.getPageId());
            throw new IllegalArgumentException("잘못된 선택지입니다.");
        }
    }

    @lombok.Data
    @lombok.Builder
    private static class ChoiceEffect {
        private String effectType;
        private Integer amount;
        private String effectDescription;
    }
}