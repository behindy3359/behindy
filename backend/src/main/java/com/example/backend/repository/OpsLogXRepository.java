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
     * 특정 서비스의 에러 로그 조회 (최신순)
     */
    @Query("SELECT x FROM OpsLogX x WHERE x.logxService = :serviceName ORDER BY x.createdAt DESC")
    List<OpsLogX> findByServiceNameOrderByCreatedAtDesc(@Param("serviceName") String serviceName);

    /**
     * 특정 기간의 에러 로그 조회
     */
    @Query("SELECT x FROM OpsLogX x WHERE x.createdAt BETWEEN :startDate AND :endDate ORDER BY x.createdAt DESC")
    List<OpsLogX> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    /**
     * 특정 에러 메시지를 포함하는 로그 검색
     */
    @Query("SELECT x FROM OpsLogX x WHERE x.logxMessage LIKE %:keyword% ORDER BY x.createdAt DESC")
    List<OpsLogX> findByMessageContaining(@Param("keyword") String keyword);

    /**
     * 서비스별 에러 발생 횟수 통계
     */
    @Query("SELECT x.logxService, COUNT(x) as errorCount FROM OpsLogX x " +
            "GROUP BY x.logxService ORDER BY errorCount DESC")
    List<Object[]> getErrorCountByService();

    /**
     * 특정 서비스의 에러 발생 횟수
     */
    @Query("SELECT COUNT(x) FROM OpsLogX x WHERE x.logxService = :serviceName")
    Long countErrorsByService(@Param("serviceName") String serviceName);

    /**
     * 최근 N개의 에러 로그 조회
     */
    @Query("SELECT x FROM OpsLogX x ORDER BY x.createdAt DESC LIMIT :limit")
    List<OpsLogX> findRecentErrors(@Param("limit") int limit);

    /**
     * 특정 기간의 에러 발생 횟수
     */
    @Query("SELECT COUNT(x) FROM OpsLogX x WHERE x.createdAt BETWEEN :startDate AND :endDate")
    Long countErrorsBetween(@Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);

    /**
     * 가장 많이 발생하는 에러 메시지 TOP N
     */
    @Query("SELECT x.logxMessage, COUNT(x) as count FROM OpsLogX x " +
            "GROUP BY x.logxMessage ORDER BY count DESC")
    List<Object[]> findMostFrequentErrors();

    /**
     * 특정 날짜의 에러 로그 조회
     */
    @Query("SELECT x FROM OpsLogX x WHERE DATE(x.createdAt) = DATE(:date) ORDER BY x.createdAt DESC")
    List<OpsLogX> findErrorsByDate(@Param("date") LocalDateTime date);

    /**
     * 시간별 에러 발생 추이 (최근 24시간)
     */
    @Query("SELECT HOUR(x.createdAt) as hour, COUNT(x) as count FROM OpsLogX x " +
            "WHERE x.createdAt >= :startTime GROUP BY HOUR(x.createdAt) ORDER BY hour")
    List<Object[]> getHourlyErrorTrend(@Param("startTime") LocalDateTime startTime);

    /**
     * 오래된 에러 로그 삭제 (보관 기간 지난 것)
     */
    @Query("DELETE FROM OpsLogX x WHERE x.createdAt < :cutoffDate")
    void deleteOldErrors(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * 특정 서비스의 특정 기간 에러 로그
     */
    @Query("SELECT x FROM OpsLogX x WHERE x.logxService = :serviceName " +
            "AND x.createdAt BETWEEN :startDate AND :endDate ORDER BY x.createdAt DESC")
    List<OpsLogX> findByServiceAndDateRange(@Param("serviceName") String serviceName,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);
}
