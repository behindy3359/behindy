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

    @Value("${ai.server.url:http://aiserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.enabled:true}")
    private Boolean aiServerEnabled;

    @Value("${ai.server.timeout:10000}")
    private Integer timeout;

    /**
     * AI 서버에서 새로운 스토리 생성
     */
    public StoryResponse generateStory(String stationName, Integer lineNumber,
                                       Integer characterHealth, Integer characterSanity) {
        if (!aiServerEnabled) {
            log.info("AI 서버 비활성화됨, Mock 데이터 반환");
            return createMockStory(stationName, lineNumber);
        }

        try {
            String url = aiServerUrl + "/generate-story";

            // 요청 데이터 구성
            Map<String, Object> requestBody = Map.of(
                    "station_name", stationName,
                    "line_number", lineNumber,
                    "character_health", characterHealth,
                    "character_sanity", characterSanity
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("AI 서버 스토리 생성 요청: {}, {}호선", stationName, lineNumber);

            // AI 서버 호출
            ParameterizedTypeReference<Map<String, Object>> responseType =
                    new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    responseType
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return convertToStoryResponse(response.getBody(), stationName, lineNumber);
            } else {
                log.warn("AI 서버 응답 실패, Mock 데이터 사용");
                return createMockStory(stationName, lineNumber);
            }

        } catch (RestClientException e) {
            log.error("AI 서버 통신 실패: {}, Mock 데이터 사용", e.getMessage());
            return createMockStory(stationName, lineNumber);
        } catch (Exception e) {
            log.error("AI 스토리 생성 중 예외 발생: {}", e.getMessage(), e);
            return createMockStory(stationName, lineNumber);
        }
    }

    /**
     * AI 서버에서 스토리 진행 (다음 페이지 생성)
     */
    public PageResponse continueStory(String stationName, Integer lineNumber,
                                      Integer characterHealth, Integer characterSanity,
                                      String previousChoice, String storyContext) {
        if (!aiServerEnabled) {
            log.info("AI 서버 비활성화됨, Mock 페이지 반환");
            return createMockPage();
        }

        try {
            String url = aiServerUrl + "/continue-story";

            Map<String, Object> requestBody = Map.of(
                    "station_name", stationName,
                    "line_number", lineNumber,
                    "character_health", characterHealth,
                    "character_sanity", characterSanity,
                    "previous_choice", previousChoice,
                    "story_context", storyContext != null ? storyContext : ""
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("AI 서버 스토리 진행 요청: {}, 선택: {}", stationName, previousChoice);

            ParameterizedTypeReference<Map<String, Object>> responseType =
                    new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    responseType
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return convertToPageResponse(response.getBody());
            } else {
                log.warn("AI 서버 응답 실패, Mock 페이지 사용");
                return createMockPage();
            }

        } catch (Exception e) {
            log.error("AI 스토리 진행 중 예외 발생: {}, Mock 페이지 사용", e.getMessage());
            return createMockPage();
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
            ParameterizedTypeReference<Map<String, Object>> responseType =
                    new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    responseType
            );

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.warn("AI 서버 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }

    /**
     * AI 응답을 StoryResponse로 변환
     */
    private StoryResponse convertToStoryResponse(Map<String, Object> aiResponse,
                                                 String stationName, Integer lineNumber) {
        try {
            return StoryResponse.builder()
                    .storyId(null) // 동적 생성된 스토리는 ID 없음
                    .storyTitle((String) aiResponse.get("story_title"))
                    .estimatedLength((Integer) aiResponse.get("estimated_length"))
                    .difficulty((String) aiResponse.get("difficulty"))
                    .theme((String) aiResponse.get("theme"))
                    .description("AI가 생성한 동적 스토리")
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .canPlay(true)
                    .playStatus("AI 생성")
                    .build();

        } catch (Exception e) {
            log.error("AI 응답 변환 실패: {}", e.getMessage());
            return createMockStory(stationName, lineNumber);
        }
    }

    /**
     * AI 응답을 PageResponse로 변환
     */
    private PageResponse convertToPageResponse(Map<String, Object> aiResponse) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> optionsData = (List<Map<String, Object>>) aiResponse.get("options");

            List<OptionResponse> options = optionsData.stream()
                    .map(this::convertToOptionResponse)
                    .collect(Collectors.toList());

            return PageResponse.builder()
                    .pageId(null) // 동적 생성
                    .pageNumber(1L) // 기본값
                    .content((String) aiResponse.get("page_content"))
                    .options(options)
                    .isLastPage((Boolean) aiResponse.getOrDefault("is_last_page", false))
                    .totalPages(null) // 동적 생성시 미정
                    .build();

        } catch (Exception e) {
            log.error("AI 페이지 응답 변환 실패: {}", e.getMessage());
            return createMockPage();
        }
    }

    /**
     * AI 선택지 데이터를 OptionResponse로 변환
     */
    private OptionResponse convertToOptionResponse(Map<String, Object> optionData) {
        try {
            return OptionResponse.builder()
                    .optionId(null) // 동적 생성
                    .content((String) optionData.get("content"))
                    .effect((String) optionData.get("effect"))
                    .amount((Integer) optionData.get("amount"))
                    .effectPreview((String) optionData.get("effect_preview"))
                    .build();

        } catch (Exception e) {
            log.error("AI 선택지 변환 실패: {}", e.getMessage());
            return createMockOption();
        }
    }

    /**
     * Mock 스토리 생성 (AI 서버 실패시 대체)
     */
    private StoryResponse createMockStory(String stationName, Integer lineNumber) {
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
}