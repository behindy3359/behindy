package com.example.backend.repository;

import com.example.backend.entity.Character;
import com.example.backend.entity.LogO;
import com.example.backend.entity.Options;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogORepository extends JpaRepository<LogO, Long> {

    /**
     * 특정 캐릭터의 모든 선택 로그 조회 (최신순)
     */
    @Query("SELECT l FROM LogO l WHERE l.character.charId = :charId ORDER BY l.createdAt DESC")
    List<LogO> findByCharacterIdOrderByCreatedAtDesc(@Param("charId") Long charId);

    /**
     * 특정 선택지가 선택된 횟수 조회
     */
    @Query("SELECT COUNT(l) FROM LogO l WHERE l.options.optId = :optionId")
    Long countByOptionId(@Param("optionId") Long optionId);

    /**
     * 특정 선택지를 선택한 캐릭터 수 조회 (중복 제거)
     */
    @Query("SELECT COUNT(DISTINCT l.character.charId) FROM LogO l WHERE l.options.optId = :optionId")
    Long countDistinctCharactersByOptionId(@Param("optionId") Long optionId);

    /**
     * 특정 캐릭터가 특정 선택지를 선택한 횟수
     */
    @Query("SELECT COUNT(l) FROM LogO l WHERE l.character.charId = :charId AND l.options.optId = :optionId")
    Long countByCharacterAndOption(@Param("charId") Long charId, @Param("optionId") Long optionId);

    /**
     * 특정 페이지의 모든 선택지 선택 통계 (선택지별 선택 횟수)
     */
    @Query("SELECT l.options, COUNT(l) as selectionCount FROM LogO l " +
            "WHERE l.options.pageId = :pageId GROUP BY l.options ORDER BY selectionCount DESC")
    List<Object[]> findOptionStatisticsByPageId(@Param("pageId") Long pageId);

    /**
     * 특정 기간 동안의 선택 로그 조회
     */
    @Query("SELECT l FROM LogO l WHERE l.createdAt BETWEEN :startDate AND :endDate ORDER BY l.createdAt DESC")
    List<LogO> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);

    /**
     * 특정 캐릭터의 선택 수 조회
     */
    @Query("SELECT COUNT(l) FROM LogO l WHERE l.character.charId = :charId")
    Long countByCharacterId(@Param("charId") Long charId);

    /**
     * 가장 인기 있는 선택지 TOP N 조회
     */
    @Query("SELECT l.options, COUNT(l) as selectionCount FROM LogO l " +
            "GROUP BY l.options ORDER BY selectionCount DESC")
    List<Object[]> findMostPopularOptions();

    /**
     * 특정 스토리의 모든 선택 로그 조회 (페이지를 통한 간접 조회)
     */
    @Query("SELECT l FROM LogO l WHERE l.options.pageId IN " +
            "(SELECT p.pageId FROM Page p WHERE p.stoId = :storyId) " +
            "ORDER BY l.createdAt DESC")
    List<LogO> findByStoryId(@Param("storyId") Long storyId);

    /**
     * 특정 캐릭터의 최근 N개 선택 로그 조회
     */
    @Query("SELECT l FROM LogO l WHERE l.character.charId = :charId " +
            "ORDER BY l.createdAt DESC LIMIT :limit")
    List<LogO> findRecentChoicesByCharacter(@Param("charId") Long charId, @Param("limit") int limit);
}
