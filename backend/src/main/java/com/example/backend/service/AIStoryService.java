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

    // 🆘 디버깅용 localhost 직접 연결 RestTemplate
    @Qualifier("localhostRestTemplate")
    private final RestTemplate localhostRestTemplate;

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
     * 🚀 배치 방식 AI 서버 호출 (5분 타임아웃, 다중 URL 시도)
     */
    private AIStoryResponse callBatchStoryGeneration(
            String stationName, Integer lineNumber,
            Integer characterHealth, Integer characterSanity) {

        AIStoryRequest request = AIStoryRequest.builder()
                .stationName(stationName)
                .lineNumber(lineNumber)
                .characterHealth(characterHealth)
                .characterSanity(characterSanity)
                .storyType("BATCH_GENERATION")
                .build();

        // 🆘 Docker 네트워크 문제 해결을 위한 다중 URL 시도
        String[] urlsToTry = {
                aiServerUrl + "/generate-complete-story",           // Docker 네트워크 (원래 방식)
                "http://localhost:8000/generate-complete-story",    // localhost 직접 연결
                "http://127.0.0.1:8000/generate-complete-story"     // IP 직접 연결
        };

        for (int i = 0; i < urlsToTry.length; i++) {
            String url = urlsToTry[i];
            boolean isDockerNetwork = i == 0;

            try {
                log.info("=== AI 서버 호출 시도 {} ===", i + 1);
                log.info("🎯 URL: {}", url);
                log.info("🔗 연결 방식: {}", isDockerNetwork ? "Docker 네트워크" : "직접 연결");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-Internal-API-Key", internalApiKey);

                HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

                log.info("🚀 RestTemplate 호출 시작...");
                long startTime = System.currentTimeMillis();

                ParameterizedTypeReference<AIStoryResponse> responseType =
                        new ParameterizedTypeReference<AIStoryResponse>() {};

                // 🎯 Docker 네트워크면 aiServerRestTemplate, 직접 연결이면 localhostRestTemplate 사용
                RestTemplate templateToUse = isDockerNetwork ? aiServerRestTemplate : localhostRestTemplate;

                ResponseEntity<AIStoryResponse> response = templateToUse.exchange(
                        url, HttpMethod.POST, entity, responseType
                );

                long duration = System.currentTimeMillis() - startTime;
                log.info("✅ 연결 성공! ({}ms, 방식: {})", duration,
                        isDockerNetwork ? "Docker" : "직접연결");

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    AIStoryResponse storyResponse = response.getBody();
                    log.info("🎉 AI 스토리 응답 성공: {}", storyResponse.getStoryTitle());
                    return storyResponse;
                } else {
                    log.warn("❌ AI 서버 응답 실패: status={}", response.getStatusCode());
                }

            } catch (org.springframework.web.client.ResourceAccessException e) {
                log.warn("🔌 연결 실패 (시도 {}): {}", i + 1, e.getMessage());
                if (i == urlsToTry.length - 1) {
                    log.error("❌ 모든 연결 방식 실패");
                }
            } catch (Exception e) {
                log.error("💥 예상치 못한 오류 (시도 {}): {}", i + 1, e.getMessage(), e);
            }
        }

        log.error("❌ 모든 AI 서버 연결 시도 실패");
        return null;
    }

    /**
     * AI 서버 상태 확인 (다중 URL 시도)
     */
    public boolean isAIServerHealthy() {
        if (!aiServerEnabled) {
            return false;
        }

        String[] urlsToTry = {
                aiServerUrl + "/health",
                "http://localhost:8000/health",
                "http://127.0.0.1:8000/health"
        };

        for (int i = 0; i < urlsToTry.length; i++) {
            String url = urlsToTry[i];
            boolean isDockerNetwork = i == 0;

            try {
                log.debug("헬스체크 시도 {}: {}", i + 1, url);

                // 🎯 기본 타임아웃 RestTemplate 사용 (빠른 헬스체크)
                RestTemplate templateToUse = isDockerNetwork ? defaultRestTemplate : localhostRestTemplate;

                ParameterizedTypeReference<Map<String, Object>> responseType =
                        new ParameterizedTypeReference<Map<String, Object>>() {};

                ResponseEntity<Map<String, Object>> response = templateToUse.exchange(
                        url, HttpMethod.GET, null, responseType
                );

                boolean healthy = response.getStatusCode() == HttpStatus.OK;
                if (healthy) {
                    log.info("✅ AI 서버 헬스체크 성공 (방식: {})",
                            isDockerNetwork ? "Docker" : "직접연결");
                    return true;
                }

            } catch (Exception e) {
                log.debug("헬스체크 실패 (시도 {}): {}", i + 1, e.getMessage());
            }
        }

        log.warn("❌ 모든 AI 서버 헬스체크 실패");
        return false;
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