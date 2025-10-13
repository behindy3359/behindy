package com.example.backend.repository;

import com.example.backend.entity.LogE;
import com.example.backend.entity.OpsLogB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OpsLogBRepository extends JpaRepository<OpsLogB, Long> {

    /**
     * 특정 게임 종료 로그의 모든 플레이 로그 조회 (시간순)
     */
    @Query("SELECT b FROM OpsLogB b WHERE b.loge.logeId = :logeId ORDER BY b.createdAt ASC")
    List<OpsLogB> findByLogeIdOrderByCreatedAtAsc(@Param("logeId") Long logeId);

    /**
     * 특정 페이지의 평균 체류 시간 계산
     */
    @Query("SELECT AVG(b.logbDur) FROM OpsLogB b WHERE b.logbPage = :pageId")
    Double getAverageDurationByPageId(@Param("pageId") Long pageId);

    /**
     * 특정 페이지의 총 방문 횟수
     */
    @Query("SELECT COUNT(b) FROM OpsLogB b WHERE b.logbPage = :pageId")
    Long countVisitsByPageId(@Param("pageId") Long pageId);

    /**
     * 특정 선택지가 선택된 횟수 (OpsLogB 기준)
     */
    @Query("SELECT COUNT(b) FROM OpsLogB b WHERE b.logbOpt = :optionId")
    Long countByOptionId(@Param("optionId") Long optionId);

    /**
     * 특정 기간의 플레이 로그 조회
     */
    @Query("SELECT b FROM OpsLogB b WHERE b.createdAt BETWEEN :startDate AND :endDate ORDER BY b.createdAt DESC")
    List<OpsLogB> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    /**
     * 페이지별 평균 체류 시간 통계 (전체)
     */
    @Query("SELECT b.logbPage, AVG(b.logbDur) as avgDuration, COUNT(b) as visitCount " +
            "FROM OpsLogB b GROUP BY b.logbPage ORDER BY avgDuration DESC")
    List<Object[]> getPageDurationStatistics();

    /**
     * 선택지별 선택 횟수 통계
     */
    @Query("SELECT b.logbOpt, COUNT(b) as selectionCount FROM OpsLogB b " +
            "GROUP BY b.logbOpt ORDER BY selectionCount DESC")
    List<Object[]> getOptionSelectionStatistics();

    /**
     * 특정 게임 세션의 총 플레이 시간 계산
     */
    @Query("SELECT SUM(b.logbDur) FROM OpsLogB b WHERE b.loge.logeId = :logeId")
    Long getTotalPlayTimeByLogeId(@Param("logeId") Long logeId);

    /**
     * 가장 오래 체류한 페이지 TOP N 조회
     */
    @Query("SELECT b.logbPage, AVG(b.logbDur) as avgDuration FROM OpsLogB b " +
            "GROUP BY b.logbPage ORDER BY avgDuration DESC")
    List<Object[]> findPagesWithLongestDuration();

    /**
     * 특정 페이지에서 가장 많이 선택된 옵션 조회
     */
    @Query("SELECT b.logbOpt, COUNT(b) as count FROM OpsLogB b " +
            "WHERE b.logbPage = :pageId GROUP BY b.logbOpt ORDER BY count DESC")
    List<Object[]> findMostSelectedOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 특정 LogE의 플레이 로그 개수 (페이지 진행 수)
     */
    @Query("SELECT COUNT(b) FROM OpsLogB b WHERE b.loge.logeId = :logeId")
    Long countByLogeId(@Param("logeId") Long logeId);

    /**
     * 빠르게 넘어간 페이지 찾기 (체류 시간이 threshold 이하)
     */
    @Query("SELECT b FROM OpsLogB b WHERE b.logbDur < :thresholdMs ORDER BY b.logbDur ASC")
    List<OpsLogB> findQuickSkippedPages(@Param("thresholdMs") Long thresholdMs);

    /**
     * 특정 LogE에 연결된 모든 OpsLogB 삭제 (게임 종료 로그 삭제 시 사용)
     */
    void deleteByLogeLogeId(Long logeId);

    /**
     * 특정 캐릭터의 미연결 플레이 로그 조회 (LogE가 null인 경우)
     */
    @Query("SELECT b FROM OpsLogB b WHERE b.character.charId = :charId AND b.loge IS NULL ORDER BY b.createdAt ASC")
    List<OpsLogB> findUnlinkedPlayLogsByCharacter(@Param("charId") Long charId);

    /**
     * 특정 캐릭터의 미연결 플레이 로그 개수
     */
    @Query("SELECT COUNT(b) FROM OpsLogB b WHERE b.character.charId = :charId AND b.loge IS NULL")
    Long countUnlinkedPlayLogsByCharacter(@Param("charId") Long charId);
}
