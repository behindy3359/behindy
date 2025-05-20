package com.example.backend.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final RedisTemplate<String, String> redisTemplate;

    // Refresh Token 저장
    public void saveRefreshToken(String userId, String refreshToken, long expirationMs) {
        redisTemplate.opsForValue().set("RT:" + userId, refreshToken, expirationMs, TimeUnit.MILLISECONDS);
    }

    // Refresh Token 검증
    public boolean isRefreshTokenValid(String userId, String refreshToken) {
        String stored = redisTemplate.opsForValue().get("RT:" + userId);
        return refreshToken.equals(stored);
    }

    // 삭제
    public void deleteRefreshToken(String userId) {
        redisTemplate.delete("RT:" + userId);
    }
}
