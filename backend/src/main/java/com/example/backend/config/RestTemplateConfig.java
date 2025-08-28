package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Value("${ai.server.timeout:10000}")
    private Integer defaultTimeout;

    /**
     * 🎯 기본 RestTemplate (일반 요청용 - 10초)
     * Primary Bean으로 설정하여 기존 주입 코드와 호환성 유지
     */
    @Bean("defaultRestTemplate")
    @Primary
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(defaultTimeout);
        factory.setReadTimeout(defaultTimeout);

        return new RestTemplate(factory);
    }

    /**
     * 🚀 AI 서버 전용 RestTemplate (5분 타임아웃)
     * 스토리 생성과 같은 장시간 작업용
     */
    @Bean("aiServerRestTemplate")
    public RestTemplate aiServerRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // 5분 타임아웃 설정
        int fiveMinutesInMs = 5 * 60 * 1000; // 300,000ms
        factory.setConnectTimeout(fiveMinutesInMs);
        factory.setReadTimeout(fiveMinutesInMs);

        return new RestTemplate(factory);
    }

    /**
     * 📊 헬스체크 전용 RestTemplate (빠른 응답용 - 5초)
     * 선택적: 더 빠른 헬스체크가 필요한 경우
     */
    @Bean("healthCheckRestTemplate")
    public RestTemplate healthCheckRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);  // 5초
        factory.setReadTimeout(5000);     // 5초

        return new RestTemplate(factory);
    }
}