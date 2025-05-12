package com.example.backend.service;

import com.example.backend.dto.auth.JwtAuthResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.SignupRequest;
import com.example.backend.dto.auth.TokenRefreshRequest;
import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.exception.TokenRefreshException;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.jwt.JwtTokenProvider;
import com.example.backend.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public User register(SignupRequest request) {
        if (userRepository.existsByUserEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .userName(request.getName())
                .userEmail(request.getEmail())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public JwtAuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

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

        return refreshTokenRepository.findByValue(requestRefreshToken)
                .map(refreshToken -> {
                    if (!refreshToken.isValid()) {
                        refreshTokenRepository.delete(refreshToken);
                        throw new TokenRefreshException(requestRefreshToken, "Refresh token expired. Please login again");
                    }

                    User user = refreshToken.getUser();
                    CustomUserDetails userDetails = CustomUserDetails.build(user);

                    // Create new authentication with the user details
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    String newAccessToken = tokenProvider.generateAccessToken(authentication);

                    return JwtAuthResponse.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(requestRefreshToken) // Reuse the refresh token
                            .userId(user.getUserId())
                            .name(user.getUserName())
                            .email(user.getUserEmail())
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token not found in database"));
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByValue(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
        SecurityContextHolder.clearContext();
    }

    private void saveRefreshToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 기존 리프레시 토큰이 있다면 삭제
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);

        // 토큰 만료 시간 계산
        Date expiryDate = tokenProvider.getExpirationDateFromToken(token);
        LocalDateTime expiresAt = expiryDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        // 새 리프레시 토큰 저장
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .value(token)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);
    }
}