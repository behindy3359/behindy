package com.example.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Configuration
public class RestTemplateConfig {

    @Value("${ai.server.timeout:10000}")
    private Integer defaultTimeout;

    /**
     * 기본 RestTemplate
     */
    @Bean("defaultRestTemplate")
    @Primary
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(defaultTimeout);
        factory.setReadTimeout(defaultTimeout);

        log.info("✅ 기본 RestTemplate 생성: timeout {}ms", defaultTimeout);
        return new RestTemplate(factory);
    }

    /**
     * AI 서버 전용 RestTemplate
     */
    @Bean("aiServerRestTemplate")
    public RestTemplate aiServerRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        int connectTimeoutMs = 60000;        // 1분
        int readTimeoutMs = 5 * 60 * 1000;   // 5분

        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);

        log.info("✅ AI 서버 RestTemplate 생성:");
        log.info("   연결 타임아웃: {}ms ({}초)", connectTimeoutMs, connectTimeoutMs / 1000);
        log.info("   읽기 타임아웃: {}ms ({}분)", readTimeoutMs, readTimeoutMs / 60000);

        return new RestTemplate(factory);
    }
}