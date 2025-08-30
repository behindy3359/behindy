package com.example.backend.service;

import com.example.backend.entity.Station;
import com.example.backend.entity.Story;
import com.example.backend.entity.Page;
import com.example.backend.entity.Options;
import com.example.backend.repository.StationRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.repository.PageRepository;
import com.example.backend.repository.OptionsRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.core.ParameterizedTypeReference;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * AI 스토리 스케줄러 - 필드명 수정 (snake_case)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryScheduler {

    private final StationRepository stationRepository;
    private final StoryRepository storyRepository;
    private final PageRepository pageRepository;
    private final OptionsRepository optionsRepository;

    @Qualifier("aiServerRestTemplate")
    private final RestTemplate aiServerRestTemplate;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${ai.story.generation.enabled:true}")
    private Boolean storyGenerationEnabled;

    @Value("${ai.story.generation.daily-limit:5}")
    private Integer dailyGenerationLimit;

    @Value("${behindy.internal.api-key:behindy-internal-2025-secret-key}")
    private String internalApiKey;

    private final AtomicInteger dailyGeneratedCount = new AtomicInteger(0);
    private LocalDateTime lastSuccessfulGeneration = null;

    /**
     * 스케줄러 메인 메서드
     */
    @Scheduled(fixedRateString = "${ai.story.generation.test-interval:86400000}")
    public void generateStoryBatch() {
        if (storyGenerationEnabled == null || !storyGenerationEnabled) {
            log.debug("스토리 생성 비활성화 상태");
            return;
        }

        if (dailyGenerationLimit == null || dailyGeneratedCount.get() >= dailyGenerationLimit) {
            log.info("일일 스토리 생성 한도 도달: {}/{}",
                    dailyGeneratedCount.get(),
                    dailyGenerationLimit != null ? dailyGenerationLimit : 0);
            return;
        }

        log.info("=== LLM 스토리 배치 생성 시작 ===");

        try {
            // 1. 스토리가 부족한 역 선택
            Station selectedStation = selectStationForGeneration();
            if (selectedStation == null) {
                log.info("✅ 모든 역에 충분한 스토리가 있습니다.");
                return;
            }

            // 2. LLM 서버에서 완성된 스토리 요청
            CompleteStoryResponse llmResponse = requestFromLLMServer(selectedStation);
            if (llmResponse == null || !validateLLMResponse(llmResponse)) {
                log.warn("❌ LLM 응답 없음 또는 검증 실패: {}역", selectedStation.getStaName());
                return;
            }

            // 3. DB에 저장
            boolean saved = saveStoryToDB(selectedStation, llmResponse);
            if (saved) {
                dailyGeneratedCount.incrementAndGet();
                lastSuccessfulGeneration = LocalDateTime.now();
                log.info("✅ 스토리 생성 성공: {}역, 일일 생성: {}/{}",
                        selectedStation.getStaName(),
                        dailyGeneratedCount.get(),
                        dailyGenerationLimit != null ? dailyGenerationLimit : 0);
            }

        } catch (Exception e) {
            log.error("스토리 생성 중 오류: {}", e.getMessage());
        }
    }

    /**
     * 스토리가 부족한 역 선택
     */
    private Station selectStationForGeneration() {
        try {
            List<Station> allStations = stationRepository.findAll();
            List<Station> needyStations = new ArrayList<>();

            for (Station station : allStations) {
                List<Story> stories = storyRepository.findByStation(station);
                if (stories.size() < 2) { // 역당 최소 2개
                    needyStations.add(station);
                }
            }

            if (needyStations.isEmpty()) {
                return null;
            }

            Station selected = needyStations.get(new Random().nextInt(needyStations.size()));
            log.info("🎯 선택된 역: {}역 ({}호선), 부족한 역: {}개",
                    selected.getStaName(), selected.getStaLine(), needyStations.size());

            return selected;
        } catch (Exception e) {
            log.error("역 선택 중 오류: {}", e.getMessage());
            return null;
        }
    }
    /**
     * LLM 서버 통신 - 수동 JSON 파싱으로 확실한 매핑
     */
    private CompleteStoryResponse requestFromLLMServer(Station station) {
        if (aiServerUrl == null || station == null) {
            log.error("LLM 서버 URL 또는 역 정보가 null입니다.");
            return null;
        }

        try {
            String url = aiServerUrl + "/generate-complete-story";

            CompleteStoryRequest request = CompleteStoryRequest.builder()
                    .station_name(station.getStaName())
                    .line_number(station.getStaLine())
                    .character_health(80)
                    .character_sanity(80)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", internalApiKey != null ? internalApiKey : "default-key");
            HttpEntity<CompleteStoryRequest> entity = new HttpEntity<>(request, headers);

            log.info("🤖 LLM 서버 요청 시작: {} → {}역", url, station.getStaName());

            long startTime = System.currentTimeMillis();

            // 🔥 String으로 응답 받아서 수동 파싱
            ResponseEntity<String> rawResponse = aiServerRestTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            long responseTime = System.currentTimeMillis() - startTime;
            log.info("⏱️ LLM 서버 응답 시간: {}ms", responseTime);

            if (rawResponse.getStatusCode() == HttpStatus.OK && rawResponse.getBody() != null) {
                String jsonResponse = rawResponse.getBody();

                log.info("🔍 LLM 서버 원본 응답:");
                log.info("---start---");
                log.info(jsonResponse);
                log.info("---end---");

                // 🔥 수동 JSON 파싱 및 매핑
                CompleteStoryResponse parsedResponse = parseJsonManually(jsonResponse);

                if (parsedResponse != null) {
                    log.info("✅ 수동 파싱 성공:");
                    log.info("  story_title: {}", parsedResponse.getStoryTitle());
                    log.info("  description: {}", parsedResponse.getDescription());
                    log.info("  theme: {}", parsedResponse.getTheme());
                    log.info("  pages 개수: {}", parsedResponse.getPages() != null ? parsedResponse.getPages().size() : "null");

                    return parsedResponse;
                } else {
                    log.error("❌ 수동 파싱 실패");
                    return null;
                }
            }

            log.warn("❌ LLM 서버 응답 오류: {}", rawResponse.getStatusCode());
            return null;

        } catch (Exception e) {
            log.error("❌ LLM 서버 통신 실패: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("❌ 원인: {}", e.getCause().getMessage());
            }
            return null;
        }
    }

    /**
     * 🔥 수동 JSON 파싱 메서드 (Jackson 문제 우회)
     */
    private CompleteStoryResponse parseJsonManually(String jsonString) {
        try {
            log.info("🔧 수동 JSON 파싱 시작");

            // Jackson ObjectMapper 사용
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(jsonString);

            // 각 필드 수동 추출
            String storyTitle = root.has("story_title") ? root.get("story_title").asText() : null;
            String description = root.has("description") ? root.get("description").asText() : null;
            String theme = root.has("theme") ? root.get("theme").asText() : null;
            Integer estimatedLength = root.has("estimated_length") ? root.get("estimated_length").asInt() : null;
            String difficulty = root.has("difficulty") ? root.get("difficulty").asText() : null;
            String stationName = root.has("station_name") ? root.get("station_name").asText() : null;
            Integer lineNumber = root.has("line_number") ? root.get("line_number").asInt() : null;

            // keywords 배열 파싱
            List<String> keywords = new ArrayList<>();
            if (root.has("keywords") && root.get("keywords").isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode keyword : root.get("keywords")) {
                    keywords.add(keyword.asText());
                }
            }

            // pages 배열 파싱
            List<LLMPageData> pages = new ArrayList<>();
            if (root.has("pages") && root.get("pages").isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode pageNode : root.get("pages")) {
                    String content = pageNode.has("content") ? pageNode.get("content").asText() : "";

                    // options 파싱
                    List<LLMOptionData> options = new ArrayList<>();
                    if (pageNode.has("options") && pageNode.get("options").isArray()) {
                        for (com.fasterxml.jackson.databind.JsonNode optionNode : pageNode.get("options")) {
                            LLMOptionData option = LLMOptionData.builder()
                                    .content(optionNode.has("content") ? optionNode.get("content").asText() : "")
                                    .effect(optionNode.has("effect") ? optionNode.get("effect").asText() : "none")
                                    .amount(optionNode.has("amount") ? optionNode.get("amount").asInt() : 0)
                                    .effect_preview(optionNode.has("effect_preview") ? optionNode.get("effect_preview").asText() : "")
                                    .build();
                            options.add(option);
                        }
                    }

                    LLMPageData page = LLMPageData.builder()
                            .content(content)
                            .options(options)
                            .build();
                    pages.add(page);
                }
            }

            CompleteStoryResponse result = CompleteStoryResponse.builder()
                    .story_title(storyTitle)
                    .description(description)
                    .theme(theme)
                    .keywords(keywords)
                    .pages(pages)
                    .estimated_length(estimatedLength)
                    .difficulty(difficulty)
                    .station_name(stationName)
                    .line_number(lineNumber)
                    .build();

            log.info("✅ 수동 파싱 완료:");
            log.info("  파싱된 story_title: {}", result.getStoryTitle());
            log.info("  파싱된 pages 개수: {}", result.getPages().size());

            return result;

        } catch (Exception e) {
            log.error("❌ 수동 JSON 파싱 실패: {}", e.getMessage());
            log.error("원본 JSON: {}", jsonString);
            return null;
        }
    }
    /**
     * LLM 응답 검증
     */
    private boolean validateLLMResponse(CompleteStoryResponse response) {
        if (response == null) {
            log.warn("응답이 null입니다");
            return false;
        }

        if (response.getStoryTitle() == null || response.getStoryTitle().trim().isEmpty()) {
            log.warn("제목이 없는 응답");
            return false;
        }

        if (response.getPages() == null || response.getPages().isEmpty()) {
            log.warn("페이지가 없는 응답");
            return false;
        }

        // 페이지별 기본 검증
        for (LLMPageData page : response.getPages()) {
            if (page == null || page.getContent() == null || page.getContent().trim().isEmpty()) {
                log.warn("빈 페이지 내용 발견");
                return false;
            }
            if (page.getOptions() == null || page.getOptions().isEmpty()) {
                log.warn("선택지가 없는 페이지 발견");
                return false;
            }
        }

        log.info("✅ LLM 응답 검증 통과: {}페이지", response.getPages().size());
        return true;
    }

    /**
     * DB 저장
     */
    @Transactional
    public boolean saveStoryToDB(Station station, CompleteStoryResponse llmResponse) {
        if (station == null || llmResponse == null) {
            log.error("저장할 데이터가 null입니다");
            return false;
        }

        try {
            log.info("💾 DB 저장 시작: {}", llmResponse.getStoryTitle());

            // Story 저장
            Story story = Story.builder()
                    .station(station)
                    .stoTitle(llmResponse.getStoryTitle())
                    .stoLength(llmResponse.getPages() != null ? llmResponse.getPages().size() : 0)
                    .stoDescription(llmResponse.getDescription())
                    .stoTheme(llmResponse.getTheme())
                    .stoKeywords(llmResponse.getKeywords() != null ?
                            String.join(",", llmResponse.getKeywords()) : "")
                    .build();
            Story savedStory = storyRepository.save(story);

            // Pages 저장
            List<Page> savedPages = new ArrayList<>();
            List<LLMPageData> pages = llmResponse.getPages();
            if (pages != null) {
                for (int i = 0; i < pages.size(); i++) {
                    LLMPageData pageData = pages.get(i);
                    if (pageData == null) continue;

                    Page page = Page.builder()
                            .stoId(savedStory.getStoId())
                            .pageNumber((long)(i + 1))
                            .pageContents(pageData.getContent() != null ? pageData.getContent() : "")
                            .build();

                    savedPages.add(pageRepository.save(page));
                }
            }

            // Options 저장
            if (pages != null) {
                for (int i = 0; i < pages.size() && i < savedPages.size(); i++) {
                    LLMPageData pageData = pages.get(i);
                    Page savedPage = savedPages.get(i);

                    if (pageData == null || pageData.getOptions() == null) continue;

                    for (LLMOptionData optionData : pageData.getOptions()) {
                        if (optionData == null) continue;

                        // 마지막 페이지가 아니면 다음 페이지로, 마지막이면 null
                        Long nextPageId = (i < savedPages.size() - 1) ?
                                savedPages.get(i + 1).getPageId() : null;

                        Options option = Options.builder()
                                .pageId(savedPage.getPageId())
                                .optContents(optionData.getContent() != null ? optionData.getContent() : "")
                                .optEffect(optionData.getEffect() != null ? optionData.getEffect() : "none")
                                .optAmount(optionData.getAmount() != null ? optionData.getAmount() : 0)
                                .nextPageId(nextPageId)
                                .build();

                        optionsRepository.save(option);
                    }
                }
            }

            log.info("✅ DB 저장 완료: Story ID={}, {}페이지, {}개 역 처리",
                    savedStory.getStoId(), savedPages.size(), station.getStaName());
            return true;

        } catch (Exception e) {
            log.error("❌ DB 저장 실패: {}", e.getMessage());
            return false;
        }
    }

    // ===== 유틸리티 메서드들 =====

    /**
     * 일일 카운트 초기화
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyCount() {
        int previousCount = dailyGeneratedCount.getAndSet(0);
        log.info("=== 일일 통계 초기화: 어제 생성 {}개 ===", previousCount);
    }

    /**
     * 시스템 상태 조회
     */
    public Map<String, Object> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("enabled", storyGenerationEnabled != null ? storyGenerationEnabled : false);
        status.put("dailyCount", dailyGeneratedCount.get());
        status.put("dailyLimit", dailyGenerationLimit != null ? dailyGenerationLimit : 0);
        status.put("lastSuccess", lastSuccessfulGeneration);
        status.put("llmServerUrl", aiServerUrl != null ? aiServerUrl : "NOT_SET");
        return status;
    }

    /**
     * 수동 스토리 생성
     */
    public void requestStoryFromLLM() {
        log.info("수동 스토리 생성 요청");
        generateStoryBatch();
    }

    // ===== DTO 클래스들 - 필드명 수정 =====

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class CompleteStoryRequest {
        @JsonProperty("station_name")
        private String station_name;

        @JsonProperty("line_number")
        private Integer line_number;

        @JsonProperty("character_health")
        private Integer character_health;

        @JsonProperty("character_sanity")
        private Integer character_sanity;
    }


    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class CompleteStoryResponse {
        // 🔥 필드명을 snake_case로 변경 (Lombok Builder와 일치)
        @JsonProperty("story_title")
        private String story_title;

        @JsonProperty("description")
        private String description;

        @JsonProperty("theme")
        private String theme;

        @JsonProperty("keywords")
        private List<String> keywords;

        @JsonProperty("pages")
        private List<LLMPageData> pages;

        @JsonProperty("estimated_length")
        private Integer estimated_length;

        @JsonProperty("difficulty")
        private String difficulty;

        @JsonProperty("station_name")
        private String station_name;

        @JsonProperty("line_number")
        private Integer line_number;

        // 🔥 getter 메서드들 (기존 코드 호환)
        public String getStoryTitle() { return story_title; }
        public String getDescription() { return description; }
        public String getTheme() { return theme; }
        public List<String> getKeywords() { return keywords; }
        public List<LLMPageData> getPages() { return pages; }
        public Integer getEstimatedLength() { return estimated_length; }
        public String getDifficulty() { return difficulty; }
        public String getStationName() { return station_name; }
        public Integer getLineNumber() { return line_number; }
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class LLMPageData {
        @JsonProperty("content")
        private String content;

        @JsonProperty("options")
        private List<LLMOptionData> options;
    }


    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class LLMOptionData {
        @JsonProperty("content")
        private String content;

        @JsonProperty("effect")
        private String effect;

        @JsonProperty("amount")
        private Integer amount;

        @JsonProperty("effect_preview")
        private String effect_preview;

        // 🔥 getter 메서드 (기존 코드 호환)
        public String getContent() { return content; }
        public String getEffect() { return effect; }
        public Integer getAmount() { return amount; }
        public String getEffectPreview() { return effect_preview; }
    }
}