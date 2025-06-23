package com.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class RedisTestController {

    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/redis-set")
    public String set() {
        redisTemplate.opsForValue().set("test-key", "Hello Redis", Duration.ofSeconds(60));
        return "Set complete";
    }

    @GetMapping("/redis-get")
    public String get() {
        Object value = redisTemplate.opsForValue().get("test-key");
        return "Value = " + value;
    }
}
