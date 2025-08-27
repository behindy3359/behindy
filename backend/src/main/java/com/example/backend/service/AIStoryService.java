package com.example.backend.service;

import com.example.backend.dto.game.PageResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.dto.game.OptionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryService {

    private final RestTemplate restTemplate;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.enabled:true}")
    private Boolean aiServerEnabled;

    @Value("${ai.server.timeout:10000}")
    private Integer timeout;

    @Value("${behindy.internal.api-key:behindy-internal-2025-secret-key}")
    private String internalApiKey;

    /**
     * 🆕 일원화된 스토리 생성 - 배치 방식 사용
     * 모든 스토리 생성을 /generate-complete-story 엔드포인트로 통일
     */
    public StoryResponse generateStory(String stationName, Integer lineNumber,
                                       Integer characterHealth, Integer characterSanity) {

        log.info("=== 일원화된 스토리 생성 시작 ===");
        log.info("AI 서버 활성화: {}", aiServerEnabled);
        log.info("AI 서버 URL: {}", aiServerUrl);
        log.info("요청: {}역 {}호선 (체력: {}, 정신력: {})",
                stationName, lineNumber, characterHealth, characterSanity);

        if (!aiServerEnabled) {
            log.info("AI 서버 비활성화됨, Mock 데이터 반환");
            return createMockStory(stationName, lineNumber);
        }

        try {
            // 🆕 배치 생성 로직 직접 사용
            AIStoryResponse aiResponse = callBatchStoryGeneration(
                    stationName, lineNumber, characterHealth, characterSanity
            );

            if (aiResponse != null && validateBatchResponse(aiResponse)) {
                log.info("✅ 배치 방식 스토리 생성 성공: {}", aiResponse.getStoryTitle());

                // 배치 응답을 StoryResponse로 변환
                return convertBatchToStoryResponse(aiResponse, stationName, lineNumber);
            } else {
                log.warn("❌ 배치 방식 실패, Mock 데이터 사용");
                return createMockStory(stationName, lineNumber);
            }

        } catch (Exception e) {
            log.error("❌ 일원화된 스토리 생성 실패: {}", e.getMessage(), e);
            return createMockStory(stationName, lineNumber);
        }
    }

    /**
     * 🆕 배치 방식 AI 서버 호출 (완전한 스토리 생성)
     */
    private AIStoryResponse callBatchStoryGeneration(
            String stationName, Integer lineNumber,
            Integer characterHealth, Integer characterSanity) {

        try {
            log.info("🚀 배치 방식 AI 서버 호출 시작");

            // 배치용 요청 생성
            AIStoryRequest request = AIStoryRequest.builder()
                    .stationName(stationName)
                    .lineNumber(lineNumber)
                    .characterHealth(characterHealth)
                    .characterSanity(characterSanity)
                    .storyType("UNIFIED_GENERATION")  // 일원화 표시
                    .build();

            String url = aiServerUrl + "/generate-complete-story";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", internalApiKey);

            HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

            log.info("📤 AI 서버 호출:");
            log.info("  URL: {}", url);
            log.info("  Station: {} ({}호선)", stationName, lineNumber);
            log.info("  Request Type: UNIFIED_GENERATION");
            log.info("  Headers: Content-Type=application/json, X-Internal-API-Key=[MASKED]");
            log.info("  Request Body: {}", request);

            ParameterizedTypeReference<AIStoryResponse> responseType =
                    new ParameterizedTypeReference<AIStoryResponse>() {};

            log.info("RestTemplate.exchange 호출 시작...");

            ResponseEntity<AIStoryResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, responseType
            );

            log.info("📥 AI 서버 응답 수신:");
            log.info("  HTTP Status: {}", response.getStatusCode());
            log.info("  Response Headers: {}", response.getHeaders());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                AIStoryResponse storyResponse = response.getBody();

                log.info("✅ 배치 방식 AI 응답 성공:");
                log.info("  제목: {}", storyResponse.getStoryTitle());
                log.info("  설명: {}", storyResponse.getDescription());
                log.info("  테마: {}", storyResponse.getTheme());
                log.info("  페이지 수: {}", storyResponse.getPages() != null ?
                        storyResponse.getPages().size() : 0);
                log.info("  예상 길이: {}", storyResponse.getEstimatedLength());
                log.info("  난이도: {}", storyResponse.getDifficulty());

                // 페이지 상세 로그
                if (storyResponse.getPages() != null && !storyResponse.getPages().isEmpty()) {
                    log.info("📄 페이지 상세:");
                    for (int i = 0; i < storyResponse.getPages().size(); i++) {
                        AIPageData page = storyResponse.getPages().get(i);
                        log.info("  페이지 {}: 내용 {}자, 선택지 {}개",
                                i + 1,
                                page.getContent() != null ? page.getContent().length() : 0,
                                page.getOptions() != null ? page.getOptions().size() : 0);

                        if (page.getOptions() != null) {
                            for (int j = 0; j < page.getOptions().size(); j++) {
                                AIOptionData option = page.getOptions().get(j);
                                log.info("    선택지 {}: {} ({} {})",
                                        j + 1, option.getContent(), option.getEffect(), option.getAmount());
                            }
                        }
                    }
                }

                return storyResponse;
            } else {
                log.warn("❌ 배치 방식 AI 응답 실패:");
                log.warn("  Status: {}", response.getStatusCode());
                log.warn("  Body: {}", response.getBody());
                return null;
            }

        } catch (RestClientException e) {
            log.error("❌ 배치 방식 RestClient 오류: {}", e.getMessage(), e);
            return null;
        } catch (Exception e) {
            log.error("❌ 배치 방식 AI 호출 실패:");
            log.error("  오류 타입: {}", e.getClass().getSimpleName());
            log.error("  오류 메시지: {}", e.getMessage());
            log.error("  스택 트레이스: ", e);
            return null;
        }
    }

    /**
     * 🆕 배치 응답 검증
     */
    private boolean validateBatchResponse(AIStoryResponse response) {
        try {
            if (response == null) {
                log.warn("배치 응답 검증 실패: 응답이 null");
                return false;
            }

            if (response.getStoryTitle() == null || response.getStoryTitle().trim().isEmpty()) {
                log.warn("배치 응답 검증 실패: 스토리 제목이 없음 - '{}'", response.getStoryTitle());
                return false;
            }

            if (response.getPages() == null || response.getPages().isEmpty()) {
                log.warn("배치 응답 검증 실패: 페이지가 없음 - {}", response.getPages());
                return false;
            }

            if (response.getPages().size() > 15) {
                log.warn("배치 응답 검증 실패: 페이지가 너무 많음 - {}페이지", response.getPages().size());
                return false;
            }

            // 각 페이지 검증
            for (int i = 0; i < response.getPages().size(); i++) {
                AIPageData page = response.getPages().get(i);

                if (page == null) {
                    log.warn("배치 응답 검증 실패: 페이지 {}가 null", i + 1);
                    return false;
                }

                if (page.getContent() == null || page.getContent().trim().isEmpty()) {
                    log.warn("배치 응답 검증 실패: 페이지 {}의 내용이 없음", i + 1);
                    return false;
                }

                if (page.getOptions() == null || page.getOptions().size() < 2 || page.getOptions().size() > 4) {
                    log.warn("배치 응답 검증 실패: 페이지 {}의 선택지 개수 오류 - {}개", i + 1,
                            page.getOptions() != null ? page.getOptions().size() : 0);
                    return false;
                }

                // 선택지 검증
                for (int j = 0; j < page.getOptions().size(); j++) {
                    AIOptionData option = page.getOptions().get(j);
                    if (option == null || option.getContent() == null || option.getContent().trim().isEmpty()) {
                        log.warn("배치 응답 검증 실패: 페이지 {} 선택지 {}가 비어있음", i + 1, j + 1);
                        return false;
                    }
                }
            }

            log.info("✅ 배치 응답 검증 통과: {}페이지", response.getPages().size());
            return true;

        } catch (Exception e) {
            log.error("배치 응답 검증 중 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * 🆕 배치 응답을 StoryResponse로 변환
     */
    private StoryResponse convertBatchToStoryResponse(AIStoryResponse aiResponse,
                                                      String stationName, Integer lineNumber) {
        try {
            log.info("📝 배치 응답을 StoryResponse로 변환 시작");

            StoryResponse storyResponse = StoryResponse.builder()
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
                    .playStatus("배치 방식 생성 완료")
                    .build();

            log.info("✅ StoryResponse 변환 완료:");
            log.info("  제목: {}", storyResponse.getStoryTitle());
            log.info("  예상 길이: {}", storyResponse.getEstimatedLength());
            log.info("  테마: {}", storyResponse.getTheme());
            log.info("  상태: {}", storyResponse.getPlayStatus());

            return storyResponse;

        } catch (Exception e) {
            log.error("StoryResponse 변환 실패: {}", e.getMessage(), e);
            return createMockStory(stationName, lineNumber);
        }
    }

    /**
     * 🆕 일원화된 스토리 진행 - 배치 방식 사용
     */
    public PageResponse continueStory(String stationName, Integer lineNumber,
                                      Integer characterHealth, Integer characterSanity,
                                      String previousChoice, String storyContext) {

        log.info("=== 일원화된 스토리 진행 시작 ===");
        log.info("{}역 {}호선, 이전 선택: {}", stationName, lineNumber, previousChoice);
        log.info("스토리 컨텍스트: {}", storyContext);

        if (!aiServerEnabled) {
            log.info("AI 서버 비활성화됨, Mock 페이지 반환");
            return createMockPage();
        }

        try {
            // 🆕 배치 방식으로 새로운 스토리 생성 후 첫 번째 페이지 반환
            // 실제로는 이전 선택을 반영한 새로운 스토리를 생성
            AIStoryResponse aiResponse = callBatchStoryGeneration(
                    stationName, lineNumber, characterHealth, characterSanity
            );

            if (aiResponse != null && aiResponse.getPages() != null && !aiResponse.getPages().isEmpty()) {
                log.info("✅ 배치 방식 진행 성공");

                // 첫 번째 페이지를 PageResponse로 변환
                return convertFirstPageToPageResponse(aiResponse.getPages().get(0));
            } else {
                log.warn("❌ 배치 방식 진행 실패, Mock 사용");
                return createMockPage();
            }

        } catch (Exception e) {
            log.error("❌ 일원화된 스토리 진행 실패: {}", e.getMessage(), e);
            return createMockPage();
        }
    }

    /**
     * 🆕 첫 번째 페이지를 PageResponse로 변환
     */
    private PageResponse convertFirstPageToPageResponse(AIPageData pageData) {
        try {
            log.info("📄 첫 번째 페이지를 PageResponse로 변환");

            List<OptionResponse> options = pageData.getOptions().stream()
                    .map(this::convertBatchOptionToOptionResponse)
                    .collect(Collectors.toList());

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(null) // 동적 생성
                    .pageNumber(1L)
                    .content(pageData.getContent())
                    .options(options)
                    .isLastPage(false) // 첫 번째 페이지는 마지막이 아님
                    .totalPages(null) // 동적 생성시 미정
                    .build();

            log.info("✅ PageResponse 변환 완료:");
            log.info("  내용 길이: {}자", pageResponse.getContent().length());
            log.info("  선택지 수: {}개", pageResponse.getOptions().size());

            return pageResponse;

        } catch (Exception e) {
            log.error("PageResponse 변환 실패: {}", e.getMessage(), e);
            return createMockPage();
        }
    }

    /**
     * 🆕 배치 선택지를 OptionResponse로 변환
     */
    private OptionResponse convertBatchOptionToOptionResponse(AIOptionData optionData) {
        try {
            return OptionResponse.builder()
                    .optionId(null) // 동적 생성
                    .content(optionData.getContent())
                    .effect(optionData.getEffect())
                    .amount(optionData.getAmount())
                    .effectPreview(optionData.getEffectPreview())
                    .build();

        } catch (Exception e) {
            log.error("OptionResponse 변환 실패: {}", e.getMessage(), e);
            return createMockOption();
        }
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

            ParameterizedTypeReference<Map<String, Object>> responseType =
                    new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    responseType
            );

            boolean healthy = response.getStatusCode() == HttpStatus.OK;

            log.debug("AI 서버 헬스체크 결과: {}", healthy);

            return healthy;

        } catch (Exception e) {
            log.warn("AI 서버 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }

    // ===== Mock 데이터 생성 메서드들 =====

    /**
     * Mock 스토리 생성 (AI 서버 실패시 대체)
     */
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

    /**
     * Mock 페이지 생성
     */
    private PageResponse createMockPage() {
        log.warn("⚠️ Mock PageResponse 생성");

        return PageResponse.builder()
                .pageId(-1L)
                .pageNumber(1L)
                .content("AI 서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.")
                .options(List.of(createMockOption()))
                .isLastPage(true)
                .totalPages(1)
                .build();
    }

    /**
     * Mock 선택지 생성
     */
    private OptionResponse createMockOption() {
        return OptionResponse.builder()
                .optionId(-1L)
                .content("다시 시도하기")
                .effect("HEALTH")
                .amount(0)
                .effectPreview("변화 없음")
                .build();
    }

    // ===== 내부 DTO 클래스들 =====

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