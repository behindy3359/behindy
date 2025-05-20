package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String REFRESH_TOKEN_KEY_PREFIX = "refresh_token:";

    /**
     * 리프레시 토큰을 Redis에 저장
     *
     * @param userId 사용자 ID
     * @param token 리프레시 토큰
     * @param ttlMillis 토큰 유효시간(밀리초)
     */
    public void saveRefreshToken(Long userId, String token, long ttlMillis) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId;
        redisTemplate.opsForValue().set(key, token);
        redisTemplate.expire(key, ttlMillis, TimeUnit.MILLISECONDS);
    }

    /**
     * 사용자 ID로 리프레시 토큰 조회
     *
     * @param userId 사용자 ID
     * @return 리프레시 토큰 (없는 경우 null)
     */
    public String getRefreshToken(Long userId) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId;
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? value.toString() : null;
    }

    /**
     * 사용자의 리프레시 토큰 삭제
     *
     * @param userId 사용자 ID
     */
    public void deleteRefreshToken(Long userId) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId;
        redisTemplate.delete(key);
    }

    /**
     * 특정 리프레시 토큰이 특정 사용자의 것인지 확인
     *
     * @param userId 사용자 ID
     * @param token 리프레시 토큰
     * @return 검증 결과
     */
    public boolean validateRefreshToken(Long userId, String token) {
        String savedToken = getRefreshToken(userId);
        return savedToken != null && savedToken.equals(token);
    }

    public void saveDeviceRefreshToken(Long userId, String deviceId, String token, long ttlMillis) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId + ":" + deviceId;
        redisTemplate.opsForValue().set(key, token);
        redisTemplate.expire(key, ttlMillis, TimeUnit.MILLISECONDS);
    }

    public String getDeviceRefreshToken(Long userId, String deviceId) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId + ":" + deviceId;
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? value.toString() : null;
    }

    public void deleteDeviceRefreshToken(Long userId, String deviceId) {
        String key = REFRESH_TOKEN_KEY_PREFIX + userId + ":" + deviceId;
        redisTemplate.delete(key);
    }
}