package com.example.backend.config;

import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Configuration
public class WebClientConfig {

    @Value("${seoul.metro.api.timeout:10000}")
    private int timeoutMs;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.timeout:900000}")
    private int aiServerTimeout;

    @Value("${behindy.internal.api-key:behindy-internal-2025-secret-key}")
    private String internalApiKey;

    /**
     * Metro API용 WebClient
     */
    @Bean("metroWebClient")
    public WebClient webClient() {
        // HTTP 클라이언트 설정
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeoutMs)
                .responseTimeout(Duration.ofMillis(timeoutMs))
                .followRedirect(true);

        // 메모리 버퍼 크기 설정
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> {
                    configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024); // 2MB
                })
                .build();

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();

        log.info("Metro WebClient 초기화 완료: 타임아웃 {}ms, 최대 메모리 2MB", timeoutMs);
        return client;
    }

    /**
     * LLM 서버 전용 WebClient (비동기 논블로킹)
     */
    @Bean("llmWebClient")
    public WebClient llmWebClient() {
        // HTTP 클라이언트 설정 - 긴 타임아웃
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 120000) // 연결 타임아웃 2분
                .responseTimeout(Duration.ofMillis(aiServerTimeout)) // 응답 타임아웃 15분
                .followRedirect(true);

        // 메모리 버퍼 크기 설정 - LLM 응답이 클 수 있음
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> {
                    configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024); // 10MB
                })
                .build();

        WebClient client = WebClient.builder()
                .baseUrl(aiServerUrl)
                .defaultHeader("X-Internal-API-Key", internalApiKey)
                .defaultHeader("Content-Type", "application/json")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();

        log.info("LLM WebClient 초기화 완료:");
        log.info("  - Base URL: {}", aiServerUrl);
        log.info("  - 연결 타임아웃: 120000ms (2분)");
        log.info("  - 응답 타임아웃: {}ms ({}분)", aiServerTimeout, aiServerTimeout / 60000);
        log.info("  - 최대 메모리: 10MB");

        return client;
    }
}