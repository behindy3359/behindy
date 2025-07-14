package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.auth.JwtAuthResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.SignupRequest;
import com.example.backend.entity.User;
import com.example.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(
            @Valid @RequestBody SignupRequest signupRequest) {

        log.info("회원가입 요청: {}", signupRequest.getEmail());

        User user = authService.register(signupRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .success(true)
                        .message("사용자 등록이 완료되었습니다.")
                        .data(user.getUserId())
                        .build());
    }

    /**
     * 로그인 - HttpOnly Cookie에 Refresh Token 저장
     */
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        log.info("로그인 요청: {}", loginRequest.getEmail());

        JwtAuthResponse authResponse = authService.authenticate(loginRequest, response);

        log.info("로그인 성공: userId={}", authResponse.getUserId());

        return ResponseEntity.ok(authResponse);
    }

    /**
     * Access Token 갱신 - Cookie에서 Refresh Token 자동 추출
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        log.info("토큰 갱신 요청");

        JwtAuthResponse authResponse = authService.refreshToken(request, response);

        log.info("토큰 갱신 성공: userId={}", authResponse.getUserId());

        return ResponseEntity.ok(authResponse);
    }

    /**
     * 로그아웃 - Cookie 및 Redis에서 Refresh Token 제거
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutUser(
            HttpServletRequest request,
            HttpServletResponse response) {

        log.info("로그아웃 요청");

        authService.logout(request, response);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("로그아웃 되었습니다.")
                .build());
    }

    /**
     * 현재 사용자 정보 조회 (Access Token 검증용)
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser() {
        try {
            User currentUser = authService.getCurrentUser();

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("사용자 정보 조회 성공")
                    .data(Map.of(
                            "userId", currentUser.getUserId(),
                            "name", currentUser.getUserName(),
                            "email", currentUser.getUserEmail()
                    ))
                    .build());
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("인증이 필요합니다.")
                            .build());
        }
    }

    /**
     * 토큰 상태 확인 (헬스체크용)
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse> checkAuthStatus(HttpServletRequest request) {
        try {
            // Access Token은 Authorization 헤더에서 확인
            String authHeader = request.getHeader("Authorization");
            boolean hasAccessToken = authHeader != null && authHeader.startsWith("Bearer ");

            // Refresh Token은 Cookie에서 확인
            boolean hasRefreshToken = request.getCookies() != null &&
                    Arrays.stream(request.getCookies())
                            .anyMatch(cookie -> "refreshToken".equals(cookie.getName()));

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("토큰 상태 확인 완료")
                    .data(Map.of(
                            "hasAccessToken", hasAccessToken,
                            "hasRefreshToken", hasRefreshToken,
                            "timestamp", System.currentTimeMillis()
                    ))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message("토큰 상태 확인 실패")
                    .build());
        }
    }
}