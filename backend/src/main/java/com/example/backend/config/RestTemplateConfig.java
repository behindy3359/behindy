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
     * 🎯 기본 RestTemplate (일반 요청용 - 10초)
     * Primary Bean으로 설정하여 기존 주입 코드와 호환성 유지
     */
    @Bean("defaultRestTemplate")
    @Primary
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(defaultTimeout);
        factory.setReadTimeout(defaultTimeout);

        log.info("🔧 기본 RestTemplate 설정: Connect={}ms, Read={}ms", defaultTimeout, defaultTimeout);
        return new RestTemplate(factory);
    }

    /**
     * 🚀 AI 서버 전용 RestTemplate (10분 타임아웃)
     * 스토리 생성과 같은 장시간 작업용
     */
    @Bean("aiServerRestTemplate")
    public RestTemplate aiServerRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // 10분 타임아웃으로 증가
        int connectTimeoutMs = 30000;  // 연결 타임아웃 30초
        int readTimeoutMs = 10 * 60 * 1000; // 읽기 타임아웃 10분

        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);

        log.info("🚀 AI서버 RestTemplate 설정: Connect={}ms({}초), Read={}ms({}분)",
                connectTimeoutMs, connectTimeoutMs/1000,
                readTimeoutMs, readTimeoutMs/1000/60);

        return new RestTemplate(factory);
    }

    /**
     * 🆘 localhost 직접 연결용 RestTemplate (디버깅용)
     */
    @Bean("localhostRestTemplate")
    public RestTemplate localhostRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        int connectTimeoutMs = 30000;  // 연결 타임아웃 30초
        int readTimeoutMs = 10 * 60 * 1000; // 읽기 타임아웃 10분

        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);

        log.info("🆘 Localhost RestTemplate 설정: Connect={}ms({}초), Read={}ms({}분)",
                connectTimeoutMs, connectTimeoutMs/1000,
                readTimeoutMs, readTimeoutMs/1000/60);

        return new RestTemplate(factory);
    }

    /**
     * 📊 헬스체크 전용 RestTemplate (빠른 응답용 - 5초)
     */
    @Bean("healthCheckRestTemplate")
    public RestTemplate healthCheckRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);  // 5초
        factory.setReadTimeout(5000);     // 5초

        log.info("📊 헬스체크 RestTemplate 설정: Connect=5000ms(5초), Read=5000ms(5초)");
        return new RestTemplate(factory);
    }
}