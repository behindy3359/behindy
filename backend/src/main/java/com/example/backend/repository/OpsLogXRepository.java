package com.example.backend.repository;

import com.example.backend.entity.OpsLogX;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OpsLogXRepository extends JpaRepository<OpsLogX, Long> {

    /**
     * 서비스별 에러 조회 (최신순)
     */
    @Query("SELECT l FROM OpsLogX l WHERE l.logxService = :service " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogX> findByServiceOrderByCreatedAtDesc(@Param("service") String service);

    /**
     * 최근 에러 조회 (제한된 개수)
     */
    @Query("SELECT l FROM OpsLogX l ORDER BY l.createdAt DESC")
    List<OpsLogX> findRecentErrors();

    /**
     * 특정 기간 내 서비스별 에러 빈도 분석
     */
    @Query("SELECT l.logxService, COUNT(l) as errorCount FROM OpsLogX l " +
            "WHERE l.createdAt >= :since " +
            "GROUP BY l.logxService ORDER BY errorCount DESC")
    List<Object[]> findErrorFrequencyByService(@Param("since") LocalDateTime since);

    /**
     * 특정 메시지 패턴 검색
     */
    @Query("SELECT l FROM OpsLogX l WHERE l.logxMessage LIKE %:keyword% " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogX> findByMessageContaining(@Param("keyword") String keyword);

    /**
     * 특정 기간의 총 에러 수
     */
    @Query("SELECT COUNT(l) FROM OpsLogX l " +
            "WHERE l.createdAt BETWEEN :start AND :end")
    Long countErrorsBetween(@Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);

    /**
     * 일별 에러 발생 통계
     */
    @Query("SELECT DATE(l.createdAt) as date, COUNT(l) as errorCount FROM OpsLogX l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(l.createdAt) ORDER BY date DESC")
    List<Object[]> findDailyErrorStats(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    /**
     * 시간대별 에러 발생 패턴
     */
    @Query("SELECT HOUR(l.createdAt) as hour, COUNT(l) as errorCount FROM OpsLogX l " +
            "WHERE l.createdAt >= :since " +
            "GROUP BY HOUR(l.createdAt) ORDER BY hour")
    List<Object[]> findHourlyErrorPattern(@Param("since") LocalDateTime since);

    /**
     * 특정 서비스의 최근 에러
     */
    @Query("SELECT l FROM OpsLogX l WHERE l.logxService = :service " +
            "AND l.createdAt >= :since ORDER BY l.createdAt DESC")
    List<OpsLogX> findRecentErrorsByService(@Param("service") String service,
                                            @Param("since") LocalDateTime since);

    /**
     * 가장 빈번한 에러 메시지 TOP N
     */
    @Query("SELECT l.logxMessage, COUNT(l) as frequency FROM OpsLogX l " +
            "WHERE l.createdAt >= :since " +
            "GROUP BY l.logxMessage ORDER BY frequency DESC")
    List<Object[]> findMostFrequentErrors(@Param("since") LocalDateTime since);

    /**
     * 서비스별 에러율 추이
     */
    @Query("SELECT l.logxService, DATE(l.createdAt) as date, COUNT(l) as errorCount " +
            "FROM OpsLogX l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY l.logxService, DATE(l.createdAt) " +
            "ORDER BY date DESC, errorCount DESC")
    List<Object[]> findErrorTrendByService(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);

    /**
     * 특정 스택트레이스 패턴 검색
     */
    @Query("SELECT l FROM OpsLogX l WHERE l.logxStktrace LIKE %:pattern% " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogX> findByStackTraceContaining(@Param("pattern") String pattern);

    /**
     * 에러가 없는 날 수 계산 (특정 기간)
     */
    @Query("SELECT COUNT(DISTINCT DATE(l.createdAt)) FROM OpsLogX l " +
            "WHERE l.createdAt BETWEEN :start AND :end")
    Long countDaysWithErrors(@Param("start") LocalDateTime start,
                            @Param("end") LocalDateTime end);
}
