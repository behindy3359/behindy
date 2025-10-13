package com.example.backend.config;

import com.example.backend.entity.OpsLogA;
import com.example.backend.entity.User;
import com.example.backend.repository.OpsLogARepository;
import com.example.backend.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccessLogInterceptor implements HandlerInterceptor {

    private final OpsLogARepository opsLogARepository;
    private final JwtTokenProvider jwtTokenProvider;

    private static final String REQUEST_TIME_ATTRIBUTE = "requestStartTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 요청 시작 시간 저장
        request.setAttribute(REQUEST_TIME_ATTRIBUTE, System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        try {
            // 특정 경로는 로깅 제외 (헬스체크, 정적 리소스 등)
            String path = request.getRequestURI();
            if (shouldSkipLogging(path)) {
                return;
            }

            // 로그 정보 수집
            String ipAddress = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");
            String method = request.getMethod();
            String statusCode = String.valueOf(response.getStatus());

            // 현재 인증된 사용자 가져오기
            User user = getCurrentUser();

            // OpsLogA 생성 및 저장
            OpsLogA accessLog = OpsLogA.builder()
                    .user(user)
                    .logaAddress(ipAddress)
                    .logaAgent(userAgent)
                    .logaPath(path)
                    .logaMethod(method)
                    .logaStatusCode(statusCode)
                    .build();

            opsLogARepository.save(accessLog);

            // 요청 처리 시간 로깅
            Long startTime = (Long) request.getAttribute(REQUEST_TIME_ATTRIBUTE);
            if (startTime != null) {
                long duration = System.currentTimeMillis() - startTime;
                log.debug("[AccessLog] {} {} - {} ({}ms)", method, path, statusCode, duration);
            }

        } catch (Exception e) {
            // 로깅 실패가 요청 처리에 영향을 주지 않도록
            log.error("[AccessLog] Failed to log access", e);
        }
    }

    /**
     * 로깅을 건너뛸 경로 판단
     */
    private boolean shouldSkipLogging(String path) {
        return path.startsWith("/actuator")
                || path.startsWith("/swagger")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/static")
                || path.endsWith(".js")
                || path.endsWith(".css")
                || path.endsWith(".ico");
    }

    /**
     * 클라이언트 IP 주소 추출 (프록시 고려)
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 여러 IP가 있을 경우 첫 번째 IP 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
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
                }
                // CustomUserDetails 등 다른 타입일 경우 처리
                // TODO: 실제 프로젝트의 UserDetails 구현에 맞게 수정
            }
        } catch (Exception e) {
            log.debug("Failed to get current user", e);
        }
        return null;
    }
}
