package com.example.backend.service;

import com.example.backend.dto.game.StoryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryService {

    @Qualifier("llmWebClient")
    private final WebClient llmWebClient;

    @Value("${ai.server.timeout:900000}")
    private int aiServerTimeout;

    /**
     * LLM 서버에서 생성된 스토리 데이터 요청 (비동기)
     */
    public Mono<StoryResponse> generateStory(String stationName, Integer lineNumber,
                                              Integer characterHealth, Integer characterSanity) {
        log.info("LLM 서버에 스토리 생성 요청: {}역 {}호선", stationName, lineNumber);

        AIStoryRequest request = AIStoryRequest.builder()
                .stationName(stationName)
                .lineNumber(lineNumber)
                .characterHealth(characterHealth)
                .characterSanity(characterSanity)
                .build();

        // LLM 서버 호출 (비동기)
        return callLLMServer(request)
                .map(aiResponse -> {
                    log.info("LLM 서버 응답 성공: {}", aiResponse.getStoryTitle());
                    return convertToStoryResponse(aiResponse, stationName, lineNumber);
                })
                .doOnError(e -> log.error("LLM 서버 통신 실패: {}", e.getMessage()))
                .onErrorResume(e -> {
                    log.warn("LLM 서버 응답 없음, 기본 응답 반환");
                    return Mono.just(createDefaultResponse(stationName, lineNumber));
                });
    }

    /**
     * LLM 서버 호출 (비동기)
     */
    private Mono<AIStoryResponse> callLLMServer(AIStoryRequest request) {
        log.debug("LLM 서버 비동기 호출: /generate-story");

        return llmWebClient.post()
                .uri("/generate-story")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AIStoryResponse.class)
                .timeout(Duration.ofMillis(aiServerTimeout))
                .doOnSuccess(response -> log.debug("LLM 서버 응답 수신 완료"))
                .doOnError(e -> log.error("LLM 서버 호출 실패: {}", e.getMessage()));
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
     * LLM 서버 상태 확인 (비동기)
     */
    public Mono<Boolean> isLLMServerHealthy() {
        return llmWebClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> true)
                .timeout(Duration.ofSeconds(30))
                .doOnError(e -> log.debug("LLM 서버 헬스체크 실패: {}", e.getMessage()))
                .onErrorReturn(false);
    }

    /**
     * LLM 서버 상태 확인 (동기 - 레거시 호환)
     */
    public boolean isLLMServerHealthySync() {
        try {
            return isLLMServerHealthy().block(Duration.ofSeconds(30));
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