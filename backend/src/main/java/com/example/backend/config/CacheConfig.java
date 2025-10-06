package com.example.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis 기반 캐시 설정
 *
 * 캐싱 전략:
 * - stories: 스토리 데이터 (1시간 캐시)
 * - popularPosts: 인기 게시글 (5분 캐시)
 * - userProfiles: 사용자 프로필 (30분 캐시)
 * - default: 기본 캐시 (10분)
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Redis 캐시 매니저 설정
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // ObjectMapper 설정 (LocalDateTime 등 Java 8 Time API 지원)
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // 기본 캐시 설정
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))  // 기본 TTL: 10분
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper))
                )
                .disableCachingNullValues();  // null 값은 캐싱하지 않음

        // 캐시별 개별 설정
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // 스토리 캐시 (1시간)
        cacheConfigurations.put("stories",
                defaultConfig.entryTtl(Duration.ofHours(1)));

        // 인기 게시글 캐시 (5분)
        cacheConfigurations.put("popularPosts",
                defaultConfig.entryTtl(Duration.ofMinutes(5)));

        // 사용자 프로필 캐시 (30분)
        cacheConfigurations.put("userProfiles",
                defaultConfig.entryTtl(Duration.ofMinutes(30)));

        // 게시글 목록 캐시 (3분)
        cacheConfigurations.put("postList",
                defaultConfig.entryTtl(Duration.ofMinutes(3)));

        // 게시글 상세 캐시 (5분)
        cacheConfigurations.put("postDetail",
                defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()  // 트랜잭션 지원
                .build();
    }
}
