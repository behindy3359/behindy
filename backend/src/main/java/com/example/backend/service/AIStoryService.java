package com.example.backend.service;

import com.example.backend.dto.game.StoryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryService {

    // 🎯 AI 서버용 5분 타임아웃 RestTemplate
    @Qualifier("aiServerRestTemplate")
    private final RestTemplate aiServerRestTemplate;

    // 🎯 헬스체크용 기본 타임아웃 RestTemplate
    @Qualifier("defaultRestTemplate")
    private final RestTemplate defaultRestTemplate;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.enabled:true}")
    private Boolean aiServerEnabled;

    @Value("${behindy.internal.api-key:behindy-internal-2025-secret-key}")
    private String internalApiKey;

    /**
     * 🎯 단일 스토리 생성 (배치 방식만 사용)
     */
    public StoryResponse generateStory(String stationName, Integer lineNumber,
                                       Integer characterHealth, Integer characterSanity) {

        log.info("=== 스토리 생성 요청 ===");
        log.info("AI 서버 활성화: {}", aiServerEnabled);
        log.info("요청: {}역 {}호선 (체력: {}, 정신력: {})",
                stationName, lineNumber, characterHealth, characterSanity);

        if (!aiServerEnabled) {
            log.info("AI 서버 비활성화됨, Mock 데이터 반환");
            return createMockStory(stationName, lineNumber);
        }

        try {
            // 배치 방식 AI 서버 호출
            AIStoryResponse aiResponse = callBatchStoryGeneration(
                    stationName, lineNumber, characterHealth, characterSanity
            );

            if (aiResponse != null && validateBatchResponse(aiResponse)) {
                log.info("✅ 스토리 생성 성공: {}", aiResponse.getStoryTitle());
                return convertBatchToStoryResponse(aiResponse, stationName, lineNumber);
            } else {
                log.warn("❌ 스토리 생성 실패, Mock 데이터 사용");
                return createMockStory(stationName, lineNumber);
            }

        } catch (Exception e) {
            log.error("❌ 스토리 생성 실패: {}", e.getMessage(), e);
            return createMockStory(stationName, lineNumber);
        }
    }

    /**
     * 🚀 배치 방식 AI 서버 호출 (5분 타임아웃)
     */
    private AIStoryResponse callBatchStoryGeneration(
            String stationName, Integer lineNumber,
            Integer characterHealth, Integer characterSanity) {

        try {
            log.info("🚀 AI 서버 호출 시작 (5분 타임아웃)");

            AIStoryRequest request = AIStoryRequest.builder()
                    .stationName(stationName)
                    .lineNumber(lineNumber)
                    .characterHealth(characterHealth)
                    .characterSanity(characterSanity)
                    .storyType("BATCH_GENERATION")
                    .build();

            String url = aiServerUrl + "/generate-complete-story";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", internalApiKey);

            HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

            log.info("📤 AI 서버 호출: {}", url);
            log.info("  Station: {} ({}호선)", stationName, lineNumber);
            log.info("  Request Type: BATCH_GENERATION");

            // 🎯 5분 타임아웃으로 RestTemplate 호출
            ParameterizedTypeReference<AIStoryResponse> responseType =
                    new ParameterizedTypeReference<AIStoryResponse>() {};

            // 🎯 5분 타임아웃 RestTemplate 사용
            ResponseEntity<AIStoryResponse> response = aiServerRestTemplate
                    .exchange(url, HttpMethod.POST, entity, responseType);

            log.info("📥 AI 서버 응답 수신: HTTP {}", response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                AIStoryResponse storyResponse = response.getBody();

                log.info("✅ AI 응답 성공:");
                log.info("  제목: {}", storyResponse.getStoryTitle());
                log.info("  페이지 수: {}", storyResponse.getPages() != null ?
                        storyResponse.getPages().size() : 0);

                return storyResponse;
            } else {
                log.warn("❌ AI 응답 실패: Status={}, Body={}", 
                        response.getStatusCode(), response.getBody());
                return null;
            }

        } catch (RestClientException e) {
            log.error("❌ RestClient 오류: {}", e.getMessage(), e);
            return null;
        } catch (Exception e) {
            log.error("❌ AI 호출 실패:", e);
            return null;
        }
    }

    /**
     * 🕒 5분 타임아웃 RestTemplate 생성
     */
    private RestTemplate createExtendedTimeoutRestTemplate() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = 
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        
        // 5분 타임아웃 설정
        int fiveMinutesInMs = 5 * 60 * 1000; // 300,000ms
        factory.setConnectTimeout(fiveMinutesInMs);
        factory.setReadTimeout(fiveMinutesInMs);

        log.info("🕒 5분 타임아웃 RestTemplate 생성: {}ms", fiveMinutesInMs);
        
        return new RestTemplate(factory);
    }

    /**
     * AI 서버 상태 확인
     */
    public boolean isAIServerHealthy() {
        if (!aiServerEnabled) {
            return false;
        }

        try {
            String url = aiServerUrl + "/health";
            log.debug("AI 서버 헬스체크: {}", url);

            // 🎯 기본 타임아웃 RestTemplate 사용 (빠른 헬스체크)
            ParameterizedTypeReference<Map<String, Object>> responseType =
                    new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = defaultRestTemplate.exchange(
                    url, HttpMethod.GET, null, responseType
            );

            boolean healthy = response.getStatusCode() == HttpStatus.OK;
            log.debug("AI 서버 헬스체크 결과: {}", healthy);

            return healthy;

        } catch (Exception e) {
            log.warn("AI 서버 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }

    // ===== 응답 검증 및 변환 메서드들 =====

    private boolean validateBatchResponse(AIStoryResponse response) {
        try {
            if (response == null) {
                log.warn("응답이 null");
                return false;
            }

            if (response.getStoryTitle() == null || response.getStoryTitle().trim().isEmpty()) {
                log.warn("스토리 제목이 없음: '{}'", response.getStoryTitle());
                return false;
            }

            if (response.getPages() == null || response.getPages().isEmpty()) {
                log.warn("페이지가 없음: {}", response.getPages());
                return false;
            }

            log.info("✅ 응답 검증 통과: {}페이지", response.getPages().size());
            return true;

        } catch (Exception e) {
            log.error("응답 검증 중 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    private StoryResponse convertBatchToStoryResponse(AIStoryResponse aiResponse,
                                                      String stationName, Integer lineNumber) {
        try {
            return StoryResponse.builder()
                    .storyId(null) // 동적 생성
                    .storyTitle(aiResponse.getStoryTitle())
                    .estimatedLength(aiResponse.getEstimatedLength() != null ?
                            aiResponse.getEstimatedLength() :
                            (aiResponse.getPages() != null ? aiResponse.getPages().size() : 5))
                    .difficulty(aiResponse.getDifficulty() != null ? aiResponse.getDifficulty() : "보통")
                    .theme(aiResponse.getTheme() != null ? aiResponse.getTheme() : "미스터리")
                    .description(aiResponse.getDescription() != null ?
                            aiResponse.getDescription() : stationName + "역의 이야기")
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .canPlay(true)
                    .playStatus("생성 완료")
                    .build();

        } catch (Exception e) {
            log.error("StoryResponse 변환 실패: {}", e.getMessage(), e);
            return createMockStory(stationName, lineNumber);
        }
    }

    private StoryResponse createMockStory(String stationName, Integer lineNumber) {
        log.warn("⚠️ Mock StoryResponse 생성: {}역 {}호선", stationName, lineNumber);

        return StoryResponse.builder()
                .storyId(-1L) // Mock 표시
                .storyTitle(stationName + "역의 신비로운 사건")
                .estimatedLength(5)
                .difficulty("보통")
                .theme("미스터리")
                .description("AI 서버 연결 실패로 생성된 기본 스토리")
                .stationName(stationName)
                .stationLine(lineNumber)
                .canPlay(true)
                .playStatus("Mock 데이터")
                .build();
    }

    // ===== DTO 클래스들 =====

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIStoryRequest {
        @com.fasterxml.jackson.annotation.JsonProperty("station_name")
        private String stationName;

        @com.fasterxml.jackson.annotation.JsonProperty("line_number")
        private Integer lineNumber;

        @com.fasterxml.jackson.annotation.JsonProperty("character_health")
        private Integer characterHealth;

        @com.fasterxml.jackson.annotation.JsonProperty("character_sanity")
        private Integer characterSanity;

        @com.fasterxml.jackson.annotation.JsonProperty("story_type")
        private String storyType;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIStoryResponse {
        @com.fasterxml.jackson.annotation.JsonProperty("story_title")
        private String storyTitle;

        @com.fasterxml.jackson.annotation.JsonProperty("description")
        private String description;

        @com.fasterxml.jackson.annotation.JsonProperty("theme")
        private String theme;

        @com.fasterxml.jackson.annotation.JsonProperty("keywords")
        private List<String> keywords;

        @com.fasterxml.jackson.annotation.JsonProperty("pages")
        private List<AIPageData> pages;

        @com.fasterxml.jackson.annotation.JsonProperty("estimated_length")
        private Integer estimatedLength;

        @com.fasterxml.jackson.annotation.JsonProperty("difficulty")
        private String difficulty;

        @com.fasterxml.jackson.annotation.JsonProperty("station_name")
        private String stationName;

        @com.fasterxml.jackson.annotation.JsonProperty("line_number")
        private Integer lineNumber;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIPageData {
        @com.fasterxml.jackson.annotation.JsonProperty("content")
        private String content;

        @com.fasterxml.jackson.annotation.JsonProperty("options")
        private List<AIOptionData> options;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIOptionData {
        @com.fasterxml.jackson.annotation.JsonProperty("content")
        private String content;

        @com.fasterxml.jackson.annotation.JsonProperty("effect")
        private String effect;

        @com.fasterxml.jackson.annotation.JsonProperty("amount")
        private Integer amount;

        @com.fasterxml.jackson.annotation.JsonProperty("effect_preview")
        private String effectPreview;
    }
}