package com.example.backend.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 내부 API 전용 API Key 인증 필터
 * /api/ai-stories/internal/** 경로에 대해서만 동작
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-Internal-API-Key";
    private static final String INTERNAL_API_PATH = "/api/ai-stories/internal/";

    @Value("${behindy.internal.api-key}")
    private String validApiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // /api/ai-stories/internal/** 경로가 아니면 통과
        if (!requestURI.startsWith(INTERNAL_API_PATH)) {
            filterChain.doFilter(request, response);
            return;
        }

        // API Key 헤더 추출
        String providedApiKey = request.getHeader(API_KEY_HEADER);

        // API Key 검증
        if (providedApiKey == null || providedApiKey.trim().isEmpty()) {
            log.warn("내부 API 호출에 API Key가 없음: {} from {}", requestURI, getClientIP(request));
            sendUnauthorizedResponse(response, "Missing API Key");
            return;
        }

        if (!validApiKey.equals(providedApiKey)) {
            log.warn("잘못된 내부 API Key: {} from {}", requestURI, getClientIP(request));
            sendUnauthorizedResponse(response, "Invalid API Key");
            return;
        }

        // 인증 성공 - 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * 클라이언트 IP 추출
     */
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }

        return request.getRemoteAddr();
    }

    /**
     * 인증 실패 응답 전송
     */
    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        String jsonResponse = String.format(
                "{\"success\":false,\"message\":\"%s\",\"timestamp\":\"%s\"}",
                message,
                java.time.LocalDateTime.now()
        );

        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
}