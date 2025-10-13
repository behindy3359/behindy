package com.example.backend.service;

import com.example.backend.dto.ErrorSummaryDto;
import com.example.backend.entity.OpsLogX;
import com.example.backend.repository.OpsLogXRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ErrorMonitoringService {

    private final OpsLogXRepository opsLogXRepository;

    /**
     * 에러 로깅
     */
    @Transactional
    public void logError(String service, Exception exception) {
        try {
            String stackTrace = getStackTraceAsString(exception);

            OpsLogX errorLog = OpsLogX.builder()
                    .logxService(service)
                    .logxMessage(exception.getMessage())
                    .logxStktrace(stackTrace)
                    .build();

            opsLogXRepository.save(errorLog);

            // 심각한 에러일 경우 알림
            if (isCritical(exception)) {
                notifyIfCritical(errorLog);
            }

            log.error("[ErrorMonitoring] Error logged for service: {}", service, exception);
        } catch (Exception e) {
            // 로깅 실패 시에도 시스템이 중단되지 않도록
            log.error("[ErrorMonitoring] Failed to log error", e);
        }
    }

    /**
     * 최근 에러 조회
     */
    @Transactional(readOnly = true)
    public List<ErrorSummaryDto> getRecentErrors(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<OpsLogX> errors = opsLogXRepository.findRecentErrors();

        // 최근 N시간 이내 에러만 필터링
        return errors.stream()
                .filter(error -> error.getCreatedAt().isAfter(since))
                .limit(100) // 최대 100개까지
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 서비스별 에러 빈도 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getErrorFrequencyByService(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<Object[]> results = opsLogXRepository.findErrorFrequencyByService(since);

        Map<String, Long> frequency = new HashMap<>();
        for (Object[] row : results) {
            frequency.put((String) row[0], ((Number) row[1]).longValue());
        }
        return frequency;
    }

    /**
     * 가장 빈번한 에러 메시지 조회
     */
    @Transactional(readOnly = true)
    public List<ErrorSummaryDto> getMostFrequentErrors(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> results = opsLogXRepository.findMostFrequentErrors(since);

        List<ErrorSummaryDto> summaries = new ArrayList<>();
        for (Object[] row : results) {
            summaries.add(ErrorSummaryDto.builder()
                    .message((String) row[0])
                    .frequency(((Number) row[1]).intValue())
                    .build());
        }
        return summaries;
    }

    /**
     * 일별 에러 통계
     */
    @Transactional(readOnly = true)
    public List<Object[]> getDailyErrorStats(LocalDateTime start, LocalDateTime end) {
        return opsLogXRepository.findDailyErrorStats(start, end);
    }

    /**
     * 시간대별 에러 패턴
     */
    @Transactional(readOnly = true)
    public List<Object[]> getHourlyErrorPattern(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return opsLogXRepository.findHourlyErrorPattern(since);
    }

    /**
     * 특정 서비스의 최근 에러
     */
    @Transactional(readOnly = true)
    public List<ErrorSummaryDto> getErrorsByService(String service, int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<OpsLogX> errors = opsLogXRepository.findRecentErrorsByService(service, since);

        return errors.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 에러 검색
     */
    @Transactional(readOnly = true)
    public List<ErrorSummaryDto> searchErrors(String keyword) {
        List<OpsLogX> errors = opsLogXRepository.findByMessageContaining(keyword);

        return errors.stream()
                .limit(50)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 심각한 에러 알림
     */
    public void notifyIfCritical(OpsLogX error) {
        // TODO: 실제 알림 시스템 구현 (이메일, 슬랙, 디스코드 등)
        log.warn("[CRITICAL ERROR] Service: {}, Message: {}",
                error.getLogxService(), error.getLogxMessage());
    }

    /**
     * 에러가 심각한지 판단
     */
    private boolean isCritical(Exception exception) {
        String message = exception.getMessage();
        if (message == null) return false;

        // 특정 키워드가 포함된 에러는 심각하다고 판단
        return message.contains("OutOfMemory")
                || message.contains("Database connection")
                || message.contains("NullPointerException")
                || exception instanceof RuntimeException;
    }

    /**
     * 스택트레이스를 문자열로 변환
     */
    private String getStackTraceAsString(Exception exception) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        exception.printStackTrace(pw);
        return sw.toString();
    }

    /**
     * Entity를 DTO로 변환
     */
    private ErrorSummaryDto convertToDto(OpsLogX error) {
        return ErrorSummaryDto.builder()
                .errorId(error.getLogxId())
                .service(error.getLogxService())
                .message(error.getLogxMessage())
                .stackTrace(error.getLogxStktrace())
                .occurredAt(error.getCreatedAt())
                .build();
    }
}
