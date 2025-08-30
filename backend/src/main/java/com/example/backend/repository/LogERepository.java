package com.example.backend.repository;

import com.example.backend.entity.Character;
import com.example.backend.entity.LogE;
import com.example.backend.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LogERepository extends JpaRepository<LogE, Long> {

    /**
     * 특정 캐릭터가 클리어한 스토리 ID 목록 조회
     */
    @Query("SELECT l.story.stoId FROM LogE l WHERE l.character.charId = :charId AND l.logeEnding = 1")
    List<Long> findCompletedStoryIdsByCharacter(@Param("charId") Long charId);

    /**
     * 특정 캐릭터의 특정 스토리 클리어 여부 확인
     */
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM LogE l " +
            "WHERE l.character.charId = :charId AND l.story.stoId = :storyId AND l.logeEnding = 1")
    boolean hasCharacterCompletedStory(@Param("charId") Long charId, @Param("storyId") Long storyId);

    /**
     * 특정 캐릭터의 모든 게임 종료 기록 조회 (최신순)
     */
    @Query("SELECT l FROM LogE l WHERE l.character.charId = :charId ORDER BY l.createdAt DESC")
    List<LogE> findByCharacterIdOrderByCreatedAtDesc(@Param("charId") Long charId);

    /**
     * 특정 스토리의 클리어율 조회
     */
    @Query("SELECT COUNT(l) FROM LogE l WHERE l.story.stoId = :storyId AND l.logeEnding = 1")
    Long countCompletionsByStory(@Param("storyId") Long storyId);

    /**
     * 특정 스토리의 총 플레이 횟수 조회
     */
    @Query("SELECT COUNT(l) FROM LogE l WHERE l.story.stoId = :storyId")
    Long countTotalPlaysByStory(@Param("storyId") Long storyId);

    /**
     * 특정 캐릭터의 클리어 통계 조회
     */
    @Query("SELECT COUNT(l) FROM LogE l WHERE l.character.charId = :charId AND l.logeEnding = 1")
    Long countCompletionsByCharacter(@Param("charId") Long charId);

    /**
     * 특정 캐릭터의 총 플레이 횟수 조회
     */
    @Query("SELECT COUNT(l) FROM LogE l WHERE l.character.charId = :charId")
    Long countTotalPlaysByCharacter(@Param("charId") Long charId);

    /**
     * 특정 역의 클리어율 조회 (역에 속한 모든 스토리)
     */
    @Query("SELECT COUNT(l) FROM LogE l WHERE l.story.station.staName = :stationName " +
            "AND l.story.station.staLine = :lineNumber AND l.logeEnding = 1")
    Long countCompletionsByStation(@Param("stationName") String stationName, @Param("lineNumber") Integer lineNumber);

    /**
     * 최근 N일간의 클리어 기록 조회
     */
    @Query("SELECT l FROM LogE l WHERE l.createdAt >= :startDate AND l.logeEnding = 1 ORDER BY l.createdAt DESC")
    List<LogE> findRecentCompletions(@Param("startDate") LocalDateTime startDate);

    /**
     * 특정 캐릭터의 최근 게임 기록 조회
     */
    @Query("SELECT l FROM LogE l WHERE l.character.charId = :charId ORDER BY l.createdAt DESC")
    List<LogE> findRecentGamesByCharacter(@Param("charId") Long charId);

    /**
     * 인기 스토리 조회 (클리어 횟수 기준)
     */
    @Query("SELECT l.story, COUNT(l) as completionCount FROM LogE l " +
            "WHERE l.logeEnding = 1 GROUP BY l.story ORDER BY completionCount DESC")
    List<Object[]> findPopularStoriesByCompletions();
}