package com.example.backend.security.jwt;

import com.example.backend.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Swagger 관련 경로는 필터 제외
        boolean isSwaggerPath = path.startsWith("/swagger-ui") ||
                                path.startsWith("/v3/api-docs") ||
                                path.startsWith("/swagger-resources") ||
                                path.startsWith("/webjars");

        if (isSwaggerPath) {
            log.info("🔓 [JwtAuthenticationFilter] Swagger 경로 필터 제외: {}", path);
        }

        return isSwaggerPath;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("🔍 [JwtAuthenticationFilter] 요청 처리 시작: {} {}", request.getMethod(), requestURI);

        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateAccessToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromJWT(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ [JwtAuthenticationFilter] JWT 인증 성공: userId={}", userId);
            } else {
                log.info("⚠️ [JwtAuthenticationFilter] JWT 없음 또는 유효하지 않음: {}", requestURI);
            }
        } catch (Exception ex) {
            log.error("❌ [JwtAuthenticationFilter] 인증 처리 실패: {}", ex.getMessage(), ex);
        }

        log.info("➡️ [JwtAuthenticationFilter] 다음 필터로 전달: {}", requestURI);
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}