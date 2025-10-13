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
     * 특정 옵션의 선택 횟수 조회
     */
    @Query("SELECT COUNT(l) FROM LogO l WHERE l.options.optId = :optionId")
    Long countByOptionId(@Param("optionId") Long optionId);

    /**
     * 캐릭터별 선택 이력 조회 (최신순)
     */
    @Query("SELECT l FROM LogO l WHERE l.character.charId = :charId ORDER BY l.createdAt DESC")
    List<LogO> findByCharacterIdOrderByCreatedAtDesc(@Param("charId") Long charId);

    /**
     * 기간별 옵션 선택 통계
     */
    @Query("SELECT l.options, COUNT(l) as selectionCount FROM LogO l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY l.options ORDER BY selectionCount DESC")
    List<Object[]> findOptionSelectionStats(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);

    /**
     * 특정 옵션을 선택한 캐릭터 수
     */
    @Query("SELECT COUNT(DISTINCT l.character) FROM LogO l WHERE l.options.optId = :optionId")
    Long countDistinctCharactersByOptionId(@Param("optionId") Long optionId);

    /**
     * 캐릭터가 특정 옵션을 선택했는지 확인
     */
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM LogO l " +
            "WHERE l.character.charId = :charId AND l.options.optId = :optionId")
    boolean hasCharacterSelectedOption(@Param("charId") Long charId,
                                      @Param("optionId") Long optionId);

    /**
     * 최근 N일간 가장 많이 선택된 옵션 조회
     */
    @Query("SELECT l.options, COUNT(l) as selectionCount FROM LogO l " +
            "WHERE l.createdAt >= :since " +
            "GROUP BY l.options ORDER BY selectionCount DESC")
    List<Object[]> findMostPopularOptions(@Param("since") LocalDateTime since);

    /**
     * 특정 페이지의 옵션별 선택 분포
     */
    @Query("SELECT l.options, COUNT(l) FROM LogO l " +
            "WHERE l.options.pageId = :pageId " +
            "GROUP BY l.options")
    List<Object[]> findOptionDistributionByPage(@Param("pageId") Long pageId);
}
