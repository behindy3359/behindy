package com.example.backend.service;

import com.example.backend.dto.StoryPopularityDto;
import com.example.backend.dto.SystemHealthDto;
import com.example.backend.dto.UserActivitySummaryDto;
import com.example.backend.entity.Story;
import com.example.backend.entity.User;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LogAnalyticsService {

    private final LogERepository logERepository;
    private final LogORepository logORepository;
    private final OpsLogARepository opsLogARepository;
    private final OpsLogBRepository opsLogBRepository;
    private final OpsLogDRepository opsLogDRepository;
    private final OpsLogXRepository opsLogXRepository;
    private final UserRepository userRepository;

    /**
     * 사용자 활동 요약 조회
     */
    public UserActivitySummaryDto getUserActivitySummary(Long userId, LocalDateTime start, LocalDateTime end) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 접속 통계
        List<com.example.backend.entity.OpsLogA> accessLogs =
            opsLogARepository.findRecentActivityByUser(userId, start);
        Long totalAccessCount = (long) accessLogs.size();
        LocalDateTime lastAccess = accessLogs.isEmpty() ? null : accessLogs.get(0).getCreatedAt();

        // 게임 플레이 통계
        Long totalPlays = logERepository.countTotalPlaysByCharacter(userId);
        Long completions = logERepository.countCompletionsByCharacter(userId);
        Long failed = totalPlays - completions;
        Double clearRate = totalPlays > 0 ? (completions * 100.0 / totalPlays) : 0.0;

        // 선택지 통계
        Long totalOptions = (long) logORepository.findByCharacterIdOrderByCreatedAtDesc(userId).size();

        return UserActivitySummaryDto.builder()
                .userId(userId)
                .username(user.getUserName())
                .totalAccessCount(totalAccessCount)
                .lastAccessTime(lastAccess)
                .firstAccessTime(accessLogs.isEmpty() ? null : accessLogs.get(accessLogs.size() - 1).getCreatedAt())
                .totalPlayCount(totalPlays)
                .completedCount(completions)
                .failedCount(failed)
                .clearRate(clearRate)
                .totalOptionsSelected(totalOptions)
                .periodStart(start)
                .periodEnd(end)
                .build();
    }

    /**
     * 스토리 인기도 분석
     */
    public List<StoryPopularityDto> getStoryPopularity(int limit) {
        List<Object[]> popularStories = logERepository.findPopularStoriesByCompletions();
        List<StoryPopularityDto> result = new ArrayList<>();

        int rank = 1;
        for (Object[] row : popularStories) {
            if (rank > limit) break;

            Story story = (Story) row[0];
            Long completions = ((Number) row[1]).longValue();

            Long totalPlays = logERepository.countTotalPlaysByStory(story.getStoId());
            Long failed = totalPlays - completions;
            Double clearRate = totalPlays > 0 ? (completions * 100.0 / totalPlays) : 0.0;
            Double avgPlayTime = opsLogBRepository.findAveragePlayTimeByStory(story.getStoId());

            result.add(StoryPopularityDto.builder()
                    .storyId(story.getStoId())
                    .storyTitle(story.getStoTitle())
                    .storyDescription(story.getStoDescription())
                    .totalPlayCount(totalPlays)
                    .completedCount(completions)
                    .failedCount(failed)
                    .clearRate(clearRate)
                    .avgPlayTime(avgPlayTime != null ? avgPlayTime : 0.0)
                    .ranking(rank++)
                    .build());
        }

        return result;
    }

    /**
     * 시스템 헬스 체크
     */
    public SystemHealthDto getSystemHealth() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneDayAgo = now.minusDays(1);
        LocalDateTime oneHourAgo = now.minusHours(1);

        // 트래픽 통계
        Long totalRequests = opsLogARepository.count();
        Long uniqueVisitors = opsLogARepository.countUniqueVisitors(oneDayAgo, now);
        Long activeUsers = opsLogARepository.countUniqueVisitors(oneHourAgo, now);

        // 에러 통계
        Long errorCount = opsLogXRepository.countErrorsBetween(oneDayAgo, now);
        Long errorCountLastHour = opsLogXRepository.countErrorsBetween(oneHourAgo, now);
        Long requestsLastDay = opsLogARepository.count();
        Double errorRate = requestsLastDay > 0 ? (errorCount * 100.0 / requestsLastDay) : 0.0;

        // 게임 통계
        Long activeGames = logERepository.count();
        Long completedGames = (long) logERepository.findRecentCompletions(oneDayAgo).size();
        Double clearRate = opsLogDRepository.calculateClearRate(oneDayAgo, now);

        // 시스템 상태 판정
        String systemStatus = determineSystemStatus(errorRate, errorCountLastHour);

        return SystemHealthDto.builder()
                .checkTime(now)
                .totalRequests(totalRequests)
                .uniqueVisitors(uniqueVisitors)
                .activeUsers(activeUsers)
                .errorCount(errorCount)
                .errorCountLastHour(errorCountLastHour)
                .errorRate(errorRate)
                .activeGames(activeGames)
                .completedGames((long) completedGames)
                .currentClearRate(clearRate != null ? clearRate : 0.0)
                .avgResponseTime(0.0) // TODO: 성능 로그 구현 후 추가
                .systemStatus(systemStatus)
                .build();
    }

    /**
     * 시스템 상태 판정
     */
    private String determineSystemStatus(Double errorRate, Long recentErrors) {
        if (errorRate > 10.0 || recentErrors > 100) {
            return "CRITICAL";
        } else if (errorRate > 5.0 || recentErrors > 50) {
            return "WARNING";
        } else {
            return "HEALTHY";
        }
    }

    /**
     * 페이지별 성과 분석
     */
    public List<Object[]> getPagePerformance() {
        return opsLogBRepository.findAverageDurationByPage();
    }

    /**
     * 이탈률이 높은 페이지 조회
     */
    public List<Object[]> getDropoffPages() {
        return opsLogBRepository.findDropoffPages();
    }

    /**
     * 최근 트래픽 추이
     */
    public List<Object[]> getTrafficTrend(LocalDateTime start, LocalDateTime end) {
        return opsLogARepository.findDailyRequestStats(start, end);
    }

    /**
     * 옵션 선택 분포 분석
     */
    public List<Object[]> getOptionSelectionDistribution(LocalDateTime start, LocalDateTime end) {
        return logORepository.findOptionSelectionStats(start, end);
    }
}
