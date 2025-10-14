package com.example.backend.service;

import com.example.backend.entity.OpsLogD;
import com.example.backend.repository.LogERepository;
import com.example.backend.repository.OpsLogARepository;
import com.example.backend.repository.OpsLogDRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 일일 통계 집계 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DailyStatisticsService {

    private final OpsLogDRepository opsLogDRepository;
    private final OpsLogARepository opsLogARepository;
    private final LogERepository logERepository;

    /**
     * 매일 자정에 전날 통계 생성
     * cron: 초 분 시 일 월 요일
     * "0 0 0 * * *" = 매일 0시 0분 0초
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void generateDailyStatistics() {
        // 어제 날짜 계산
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1)
                .with(LocalTime.of(0, 0, 0));

        log.info("일일 통계 생성 시작: {}", yesterday.toLocalDate());

        try {
            // 이미 생성된 통계가 있는지 확인
            if (opsLogDRepository.existsByDate(yesterday)) {
                log.warn("이미 생성된 통계가 있습니다: {}", yesterday.toLocalDate());
                return;
            }

            // 통계 데이터 생성
            OpsLogD statistics = generateStatisticsForDate(yesterday);

            // 저장
            opsLogDRepository.save(statistics);

            log.info("일일 통계 생성 완료: date={}, total={}, unique={}, login={}, plays={}, success={}, fail={}",
                    yesterday.toLocalDate(),
                    statistics.getLogdTotal(),
                    statistics.getLogdUnique(),
                    statistics.getLogdLogin(),
                    statistics.getLogdCounts(),
                    statistics.getLogdSuccess(),
                    statistics.getLogdFail());

        } catch (Exception e) {
            log.error("일일 통계 생성 실패: date={}", yesterday.toLocalDate(), e);
        }
    }

    /**
     * 특정 날짜의 통계 생성 (수동 실행용)
     */
    @Transactional
    public OpsLogD generateStatisticsForDate(LocalDateTime date) {
        LocalDateTime startOfDay = date.with(LocalTime.of(0, 0, 0));
        LocalDateTime endOfDay = date.with(LocalTime.of(23, 59, 59));

        log.debug("통계 계산 기간: {} ~ {}", startOfDay, endOfDay);

        // 1. 총 방문자 수 (인증 + 비인증)
        Long totalVisitors = opsLogARepository.countTotalVisitorsByDate(startOfDay);
        if (totalVisitors == null) totalVisitors = 0L;

        // 2. 고유 방문자 수 (인증된 사용자만)
        Long uniqueVisitors = opsLogARepository.countUniqueVisitorsByDate(startOfDay);
        if (uniqueVisitors == null) uniqueVisitors = 0L;

        // 3. 로그인한 사용자 수 (인증된 접속 로그 수)
        Long loginCount = opsLogARepository.countUniqueVisitorsByDate(startOfDay);
        if (loginCount == null) loginCount = 0L;

        // 4. 게임 플레이 횟수 (LogE의 총 개수)
        Long playCount = logERepository.countTotalPlaysByCharacter(null); // null이면 전체 조회
        // 특정 날짜의 플레이 횟수를 위해 기간 필터링이 필요하지만,
        // LogERepository에 날짜별 카운트 메서드가 없으므로 추가 필요
        // 임시로 전체 카운트 사용
        if (playCount == null) playCount = 0L;

        // 5. 게임 클리어 횟수
        Long successCount = countSuccessByDate(startOfDay, endOfDay);

        // 6. 게임 실패 횟수
        Long failCount = countFailByDate(startOfDay, endOfDay);

        return OpsLogD.builder()
                .logdDate(startOfDay)
                .logdTotal(totalVisitors)
                .logdUnique(uniqueVisitors)
                .logdLogin(loginCount)
                .logdCounts(playCount)
                .logdSuccess(successCount)
                .logdFail(failCount)
                .build();
    }

    /**
     * 특정 날짜의 성공 횟수 계산
     */
    private Long countSuccessByDate(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            // LogERepository에 날짜별 조회 메서드가 있다면 사용
            // 현재는 임시로 최근 완료 기록에서 카운트
            return logERepository.findRecentCompletions(startDate).stream()
                    .filter(log -> log.getCreatedAt().isBefore(endDate))
                    .count();
        } catch (Exception e) {
            log.warn("성공 횟수 계산 실패", e);
            return 0L;
        }
    }

    /**
     * 특정 날짜의 실패 횟수 계산
     */
    private Long countFailByDate(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            // LogE에서 logeEnding = 0인 것이 실패
            // 현재는 전체 플레이 - 성공 = 실패로 계산
            Long totalPlays = logERepository.findRecentCompletions(startDate).stream()
                    .filter(log -> log.getCreatedAt().isBefore(endDate))
                    .count();
            Long successCount = countSuccessByDate(startDate, endDate);
            return Math.max(0L, totalPlays - successCount);
        } catch (Exception e) {
            log.warn("실패 횟수 계산 실패", e);
            return 0L;
        }
    }

    /**
     * 최근 N일 통계 조회
     */
    @Transactional(readOnly = true)
    public java.util.List<OpsLogD> getRecentStatistics(int days) {
        return opsLogDRepository.findRecentDays(days);
    }

    /**
     * 특정 기간 통계 조회
     */
    @Transactional(readOnly = true)
    public java.util.List<OpsLogD> getStatisticsBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return opsLogDRepository.findByDateBetween(startDate, endDate);
    }

    /**
     * 전체 통계 요약
     */
    @Transactional(readOnly = true)
    public StatisticsSummary getOverallSummary() {
        Long totalPlays = opsLogDRepository.getTotalPlayCount();
        Long totalSuccess = opsLogDRepository.getTotalSuccessCount();
        Long totalFail = opsLogDRepository.getTotalFailCount();
        Double avgVisitors = opsLogDRepository.getAverageDailyVisitors();
        Double avgUnique = opsLogDRepository.getAverageDailyUniqueVisitors();
        Double avgClearRate = opsLogDRepository.getAverageClearRate();

        return StatisticsSummary.builder()
                .totalPlays(totalPlays != null ? totalPlays : 0L)
                .totalSuccess(totalSuccess != null ? totalSuccess : 0L)
                .totalFail(totalFail != null ? totalFail : 0L)
                .averageDailyVisitors(avgVisitors != null ? avgVisitors : 0.0)
                .averageDailyUniqueVisitors(avgUnique != null ? avgUnique : 0.0)
                .averageClearRate(avgClearRate != null ? avgClearRate * 100 : 0.0) // 백분율로 변환
                .build();
    }

    /**
     * 통계 요약 DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class StatisticsSummary {
        private Long totalPlays;
        private Long totalSuccess;
        private Long totalFail;
        private Double averageDailyVisitors;
        private Double averageDailyUniqueVisitors;
        private Double averageClearRate; // 백분율
    }
}
