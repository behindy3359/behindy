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
     * 특정 게임 세션의 플레이 로그 조회 (시간순)
     */
    @Query("SELECT l FROM OpsLogB l WHERE l.loge.logeId = :logeId ORDER BY l.createdAt ASC")
    List<OpsLogB> findByLogeIdOrderByCreatedAt(@Param("logeId") Long logeId);

    /**
     * 페이지별 평균 체류 시간
     */
    @Query("SELECT l.logbPage, AVG(l.logbDur) as avgDuration FROM OpsLogB l " +
            "GROUP BY l.logbPage ORDER BY avgDuration DESC")
    List<Object[]> findAverageDurationByPage();

    /**
     * 이탈률이 높은 페이지 (게임을 완료하지 못한 경우)
     */
    @Query("SELECT l.logbPage, COUNT(l) as dropoffCount FROM OpsLogB l " +
            "WHERE l.loge.logeEnding = 0 " +
            "GROUP BY l.logbPage ORDER BY dropoffCount DESC")
    List<Object[]> findDropoffPages();

    /**
     * 특정 페이지의 총 방문 횟수
     */
    @Query("SELECT COUNT(l) FROM OpsLogB l WHERE l.logbPage = :pageId")
    Long countVisitsByPage(@Param("pageId") Long pageId);

    /**
     * 특정 페이지에서 선택된 옵션 분포
     */
    @Query("SELECT l.logbOpt, COUNT(l) FROM OpsLogB l " +
            "WHERE l.logbPage = :pageId " +
            "GROUP BY l.logbOpt")
    List<Object[]> findOptionDistributionByPage(@Param("pageId") Long pageId);

    /**
     * 게임 플레이 경로 분석 (페이지 시퀀스)
     */
    @Query("SELECT l.logbPage, l.logbOpt, COUNT(l) FROM OpsLogB l " +
            "GROUP BY l.logbPage, l.logbOpt ORDER BY COUNT(l) DESC")
    List<Object[]> findPlayPathDistribution();

    /**
     * 특정 스토리의 평균 플레이 시간
     */
    @Query("SELECT AVG(l.logbDur) FROM OpsLogB l " +
            "WHERE l.loge.story.stoId = :storyId")
    Double findAveragePlayTimeByStory(@Param("storyId") Long storyId);

    /**
     * 클리어한 게임의 평균 페이지 수
     */
    @Query("SELECT AVG(pageCount) FROM " +
            "(SELECT COUNT(l) as pageCount FROM OpsLogB l " +
            "WHERE l.loge.logeEnding = 1 GROUP BY l.loge) as subquery")
    Double findAveragePageCountForCompletedGames();

    /**
     * 기간별 플레이 활동 통계
     */
    @Query("SELECT DATE(l.createdAt) as date, COUNT(l) as playCount, " +
            "AVG(l.logbDur) as avgDuration FROM OpsLogB l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(l.createdAt) ORDER BY date")
    List<Object[]> findPlayActivityStats(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);

    /**
     * 가장 오래 머무른 페이지 TOP N
     */
    @Query("SELECT l.logbPage, AVG(l.logbDur) as avgDuration FROM OpsLogB l " +
            "GROUP BY l.logbPage ORDER BY avgDuration DESC")
    List<Object[]> findLongestStayPages();

    /**
     * 특정 캐릭터의 플레이 패턴 분석
     */
    @Query("SELECT l FROM OpsLogB l " +
            "WHERE l.loge.character.charId = :charId " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogB> findPlayHistoryByCharacter(@Param("charId") Long charId);
}
