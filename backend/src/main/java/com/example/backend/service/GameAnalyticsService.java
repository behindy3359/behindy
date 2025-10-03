package com.example.backend.service;

import com.example.backend.entity.Character;
import com.example.backend.entity.LogE;
import com.example.backend.entity.Options;
import com.example.backend.entity.Page;
import com.example.backend.entity.Story;
import com.example.backend.repository.LogERepository;
import com.example.backend.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameAnalyticsService {

    private final LogERepository logERepository;
    private final StoryRepository storyRepository;

    /**
     * 선택 로그 기록
     */
    public void recordChoice(Character character, Options selectedOption) {
        try {
            // LogO Repository가 구현되면 활성화 예정
            // LogO choiceLog = LogO.builder()
            //         .character(character)
            //         .options(selectedOption)
            //         .build();
            // logORepository.save(choiceLog);

            log.debug("[Analytics] 선택 로그 기록: charId={}, optionId={}",
                    character.getCharId(), selectedOption.getOptId());
        } catch (Exception e) {
            log.error("[Analytics] 선택 로그 기록 실패", e);
        }
    }

    /**
     * 게임 종료 로그 기록
     */
    @Transactional
    public void recordGameEnd(Character character, Page lastPage, String endType, String reason) {
        try {
            Story story = storyRepository.findById(lastPage.getStoId())
                    .orElse(null);

            if (story != null) {
                LogE endLog = LogE.builder()
                        .character(character)
                        .story(story)
                        .logeResult(reason)
                        .logeEnding(endType.equals("COMPLETE") ? 1 : 0)
                        .build();

                logERepository.save(endLog);

                log.info("[Analytics] 게임 종료 로그 기록: charId={}, storyId={}, endType={}, reason={}",
                        character.getCharId(), story.getStoId(), endType, reason);
            }
        } catch (Exception e) {
            log.error("[Analytics] 게임 종료 로그 기록 실패", e);
        }
    }

    /**
     * 스토리 통계 조회
     */
    @Transactional(readOnly = true)
    public StoryStatistics getStoryStatistics(Long storyId) {
        Long totalPlays = logERepository.countTotalPlaysByStory(storyId);
        Long completions = logERepository.countCompletionsByStory(storyId);
        Double completionRate = totalPlays > 0 ? (double) completions / totalPlays * 100 : 0.0;

        return StoryStatistics.builder()
                .storyId(storyId)
                .totalPlays(totalPlays)
                .completions(completions)
                .completionRate(completionRate)
                .build();
    }

    /**
     * 캐릭터 플레이 통계 조회
     */
    @Transactional(readOnly = true)
    public CharacterPlayStatistics getCharacterStatistics(Long characterId) {
        Long totalPlays = logERepository.countTotalPlaysByCharacter(characterId);
        Long completions = logERepository.countCompletionsByCharacter(characterId);
        Double clearRate = totalPlays > 0 ? (double) completions / totalPlays * 100 : 0.0;

        return CharacterPlayStatistics.builder()
                .characterId(characterId)
                .totalPlays(totalPlays)
                .completions(completions)
                .clearRate(clearRate)
                .build();
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class StoryStatistics {
        private Long storyId;
        private Long totalPlays;
        private Long completions;
        private Double completionRate;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class CharacterPlayStatistics {
        private Long characterId;
        private Long totalPlays;
        private Long completions;
        private Double clearRate;
    }
}