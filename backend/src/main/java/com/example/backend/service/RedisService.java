package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 만료 시간과 함께 값 저장
     */
    public void setWithExpiration(String key, String value, long expirationMs) {
        try {
            redisTemplate.opsForValue().set(key, value, expirationMs, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.error("Redis 저장 실패: key={}, error={}", key, e.getMessage());
            throw new RuntimeException("Redis 저장 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 값 조회
     */
    public String get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis 조회 실패: key={}, error={}", key, e.getMessage());
            return null;
        }
    }

    /**
     * 키 삭제
     */
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            log.error("Redis 삭제 실패: key={}, error={}", key, e.getMessage());
        }
    }

    /**
     * 키 존재 여부 확인
     */
    public boolean hasKey(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Redis 키 존재 확인 실패: key={}, error={}", key, e.getMessage());
            return false;
        }
    }

    /**
     * TTL 조회 (초 단위)
     */
    public long getExpire(String key) {
        try {
            return redisTemplate.getExpire(key, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Redis TTL 조회 실패: key={}, error={}", key, e.getMessage());
            return -1;
        }
    }

    // ============= Refresh Token 관련 메서드 =============

    /**
     * Refresh Token 저장 (Legacy 호환용)
     */
    public void saveRefreshToken(Long userId, String token, long expirationMs) {
        String key = "RT:" + userId;
        setWithExpiration(key, token, expirationMs);
    }

    /**
     * Refresh Token 검증 (Legacy 호환용)
     */
    public boolean validateRefreshToken(Long userId, String token) {
        String key = "RT:" + userId;
        String stored = get(key);
        return token.equals(stored);
    }

    /**
     * Refresh Token 삭제 (Legacy 호환용)
     */
    public void deleteRefreshToken(Long userId) {
        String key = "RT:" + userId;
        delete(key);
    }

    /**
     * JTI 기반 Refresh Token 검증 (신규)
     */
    public boolean isRefreshTokenValid(String userId, String jti) {
        String key = "RT:" + userId + ":" + jti;
        return hasKey(key);
    }

    /**
     * JTI 기반 Refresh Token 삭제 (신규)
     */
    public void deleteRefreshToken(String userId, String jti) {
        String key = "RT:" + userId + ":" + jti;
        delete(key);
    }

    /**
     * 사용자의 모든 Refresh Token 삭제 (보안 강화)
     */
    public void deleteAllRefreshTokensForUser(String userId) {
        try {
            String pattern = "RT:" + userId + ":*";
            var keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("사용자 {}의 모든 Refresh Token 삭제: {} 개", userId, keys.size());
            }
        } catch (Exception e) {
            log.error("사용자 {}의 Refresh Token 일괄 삭제 실패: {}", userId, e.getMessage());
        }
    }

    /**
     * 만료된 토큰 정리 (스케줄러에서 사용)
     */
    public void cleanupExpiredTokens() {
        try {
            String pattern = "RT:*";
            var keys = redisTemplate.keys(pattern);
            if (keys != null) {
                int cleanedCount = 0;
                for (String key : keys) {
                    if (getExpire(key) <= 0) {
                        delete(key);
                        cleanedCount++;
                    }
                }
                log.info("만료된 Refresh Token 정리 완료: {} 개", cleanedCount);
            }
        } catch (Exception e) {
            log.error("만료된 토큰 정리 실패: {}", e.getMessage());
        }
    }

    // ============= 캐시 관련 메서드 =============

    /**
     * 지하철 데이터 캐싱
     */
    public void cacheMetroData(String key, String data, long ttlMinutes) {
        setWithExpiration("METRO:" + key, data, ttlMinutes * 60 * 1000);
    }

    /**
     * 지하철 데이터 조회
     */
    public String getMetroData(String key) {
        return get("METRO:" + key);
    }
}