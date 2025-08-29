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
     * RestTemplate
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
     * RestTemplate ( llm서버 통신용 )
     */
    @Bean("aiServerRestTemplate")
    public RestTemplate aiServerRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        int connectTimeoutMs = 30000;
        int readTimeoutMs = 12 * 60 * 1000;

        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);

        return new RestTemplate(factory);
    }

}