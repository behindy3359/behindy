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
    @Query("SELECT d FROM OpsLogD d WHERE DATE(d.logdDate) = DATE(:date)")
    Optional<OpsLogD> findByDate(@Param("date") LocalDateTime date);

    /**
     * 특정 기간의 통계 조회 (날짜순)
     */
    @Query("SELECT d FROM OpsLogD d WHERE d.logdDate BETWEEN :startDate AND :endDate ORDER BY d.logdDate ASC")
    List<OpsLogD> findByDateBetween(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    /**
     * 최근 N일 통계 조회
     */
    @Query("SELECT d FROM OpsLogD d ORDER BY d.logdDate DESC LIMIT :days")
    List<OpsLogD> findRecentDays(@Param("days") int days);

    /**
     * 특정 날짜의 통계 존재 여부 확인
     */
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM OpsLogD d WHERE DATE(d.logdDate) = DATE(:date)")
    boolean existsByDate(@Param("date") LocalDateTime date);

    /**
     * 총 플레이 횟수 합계 (전체 기간)
     */
    @Query("SELECT SUM(d.logdCounts) FROM OpsLogD d")
    Long getTotalPlayCount();

    /**
     * 총 클리어 횟수 합계 (전체 기간)
     */
    @Query("SELECT SUM(d.logdSuccess) FROM OpsLogD d")
    Long getTotalSuccessCount();

    /**
     * 총 실패 횟수 합계 (전체 기간)
     */
    @Query("SELECT SUM(d.logdFail) FROM OpsLogD d")
    Long getTotalFailCount();

    /**
     * 평균 일일 방문자 수
     */
    @Query("SELECT AVG(d.logdTotal) FROM OpsLogD d")
    Double getAverageDailyVisitors();

    /**
     * 평균 일일 고유 방문자 수
     */
    @Query("SELECT AVG(d.logdUnique) FROM OpsLogD d")
    Double getAverageDailyUniqueVisitors();

    /**
     * 평균 클리어율 계산
     */
    @Query("SELECT AVG(CAST(d.logdSuccess AS double) / NULLIF(d.logdCounts, 0)) FROM OpsLogD d WHERE d.logdCounts > 0")
    Double getAverageClearRate();

    /**
     * 최고 방문자 수 기록
     */
    @Query("SELECT d FROM OpsLogD d ORDER BY d.logdTotal DESC LIMIT 1")
    Optional<OpsLogD> findDayWithMostVisitors();

    /**
     * 최고 플레이 횟수 기록
     */
    @Query("SELECT d FROM OpsLogD d ORDER BY d.logdCounts DESC LIMIT 1")
    Optional<OpsLogD> findDayWithMostPlays();

    /**
     * 일별 성장률 조회 (최근 N일)
     */
    @Query("SELECT d.logdDate, d.logdTotal, d.logdUnique FROM OpsLogD d ORDER BY d.logdDate DESC LIMIT :days")
    List<Object[]> getGrowthTrend(@Param("days") int days);

    /**
     * 특정 월의 통계 조회
     */
    @Query("SELECT d FROM OpsLogD d WHERE YEAR(d.logdDate) = :year AND MONTH(d.logdDate) = :month ORDER BY d.logdDate ASC")
    List<OpsLogD> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    /**
     * 월별 집계 통계
     */
    @Query("SELECT YEAR(d.logdDate), MONTH(d.logdDate), " +
            "SUM(d.logdTotal), SUM(d.logdUnique), SUM(d.logdCounts), " +
            "SUM(d.logdSuccess), SUM(d.logdFail) FROM OpsLogD d " +
            "GROUP BY YEAR(d.logdDate), MONTH(d.logdDate) ORDER BY YEAR(d.logdDate), MONTH(d.logdDate)")
    List<Object[]> getMonthlyStatistics();

    /**
     * 가장 최근 통계 날짜 조회
     */
    @Query("SELECT MAX(d.logdDate) FROM OpsLogD d")
    LocalDateTime findLatestDate();

    /**
     * 특정 날짜 이전의 통계 삭제 (데이터 정리용)
     */
    @Query("DELETE FROM OpsLogD d WHERE d.logdDate < :cutoffDate")
    void deleteOldStatistics(@Param("cutoffDate") LocalDateTime cutoffDate);
}
