package com.example.backend.controller;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.dto.auth.JwtAuthResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.SignupRequest;
import com.example.backend.entity.User;
import com.example.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "인증 API", description = "회원가입, 로그인, 토큰 관리 등 인증 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 (중복된 이메일 등)")
    })
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

    @Operation(summary = "로그인", description = "사용자 인증 후 Access Token과 Refresh Token을 발급합니다. Refresh Token은 HttpOnly Cookie에 저장됩니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        log.info("로그인 요청: {}", loginRequest.getEmail());

        JwtAuthResponse authResponse = authService.authenticate(loginRequest, response);

        log.info("로그인 성공: userId={}", authResponse.getUserId());

        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "토큰 갱신", description = "Cookie의 Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "토큰 갱신 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "유효하지 않은 Refresh Token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        log.info("토큰 갱신 요청");

        JwtAuthResponse authResponse = authService.refreshToken(request, response);

        log.info("토큰 갱신 성공: userId={}", authResponse.getUserId());

        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "로그아웃", description = "Cookie와 Redis에서 Refresh Token을 제거하여 로그아웃합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그아웃 성공")
    })
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

    @Operation(summary = "현재 사용자 정보 조회", description = "인증된 사용자의 정보를 조회합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 정보 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
    })
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

    @Operation(summary = "토큰 상태 확인", description = "Access Token과 Refresh Token의 존재 여부를 확인합니다.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "토큰 상태 확인 완료")
    })
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