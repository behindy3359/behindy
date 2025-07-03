package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // 🎯 behindy.me 도메인 허용
                .allowedOrigins(
                    "http://behindy.me", 
                    "https://behindy.me",
                    "http://localhost:3000", // 개발용
                    "http://localhost:3001"  // 개발용
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // 프리플라이트 요청 캐시 시간 (1시간)
    }
}