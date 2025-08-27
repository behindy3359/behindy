package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Value("${ai.server.timeout:10000}")
    private Integer defaultTimeout;

    /**
     * 기본 RestTemplate (일반 요청용 - 10초)
     */
    @Bean("defaultRestTemplate")
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(defaultTimeout);
        factory.setReadTimeout(defaultTimeout);

        return new RestTemplate(factory);
    }

    /**
     * AI 서버 전용 RestTemplate (5분 타임아웃)
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
}