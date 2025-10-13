package com.example.backend.repository;

import com.example.backend.entity.OpsLogD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpsLogDRepository extends JpaRepository<OpsLogD, Long> {

    /**
     * 특정 날짜의 통계 조회
     */
    @Query("SELECT l FROM OpsLogD l WHERE DATE(l.logdDate) = DATE(:date)")
    Optional<OpsLogD> findByDate(@Param("date") LocalDateTime date);

    /**
     * 기간별 통계 조회 (날짜순)
     */
    @Query("SELECT l FROM OpsLogD l WHERE l.logdDate BETWEEN :start AND :end " +
            "ORDER BY l.logdDate DESC")
    List<OpsLogD> findByDateRange(@Param("start") LocalDateTime start,
                                  @Param("end") LocalDateTime end);

    /**
     * 최근 N일 통계 조회
     */
    @Query("SELECT l FROM OpsLogD l ORDER BY l.logdDate DESC")
    List<OpsLogD> findRecentStats();

    /**
     * 특정 기간의 총 방문자 수
     */
    @Query("SELECT SUM(l.logdTotal) FROM OpsLogD l " +
            "WHERE l.logdDate BETWEEN :start AND :end")
    Long sumTotalVisitors(@Param("start") LocalDateTime start,
                         @Param("end") LocalDateTime end);

    /**
     * 특정 기간의 평균 고유 방문자 수
     */
    @Query("SELECT AVG(l.logdUnique) FROM OpsLogD l " +
            "WHERE l.logdDate BETWEEN :start AND :end")
    Double avgUniqueVisitors(@Param("start") LocalDateTime start,
                            @Param("end") LocalDateTime end);

    /**
     * 특정 기간의 총 로그인 사용자 수
     */
    @Query("SELECT SUM(l.logdLogin) FROM OpsLogD l " +
            "WHERE l.logdDate BETWEEN :start AND :end")
    Long sumLoginUsers(@Param("start") LocalDateTime start,
                      @Param("end") LocalDateTime end);

    /**
     * 특정 기간의 총 플레이 횟수
     */
    @Query("SELECT SUM(l.logdCounts) FROM OpsLogD l " +
            "WHERE l.logdDate BETWEEN :start AND :end")
    Long sumPlayCounts(@Param("start") LocalDateTime start,
                      @Param("end") LocalDateTime end);

    /**
     * 특정 기간의 클리어율 계산
     */
    @Query("SELECT (SUM(l.logdSuccess) * 100.0 / NULLIF(SUM(l.logdCounts), 0)) as clearRate " +
            "FROM OpsLogD l WHERE l.logdDate BETWEEN :start AND :end")
    Double calculateClearRate(@Param("start") LocalDateTime start,
                             @Param("end") LocalDateTime end);

    /**
     * 일별 성장률 분석 (전일 대비)
     */
    @Query("SELECT l.logdDate, l.logdTotal, l.logdUnique, l.logdLogin " +
            "FROM OpsLogD l ORDER BY l.logdDate DESC")
    List<Object[]> findGrowthTrend();

    /**
     * 최고 방문자 수 기록일 조회
     */
    @Query("SELECT l FROM OpsLogD l ORDER BY l.logdTotal DESC")
    List<OpsLogD> findPeakVisitorDays();

    /**
     * 주간 통계 집계
     */
    @Query("SELECT YEAR(l.logdDate), WEEK(l.logdDate), " +
            "SUM(l.logdTotal) as weeklyTotal, " +
            "AVG(l.logdUnique) as avgDailyUnique, " +
            "SUM(l.logdCounts) as weeklyPlays, " +
            "SUM(l.logdSuccess) as weeklySuccess " +
            "FROM OpsLogD l " +
            "WHERE l.logdDate >= :since " +
            "GROUP BY YEAR(l.logdDate), WEEK(l.logdDate) " +
            "ORDER BY YEAR(l.logdDate) DESC, WEEK(l.logdDate) DESC")
    List<Object[]> findWeeklyStats(@Param("since") LocalDateTime since);

    /**
     * 월간 통계 집계
     */
    @Query("SELECT YEAR(l.logdDate), MONTH(l.logdDate), " +
            "SUM(l.logdTotal) as monthlyTotal, " +
            "AVG(l.logdUnique) as avgDailyUnique, " +
            "SUM(l.logdCounts) as monthlyPlays, " +
            "SUM(l.logdSuccess) as monthlySuccess, " +
            "SUM(l.logdFail) as monthlyFail " +
            "FROM OpsLogD l " +
            "WHERE l.logdDate >= :since " +
            "GROUP BY YEAR(l.logdDate), MONTH(l.logdDate) " +
            "ORDER BY YEAR(l.logdDate) DESC, MONTH(l.logdDate) DESC")
    List<Object[]> findMonthlyStats(@Param("since") LocalDateTime since);
}
