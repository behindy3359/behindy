package com.example.backend.controller;

import com.example.backend.dto.statistics.*;
import com.example.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 통계 API 컨트롤러 (관리자 전용)
 */
@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")  // 모든 엔드포인트에 관리자 권한 필요
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 전체 통계 요약 조회
     * GET /api/statistics/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<OverallSummaryResponse> getOverallSummary() {
        log.info("전체 통계 요약 조회 요청");
        OverallSummaryResponse summary = statisticsService.getOverallSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * 일별 통계 조회
     * GET /api/statistics/daily?date=2024-10-14T00:00:00
     */
    @GetMapping("/daily")
    public ResponseEntity<DailyStatisticsResponse> getDailyStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        log.info("일별 통계 조회 요청: date={}", date);
        DailyStatisticsResponse stats = statisticsService.getDailyStatistics(date);
        return ResponseEntity.ok(stats);
    }

    /**
     * 최근 N일 통계 조회
     * GET /api/statistics/recent?days=7
     */
    @GetMapping("/recent")
    public ResponseEntity<List<DailyStatisticsResponse>> getRecentStatistics(
            @RequestParam(defaultValue = "7") int days) {
        log.info("최근 {}일 통계 조회 요청", days);
        List<DailyStatisticsResponse> stats = statisticsService.getRecentStatistics(days);
        return ResponseEntity.ok(stats);
    }

    /**
     * 기간별 통계 조회
     * GET /api/statistics/period?startDate=2024-10-01T00:00:00&endDate=2024-10-14T23:59:59
     */
    @GetMapping("/period")
    public ResponseEntity<PeriodStatisticsResponse> getPeriodStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("기간별 통계 조회 요청: {} ~ {}", startDate, endDate);
        PeriodStatisticsResponse stats = statisticsService.getPeriodStatistics(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * 인기 스토리 순위 조회
     * GET /api/statistics/popular-stories?limit=10
     */
    @GetMapping("/popular-stories")
    public ResponseEntity<List<PopularStoryResponse>> getPopularStories(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("인기 스토리 TOP {} 조회 요청", limit);
        List<PopularStoryResponse> stories = statisticsService.getPopularStories(limit);
        return ResponseEntity.ok(stories);
    }

    /**
     * 페이지별 선택지 통계 조회
     * GET /api/statistics/options?pageId=123
     */
    @GetMapping("/options")
    public ResponseEntity<List<OptionStatisticsResponse>> getOptionStatistics(
            @RequestParam Long pageId) {
        log.info("페이지 {}의 선택지 통계 조회 요청", pageId);
        List<OptionStatisticsResponse> options = statisticsService.getOptionStatistics(pageId);
        return ResponseEntity.ok(options);
    }

    /**
     * 페이지 체류 시간 통계 조회
     * GET /api/statistics/page-duration
     */
    @GetMapping("/page-duration")
    public ResponseEntity<List<PageStatisticsResponse>> getPageDurationStatistics() {
        log.info("페이지 체류 시간 통계 조회 요청");
        List<PageStatisticsResponse> pageStats = statisticsService.getPageDurationStatistics();
        return ResponseEntity.ok(pageStats);
    }

    /**
     * 에러 통계 조회 (서비스별)
     * GET /api/statistics/errors
     */
    @GetMapping("/errors")
    public ResponseEntity<List<ErrorStatisticsResponse>> getErrorStatistics() {
        log.info("에러 통계 조회 요청");
        List<ErrorStatisticsResponse> errors = statisticsService.getErrorStatistics();
        return ResponseEntity.ok(errors);
    }

    /**
     * 접속 통계 조회 - 경로별
     * GET /api/statistics/access/by-path
     */
    @GetMapping("/access/by-path")
    public ResponseEntity<List<AccessStatisticsResponse>> getAccessStatisticsByPath() {
        log.info("경로별 접속 통계 조회 요청");
        List<AccessStatisticsResponse> accessStats = statisticsService.getAccessStatisticsByPath();
        return ResponseEntity.ok(accessStats);
    }

    /**
     * 접속 통계 조회 - HTTP 메서드별
     * GET /api/statistics/access/by-method
     */
    @GetMapping("/access/by-method")
    public ResponseEntity<List<AccessStatisticsResponse>> getAccessStatisticsByMethod() {
        log.info("HTTP 메서드별 접속 통계 조회 요청");
        List<AccessStatisticsResponse> accessStats = statisticsService.getAccessStatisticsByMethod();
        return ResponseEntity.ok(accessStats);
    }

    /**
     * 접속 통계 조회 - 상태 코드별
     * GET /api/statistics/access/by-status
     */
    @GetMapping("/access/by-status")
    public ResponseEntity<List<AccessStatisticsResponse>> getAccessStatisticsByStatusCode() {
        log.info("상태 코드별 접속 통계 조회 요청");
        List<AccessStatisticsResponse> accessStats = statisticsService.getAccessStatisticsByStatusCode();
        return ResponseEntity.ok(accessStats);
    }
}
