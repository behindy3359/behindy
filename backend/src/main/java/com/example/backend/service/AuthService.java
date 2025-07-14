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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RedisService redisService; // Redis 서비스 추가
    private final HtmlSanitizer htmlSanitizer;

    @Transactional
    public User register(SignupRequest request) {
        if (userRepository.existsByUserEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // XSS 방지를 위한 입력값 필터링
        String sanitizedName = htmlSanitizer.sanitize(request.getName());
        String sanitizedEmail = htmlSanitizer.sanitize(request.getEmail());

        // 비밀번호는 암호화되므로 XSS 필터링이 덜 중요하지만, 예방 차원에서 수행
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

    @Transactional
    public JwtAuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Redis에 리프레시 토큰 저장
        saveRefreshToken(userDetails.getId(), refreshToken);

        return JwtAuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .build();
    }

    @Transactional
    public JwtAuthResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        // 🎯 리프레시 토큰 전용 검증 사용
        if (!tokenProvider.validateRefreshToken(requestRefreshToken)) {
            throw new TokenRefreshException(requestRefreshToken, "Invalid refresh token type or expired");
        }

        Long userId = tokenProvider.getUserIdFromJWT(requestRefreshToken);

        // Redis에서 저장된 토큰 확인
        if (!redisService.validateRefreshToken(userId, requestRefreshToken)) {
            throw new TokenRefreshException(requestRefreshToken, "Refresh token not found in database");
        }

        // Redis에서 저장된 토큰 확인
        if (!redisService.validateRefreshToken(userId, requestRefreshToken)) {
            throw new TokenRefreshException(requestRefreshToken, "Refresh token not found in database or not valid");
        }

        // 토큰 유효성 검증
        if (!tokenProvider.validateToken(requestRefreshToken)) {
            redisService.deleteRefreshToken(userId);
            throw new TokenRefreshException(requestRefreshToken, "Refresh token expired. Please login again");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        CustomUserDetails userDetails = CustomUserDetails.build(user);

        // 새 인증 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // 새 액세스 토큰 생성
        String newAccessToken = tokenProvider.generateAccessToken(authentication);

        return JwtAuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(requestRefreshToken) // 같은 리프레시 토큰 유지
                .userId(user.getUserId())
                .name(user.getUserName())
                .email(user.getUserEmail())
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        try {
            // 토큰에서 사용자 ID 추출
            Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
            // Redis에서 리프레시 토큰 삭제
            redisService.deleteRefreshToken(userId);
        } catch (Exception e) {
            // 잘못된 토큰이어도 로그아웃 처리는 진행
        }
        SecurityContextHolder.clearContext();
    }

    /**
     * Redis에 리프레시 토큰 저장
     */
    private void saveRefreshToken(Long userId, String token) {
        try {
            // 토큰 만료 시간 계산
            Date expiryDate = tokenProvider.getExpirationDateFromToken(token);
            long ttlMillis = expiryDate.getTime() - System.currentTimeMillis();

            // Redis에 토큰 저장
            redisService.saveRefreshToken(userId, token, ttlMillis);

        } catch (Exception e) {
            throw new RuntimeException("리프레시 토큰 저장 중 오류가 발생했습니다.", e);
        }
    }
}