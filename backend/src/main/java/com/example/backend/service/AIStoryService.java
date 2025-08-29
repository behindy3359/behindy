package com.example.backend.service;

import com.example.backend.dto.game.StoryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryService {

    private final RestTemplate restTemplate;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${behindy.internal.api-key:behindy-internal-2025-secret-key}")
    private String internalApiKey;

    /**
     * LLM 서버에서 생성된 스토리 데이터 요청
     */
    public StoryResponse generateStory(String stationName, Integer lineNumber,
                                       Integer characterHealth, Integer characterSanity) {
        log.info("LLM 서버에 스토리 생성 요청: {}역 {}호선", stationName, lineNumber);

        try {
            AIStoryRequest request = AIStoryRequest.builder()
                    .stationName(stationName)
                    .lineNumber(lineNumber)
                    .characterHealth(characterHealth)
                    .characterSanity(characterSanity)
                    .build();

            // LLM 서버 호출
            AIStoryResponse aiResponse = callLLMServer(request);

            if (aiResponse != null) {
                log.info("LLM 서버 응답 성공: {}", aiResponse.getStoryTitle());
                return convertToStoryResponse(aiResponse, stationName, lineNumber);
            } else {
                log.warn("LLM 서버 응답 없음, 기본 응답 반환");
                return createDefaultResponse(stationName, lineNumber);
            }

        } catch (Exception e) {
            log.error("LLM 서버 통신 실패: {}", e.getMessage());
            return createDefaultResponse(stationName, lineNumber);
        }
    }

    /**
     * LLM 서버 호출
     */
    private AIStoryResponse callLLMServer(AIStoryRequest request) {
        try {
            String url = aiServerUrl + "/generate-story";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", internalApiKey);

            HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

            log.debug("LLM 서버 호출: {}", url);

            ResponseEntity<AIStoryResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity,
                    new ParameterizedTypeReference<AIStoryResponse>() {});

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }

            log.warn("LLM 서버 응답 오류: {}", response.getStatusCode());
            return null;

        } catch (Exception e) {
            log.error("LLM 서버 호출 예외: {}", e.getMessage());
            return null;
        }
    }

    /**
     * LLM 응답을 StoryResponse로 변환
     */
    private StoryResponse convertToStoryResponse(AIStoryResponse aiResponse,
                                                 String stationName, Integer lineNumber) {
        return StoryResponse.builder()
                .storyId(null) // 동적 생성
                .storyTitle(aiResponse.getStoryTitle())
                .estimatedLength(aiResponse.getEstimatedLength() != null ?
                        aiResponse.getEstimatedLength() : 5)
                .difficulty(aiResponse.getDifficulty() != null ?
                        aiResponse.getDifficulty() : "보통")
                .theme(aiResponse.getTheme() != null ?
                        aiResponse.getTheme() : "미스터리")
                .description(aiResponse.getDescription() != null ?
                        aiResponse.getDescription() : stationName + "역의 이야기")
                .stationName(stationName)
                .stationLine(lineNumber)
                .canPlay(true)
                .playStatus("LLM 생성 완료")
                .build();
    }

    /**
     * 기본 응답 생성 (LLM 서버 실패 시)
     */
    private StoryResponse createDefaultResponse(String stationName, Integer lineNumber) {
        return StoryResponse.builder()
                .storyId(-1L)
                .storyTitle(stationName + "역의 기본 이야기")
                .estimatedLength(3)
                .difficulty("쉬움")
                .theme("일반")
                .description("LLM 서버 연결 실패로 생성된 기본 스토리")
                .stationName(stationName)
                .stationLine(lineNumber)
                .canPlay(true)
                .playStatus("기본 스토리")
                .build();
    }

    /**
     * LLM 서버 상태 확인
     */
    public boolean isLLMServerHealthy() {
        try {
            String healthUrl = aiServerUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.debug("LLM 서버 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }

    // ===== DTO 클래스들 =====

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIStoryRequest {
        private String stationName;
        private Integer lineNumber;
        private Integer characterHealth;
        private Integer characterSanity;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIStoryResponse {
        private String storyTitle;
        private String description;
        private String theme;
        private List<String> keywords;
        private Integer estimatedLength;
        private String difficulty;
        private List<AIPageData> pages;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIPageData {
        private String content;
        private List<AIOptionData> options;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AIOptionData {
        private String content;
        private String effect;
        private Integer amount;
    }
}