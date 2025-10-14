package com.example.backend.repository;

import com.example.backend.entity.OpsLogA;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OpsLogARepository extends JpaRepository<OpsLogA, Long> {

    /**
     * 특정 사용자의 접속 로그 조회 (최신순)
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.user.userId = :userId ORDER BY a.createdAt DESC")
    List<OpsLogA> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * 특정 IP 주소의 접속 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.logaAddress = :ipAddress ORDER BY a.createdAt DESC")
    List<OpsLogA> findByIpAddress(@Param("ipAddress") String ipAddress);

    /**
     * 특정 기간의 접속 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<OpsLogA> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    /**
     * 특정 경로의 접속 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.logaPath = :path ORDER BY a.createdAt DESC")
    List<OpsLogA> findByPath(@Param("path") String path);

    /**
     * 특정 HTTP 메서드의 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.logaMethod = :method ORDER BY a.createdAt DESC")
    List<OpsLogA> findByMethod(@Param("method") String method);

    /**
     * 특정 상태 코드의 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.logaStatusCode = :statusCode ORDER BY a.createdAt DESC")
    List<OpsLogA> findByStatusCode(@Param("statusCode") String statusCode);

    /**
     * 경로별 접속 통계
     */
    @Query("SELECT a.logaPath, COUNT(a) as count FROM OpsLogA a " +
            "GROUP BY a.logaPath ORDER BY count DESC")
    List<Object[]> getAccessStatisticsByPath();

    /**
     * 일일 고유 방문자 수 계산
     */
    @Query("SELECT COUNT(DISTINCT a.user.userId) FROM OpsLogA a " +
            "WHERE DATE(a.createdAt) = DATE(:date) AND a.user IS NOT NULL")
    Long countUniqueVisitorsByDate(@Param("date") LocalDateTime date);

    /**
     * 일일 총 방문자 수 (인증되지 않은 사용자 포함)
     */
    @Query("SELECT COUNT(a) FROM OpsLogA a WHERE DATE(a.createdAt) = DATE(:date)")
    Long countTotalVisitorsByDate(@Param("date") LocalDateTime date);

    /**
     * 특정 기간의 고유 방문자 수
     */
    @Query("SELECT COUNT(DISTINCT a.user.userId) FROM OpsLogA a " +
            "WHERE a.createdAt BETWEEN :startDate AND :endDate AND a.user IS NOT NULL")
    Long countUniqueVisitorsBetween(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    /**
     * 인기 엔드포인트 TOP N
     */
    @Query("SELECT a.logaPath, COUNT(a) as count FROM OpsLogA a " +
            "GROUP BY a.logaPath ORDER BY count DESC")
    List<Object[]> findMostAccessedEndpoints();

    /**
     * 특정 사용자의 접속 횟수
     */
    @Query("SELECT COUNT(a) FROM OpsLogA a WHERE a.user.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * HTTP 메서드별 통계
     */
    @Query("SELECT a.logaMethod, COUNT(a) as count FROM OpsLogA a " +
            "GROUP BY a.logaMethod ORDER BY count DESC")
    List<Object[]> getStatisticsByMethod();

    /**
     * 상태 코드별 통계
     */
    @Query("SELECT a.logaStatusCode, COUNT(a) as count FROM OpsLogA a " +
            "GROUP BY a.logaStatusCode ORDER BY a.logaStatusCode")
    List<Object[]> getStatisticsByStatusCode();

    /**
     * 시간대별 접속 통계 (최근 24시간)
     */
    @Query("SELECT HOUR(a.createdAt) as hour, COUNT(a) as count FROM OpsLogA a " +
            "WHERE a.createdAt >= :startTime GROUP BY HOUR(a.createdAt) ORDER BY hour")
    List<Object[]> getHourlyAccessTrend(@Param("startTime") LocalDateTime startTime);

    /**
     * 의심스러운 IP (특정 시간 내 과도한 요청)
     */
    @Query("SELECT a.logaAddress, COUNT(a) as count FROM OpsLogA a " +
            "WHERE a.createdAt >= :startTime GROUP BY a.logaAddress " +
            "HAVING COUNT(a) > :threshold ORDER BY count DESC")
    List<Object[]> findSuspiciousIPs(@Param("startTime") LocalDateTime startTime,
                                      @Param("threshold") long threshold);

    /**
     * 오래된 접속 로그 삭제 (보관 기간 지난 것)
     */
    @Query("DELETE FROM OpsLogA a WHERE a.createdAt < :cutoffDate")
    void deleteOldAccessLogs(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * 인증된 사용자의 최근 접속 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.user IS NOT NULL ORDER BY a.createdAt DESC")
    List<OpsLogA> findAuthenticatedAccessLogs();

    /**
     * 미인증 접속 로그 조회
     */
    @Query("SELECT a FROM OpsLogA a WHERE a.user IS NULL ORDER BY a.createdAt DESC")
    List<OpsLogA> findUnauthenticatedAccessLogs();
}
