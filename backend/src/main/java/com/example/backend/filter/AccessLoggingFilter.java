package com.example.backend.filter;

import com.example.backend.entity.OpsLogA;
import com.example.backend.entity.User;
import com.example.backend.repository.OpsLogARepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * HTTP 요청 로깅 필터
 * 모든 HTTP 요청에 대해 OpsLogA에 로그를 기록합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AccessLoggingFilter extends OncePerRequestFilter {

    private final OpsLogARepository opsLogARepository;

    // 로깅 제외할 경로 목록
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/actuator",
            "/health",
            "/favicon.ico",
            "/error"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // 제외할 경로인지 확인
        boolean shouldExclude = EXCLUDED_PATHS.stream()
                .anyMatch(requestPath::startsWith);

        if (shouldExclude) {
            filterChain.doFilter(request, response);
            return;
        }

        // 요청 처리
        filterChain.doFilter(request, response);

        // 응답 후 비동기로 로그 저장 (응답 시간에 영향 최소화)
        saveAccessLogAsync(request, response);
    }

    /**
     * 접속 로그를 비동기로 저장
     */
    @Async
    protected void saveAccessLogAsync(HttpServletRequest request, HttpServletResponse response) {
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String path = request.getRequestURI();
            String method = request.getMethod();
            String statusCode = String.valueOf(response.getStatus());

            // 현재 인증된 사용자 가져오기
            User currentUser = getCurrentUser();

            OpsLogA accessLog = OpsLogA.builder()
                    .user(currentUser)  // null일 수 있음 (비인증 요청)
                    .logaAddress(ipAddress)
                    .logaAgent(userAgent != null ? userAgent : "Unknown")
                    .logaPath(path)
                    .logaMethod(method)
                    .logaStatusCode(statusCode)
                    .build();

            opsLogARepository.save(accessLog);

        } catch (Exception e) {
            // 로그 저장 실패가 애플리케이션 동작에 영향을 주지 않도록 예외를 삼킴
            log.error("Access log save failed: {}", e.getMessage());
            log.debug("Access log error details", e);
        }
    }

    /**
     * 클라이언트 IP 주소 가져오기 (프록시 고려)
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // X-Forwarded-For에 여러 IP가 있을 경우 첫 번째 IP 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        // IP 마스킹 (개인정보 보호) - 마지막 옥텟 마스킹
        if (ip != null && ip.contains(".")) {
            String[] parts = ip.split("\\.");
            if (parts.length == 4) {
                ip = parts[0] + "." + parts[1] + "." + parts[2] + ".XXX";
            }
        }

        return ip;
    }

    /**
     * 현재 인증된 사용자 가져오기
     */
    private User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {

                Object principal = authentication.getPrincipal();

                if (principal instanceof User) {
                    return (User) principal;
                } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    // UserDetails에서 사용자 이름으로 User 조회 필요
                    // 현재는 User 객체를 직접 principal로 사용하지 않으므로 null 반환
                    return null;
                }
            }
        } catch (Exception e) {
            // Silently handle authentication context errors
        }

        return null;
    }
}
