package com.example.backend.service;

import com.example.backend.dto.auth.JwtAuthResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.SignupRequest;
import com.example.backend.dto.auth.TokenRefreshRequest;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.TokenRefreshException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.jwt.JwtTokenProvider;
import com.example.backend.security.user.CustomUserDetails;
import com.example.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RedisService redisService;
    private final HtmlSanitizer htmlSanitizer;

    // Cookie 설정 상수
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    private static final int REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7일 (초 단위)
    private static final String COOKIE_PATH = "/";

    @Transactional
    public User register(SignupRequest request) {
        if (userRepository.existsByUserEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        String sanitizedName = htmlSanitizer.sanitize(request.getName());
        String sanitizedEmail = htmlSanitizer.sanitize(request.getEmail());
        String sanitizedPassword = htmlSanitizer.sanitize(request.getPassword());

        User user = User.builder()
                .userName(sanitizedName)
                .userEmail(sanitizedEmail)
                .userPassword(passwordEncoder.encode(sanitizedPassword))
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));
    }

    /**
     * 로그인 - HttpOnly Cookie에 Refresh Token 저장
     */
    @Transactional
    public JwtAuthResponse authenticate(LoginRequest request, HttpServletResponse response) {
        log.info("로그인 시도: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Access Token 생성 (짧은 수명)
        String accessToken = tokenProvider.generateAccessToken(authentication);

        // Refresh Token 생성 (긴 수명, 고유 ID 포함)
        String refreshToken = tokenProvider.generateRefreshToken(userDetails.getId());
        String jti = tokenProvider.getJtiFromToken(refreshToken);

        // Redis에 Refresh Token 저장
        saveRefreshTokenToRedis(userDetails.getId(), jti, refreshToken);

        // HttpOnly Cookie에 Refresh Token 설정
        setRefreshTokenCookie(response, refreshToken);

        log.info("로그인 성공: userId={}, jti={}", userDetails.getId(), jti);

        return JwtAuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(null) // 프론트엔드에는 Refresh Token 전달하지 않음
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .build();
    }

    /**
     * Refresh Token으로 Access Token 갱신
     */
    @Transactional
    public JwtAuthResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // Cookie에서 Refresh Token 추출
        String refreshToken = getRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            throw new TokenRefreshException("", "Refresh token not found in cookie");
        }

        // Refresh Token 검증
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new TokenRefreshException(refreshToken, "Invalid or expired refresh token");
        }

        Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
        String jti = tokenProvider.getJtiFromToken(refreshToken);

        // Redis에서 토큰 검증
        if (!redisService.isRefreshTokenValid(userId.toString(), jti)) {
            throw new TokenRefreshException(refreshToken, "Refresh token not found in cache");
        }

        // 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        CustomUserDetails userDetails = CustomUserDetails.build(user);

        // 새 인증 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // 새 Access Token 생성
        String newAccessToken = tokenProvider.generateAccessToken(authentication);

        // 새로운 Refresh Token 생성 (Refresh Token Rotation)
        String newRefreshToken = tokenProvider.generateRefreshToken(userId);
        String newJti = tokenProvider.getJtiFromToken(newRefreshToken);

        // 기존 Refresh Token 삭제하고 새 토큰 저장
        redisService.deleteRefreshToken(userId.toString(), jti);
        saveRefreshTokenToRedis(userId, newJti, newRefreshToken);

        // 새 Refresh Token을 Cookie에 설정
        setRefreshTokenCookie(response, newRefreshToken);

        log.info("토큰 갱신 성공: userId={}, oldJti={}, newJti={}", userId, jti, newJti);

        return JwtAuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(null) // 프론트엔드에는 전달하지 않음
                .userId(user.getUserId())
                .name(user.getUserName())
                .email(user.getUserEmail())
                .build();
    }

    /**
     * 로그아웃 - Cookie 및 Redis에서 Refresh Token 제거
     */
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = getRefreshTokenFromCookie(request);

            if (refreshToken != null) {
                Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
                String jti = tokenProvider.getJtiFromToken(refreshToken);

                // Redis에서 토큰 삭제
                redisService.deleteRefreshToken(userId.toString(), jti);

                log.info("로그아웃 성공: userId={}, jti={}", userId, jti);
            }

            // Cookie 삭제
            clearRefreshTokenCookie(response);

        } catch (Exception e) {
            log.warn("로그아웃 처리 중 오류 발생: {}", e.getMessage());
            // 에러가 발생해도 Cookie는 삭제
            clearRefreshTokenCookie(response);
        }

        SecurityContextHolder.clearContext();
    }

    /**
     * Redis에 Refresh Token 저장
     */
    private void saveRefreshTokenToRedis(Long userId, String jti, String token) {
        try {
            Date expiryDate = tokenProvider.getExpirationDateFromToken(token);
            long ttlMillis = expiryDate.getTime() - System.currentTimeMillis();

            // Redis Key: RT:userId:jti
            String redisKey = "RT:" + userId + ":" + jti;
            redisService.setWithExpiration(redisKey, token, ttlMillis);

            log.debug("Redis에 Refresh Token 저장: key={}, ttl={}ms", redisKey, ttlMillis);
        } catch (Exception e) {
            log.error("Refresh Token Redis 저장 실패: {}", e.getMessage());
            throw new RuntimeException("리프레시 토큰 저장 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * Cookie에서 Refresh Token 추출
     */
    private String getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    /**
     * HttpOnly Cookie에 Refresh Token 설정
     */
    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS에서만 전송
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(REFRESH_TOKEN_COOKIE_MAX_AGE);
        cookie.setAttribute("SameSite", "Strict"); // CSRF 방지

        response.addCookie(cookie);
    }

    /**
     * Refresh Token Cookie 삭제
     */
    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(0); // 즉시 만료

        response.addCookie(cookie);
    }
}