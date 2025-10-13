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
     * 사용자별 접속 이력 조회 (최신순)
     */
    @Query("SELECT l FROM OpsLogA l WHERE l.user.userId = :userId ORDER BY l.createdAt DESC")
    List<OpsLogA> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * 특정 IP 주소의 요청 횟수
     */
    @Query("SELECT COUNT(l) FROM OpsLogA l WHERE l.logaAddress = :ipAddress")
    Long countByIpAddress(@Param("ipAddress") String ipAddress);

    /**
     * 시간대별 트래픽 분석
     */
    @Query("SELECT HOUR(l.createdAt) as hour, COUNT(l) as requestCount FROM OpsLogA l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY HOUR(l.createdAt) ORDER BY hour")
    List<Object[]> findHourlyTraffic(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

    /**
     * 에러 응답 필터링 (4xx, 5xx)
     */
    @Query("SELECT l FROM OpsLogA l WHERE l.logaStatusCode LIKE :statusPrefix% " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogA> findByStatusCodeStartingWith(@Param("statusPrefix") String statusPrefix);

    /**
     * 특정 경로에 대한 요청 통계
     */
    @Query("SELECT l.logaPath, COUNT(l) as requestCount FROM OpsLogA l " +
            "WHERE l.createdAt >= :since " +
            "GROUP BY l.logaPath ORDER BY requestCount DESC")
    List<Object[]> findMostAccessedPaths(@Param("since") LocalDateTime since);

    /**
     * HTTP 메서드별 요청 분포
     */
    @Query("SELECT l.logaMethod, COUNT(l) FROM OpsLogA l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY l.logaMethod")
    List<Object[]> findRequestDistributionByMethod(@Param("start") LocalDateTime start,
                                                   @Param("end") LocalDateTime end);

    /**
     * 최근 에러 로그 조회
     */
    @Query("SELECT l FROM OpsLogA l WHERE l.logaStatusCode >= '400' " +
            "ORDER BY l.createdAt DESC")
    List<OpsLogA> findRecentErrors();

    /**
     * 특정 사용자의 최근 활동 조회
     */
    @Query("SELECT l FROM OpsLogA l WHERE l.user.userId = :userId " +
            "AND l.createdAt >= :since ORDER BY l.createdAt DESC")
    List<OpsLogA> findRecentActivityByUser(@Param("userId") Long userId,
                                           @Param("since") LocalDateTime since);

    /**
     * 고유 방문자 수 (기간별)
     */
    @Query("SELECT COUNT(DISTINCT l.user) FROM OpsLogA l " +
            "WHERE l.createdAt BETWEEN :start AND :end")
    Long countUniqueVisitors(@Param("start") LocalDateTime start,
                            @Param("end") LocalDateTime end);

    /**
     * 일별 요청 수 통계
     */
    @Query("SELECT DATE(l.createdAt) as date, COUNT(l) as requestCount FROM OpsLogA l " +
            "WHERE l.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(l.createdAt) ORDER BY date")
    List<Object[]> findDailyRequestStats(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);
}
