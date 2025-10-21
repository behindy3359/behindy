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
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
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

    @Qualifier("llmWebClient")
    private final WebClient llmWebClient;

    @Value("${ai.story.generation.enabled:true}")
    private Boolean storyGenerationEnabled;

    @Value("${ai.story.generation.daily-limit:5}")
    private Integer dailyGenerationLimit;

    @Value("${ai.server.timeout:900000}")
    private int aiServerTimeout;

    private final AtomicInteger dailyGeneratedCount = new AtomicInteger(0);
    private LocalDateTime lastSuccessfulGeneration = null;

    /**
     * 스케줄러 메인 메서드
     */
    @Scheduled(fixedRateString = "${ai.story.generation.test-interval:86400000}")
    public void generateStoryBatch() {
        log.info("🔔 [SCHEDULER] generateStoryBatch() 호출됨 - 현재 시각: {}", LocalDateTime.now());

        if (storyGenerationEnabled == null || !storyGenerationEnabled) {
            log.warn("⚠️ [SCHEDULER] 스토리 생성 비활성화 상태 (enabled={})", storyGenerationEnabled);
            return;
        }

        if (dailyGenerationLimit == null || dailyGeneratedCount.get() >= dailyGenerationLimit) {
            log.info("🛑 [SCHEDULER] 일일 스토리 생성 한도 도달: {}/{}",
                    dailyGeneratedCount.get(),
                    dailyGenerationLimit != null ? dailyGenerationLimit : 0);
            return;
        }

        log.info("🚀 [SCHEDULER] === LLM 스토리 배치 생성 시작 === (생성 {}개/{} 한도)",
                dailyGeneratedCount.get(), dailyGenerationLimit);

        try {
            log.info("📍 [SCHEDULER] Step 1: 역 선택 시작");
            Station selectedStation = selectStationForGeneration();
            if (selectedStation == null) {
                log.warn("⚠️ [SCHEDULER] Step 1 실패: 선택된 역이 없음 (모든 역이 2개 이상 스토리 보유 중)");
                return;
            }
            log.info("✅ [SCHEDULER] Step 1 완료: {}역 {}호선 선택됨",
                    selectedStation.getStaName(), selectedStation.getStaLine());

            log.info("📍 [SCHEDULER] Step 2: LLM 서버 요청 시작");
            // 비동기 호출 후 구독
            requestFromLLMServer(selectedStation)
                    .doOnSubscribe(subscription -> {
                        log.info("🔗 [ASYNC] 비동기 요청 구독 시작");
                    })
                    .doOnNext(llmResponse -> {
                        log.info("📥 [ASYNC] LLM 응답 수신됨");
                        log.info("📍 [ASYNC] Step 3: 응답 검증 시작");
                        if (validateLLMResponse(llmResponse)) {
                            log.info("✅ [ASYNC] Step 3 완료: 응답 검증 성공");
                            log.info("📍 [ASYNC] Step 4: DB 저장 시작");
                            boolean saved = saveStoryToDB(selectedStation, llmResponse);
                            if (saved) {
                                dailyGeneratedCount.incrementAndGet();
                                lastSuccessfulGeneration = LocalDateTime.now();
                                log.info("🎉 [ASYNC] ✅✅✅ 전체 프로세스 성공! 스토리 저장 완료: {} (누적 {}개)",
                                        llmResponse.getStoryTitle(), dailyGeneratedCount.get());
                            } else {
                                log.error("❌ [ASYNC] Step 4 실패: DB 저장 실패");
                            }
                        } else {
                            log.warn("⚠️ [ASYNC] Step 3 실패: LLM 응답 검증 실패");
                        }
                    })
                    .doOnError(e -> {
                        log.error("❌❌❌ [ASYNC] 비동기 처리 중 오류 발생!", e);
                        log.error("   오류 타입: {}", e.getClass().getName());
                        log.error("   오류 메시지: {}", e.getMessage());
                        if (e.getCause() != null) {
                            log.error("   근본 원인: {}", e.getCause().getMessage());
                        }
                    })
                    .doFinally(signalType -> {
                        log.info("🏁 [ASYNC] 비동기 처리 종료 (signal: {})", signalType);
                    })
                    .subscribe(); // 비동기 실행

            log.info("✅ [SCHEDULER] 비동기 요청 제출 완료 (백그라운드 실행 중)");

        } catch (Exception e) {
            log.error("❌❌❌ [SCHEDULER] 동기 코드에서 예외 발생!", e);
            log.error("   오류 타입: {}", e.getClass().getName());
            log.error("   오류 메시지: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("   근본 원인: {}", e.getCause().getMessage());
            }
        }
    }

    /**
     * 스토리가 부족한 역 선택
     */
    private Station selectStationForGeneration() {
        try {
            log.info("  🔍 [SELECT] DB에서 전체 역 조회 중...");
            List<Station> allStations = stationRepository.findAll();
            log.info("  ✅ [SELECT] 전체 {}개 역 조회 완료", allStations.size());

            List<Station> needyStations = new ArrayList<>();

            log.info("  🔍 [SELECT] 각 역의 스토리 개수 확인 중...");
            for (Station station : allStations) {
                List<Story> stories = storyRepository.findByStation(station);
                if (stories.size() < 2) { // 역당 최소 2개
                    needyStations.add(station);
                    log.debug("     - {}역 {}호선: {}개 스토리 (부족) ← 후보 추가",
                            station.getStaName(), station.getStaLine(), stories.size());
                }
            }

            log.info("  ✅ [SELECT] 스토리 부족 역: {}개 발견", needyStations.size());

            if (needyStations.isEmpty()) {
                log.info("  ℹ️ [SELECT] 모든 역이 최소 2개 이상의 스토리를 보유 중");
                return null;
            }

            Station selected = needyStations.get(new Random().nextInt(needyStations.size()));
            log.info("  ✅ [SELECT] 랜덤 선택: {}역 {}호선 (현재 {}개 스토리)",
                    selected.getStaName(), selected.getStaLine(),
                    storyRepository.findByStation(selected).size());

            return selected;
        } catch (Exception e) {
            log.error("❌ [SELECT] 역 선택 중 오류 발생!", e);
            log.error("   오류 타입: {}", e.getClass().getName());
            log.error("   오류 메시지: {}", e.getMessage());
            return null;
        }
    }
    /**
     * LLM 서버 통신 (비동기) - 수동 JSON 파싱으로 확실한 매핑
     */
    private Mono<CompleteStoryResponse> requestFromLLMServer(Station station) {
        if (station == null) {
            log.error("❌ [LLM] 역 정보가 null입니다.");
            return Mono.empty();
        }

        CompleteStoryRequest request = CompleteStoryRequest.builder()
                .station_name(station.getStaName())
                .line_number(station.getStaLine())
                .character_health(80)
                .character_sanity(80)
                .build();

        log.info("  🚀 [LLM] 비동기 요청 준비: {}역 {}호선", station.getStaName(), station.getStaLine());
        log.info("  ⏱️ [LLM] 타임아웃: {}ms ({}초)", aiServerTimeout, aiServerTimeout / 1000);

        return llmWebClient.post()
                .uri("/generate-complete-story")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(aiServerTimeout))
                .map(jsonString -> {
                    log.info("  📥 [LLM] 응답 수신 완료 (JSON 길이: {} bytes)", jsonString.length());
                    log.debug("  📄 [LLM] JSON 원본: {}", jsonString.substring(0, Math.min(200, jsonString.length())) + "...");
                    return parseJsonManually(jsonString);
                })
                .doOnSuccess(response -> {
                    if (response != null) {
                        log.info("  ✅ [LLM] JSON 파싱 성공: '{}'", response.getStoryTitle());
                        log.info("      - 페이지 수: {}", response.getPages() != null ? response.getPages().size() : 0);
                        log.info("      - 키워드: {}", response.getKeywords());
                    } else {
                        log.error("  ❌ [LLM] JSON 파싱 실패 (null 반환)");
                    }
                })
                .doOnError(e -> {
                    log.error("  ❌❌❌ [LLM] 서버 통신 실패!", e);
                    log.error("     오류 타입: {}", e.getClass().getName());
                    log.error("     오류 메시지: {}", e.getMessage());
                    if (e.getCause() != null) {
                        log.error("     근본 원인: {}", e.getCause().getMessage());
                    }
                });
    }

    /**
     * 수동 JSON 파싱 메서드
     */
    private CompleteStoryResponse parseJsonManually(String jsonString) {
        try {

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

            return result;

        } catch (Exception e) {
            log.error("수동 JSON 파싱 실패: {}", e.getMessage());
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

        return true;
    }

    /**
     * DB 저장
     */
    @Transactional
    public boolean saveStoryToDB(Station station, CompleteStoryResponse llmResponse) {
        if (station == null || llmResponse == null) {
            log.error("  ❌ [DB] 저장할 데이터가 null (station={}, llmResponse={})", station, llmResponse);
            return false;
        }

        try {
            log.info("  💾 [DB] DB 저장 시작: '{}'", llmResponse.getStoryTitle());

            // Story 저장
            log.info("  📝 [DB] Step 1: Story 엔티티 저장");
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
            log.info("  ✅ [DB] Story 저장 완료 (ID: {})", savedStory.getStoId());

            // Pages 저장
            log.info("  📝 [DB] Step 2: Page 엔티티 저장 ({}개)",
                    llmResponse.getPages() != null ? llmResponse.getPages().size() : 0);
            List<Page> savedPages = new ArrayList<>();
            List<LLMPageData> pages = llmResponse.getPages();
            if (pages != null) {
                for (int i = 0; i < pages.size(); i++) {
                    LLMPageData pageData = pages.get(i);
                    if (pageData == null) {
                        log.warn("    ⚠️ [DB] Page {}는 null - 건너뜀", i+1);
                        continue;
                    }

                    Page page = Page.builder()
                            .stoId(savedStory.getStoId())
                            .pageNumber((long)(i + 1))
                            .pageContents(pageData.getContent() != null ? pageData.getContent() : "")
                            .build();

                    Page saved = pageRepository.save(page);
                    savedPages.add(saved);
                    log.debug("    - Page {} 저장 완료 (ID: {})", i+1, saved.getPageId());
                }
            }
            log.info("  ✅ [DB] {}개 Page 저장 완료", savedPages.size());

            // Options 저장
            log.info("  📝 [DB] Step 3: Options 엔티티 저장");
            int totalOptions = 0;
            if (pages != null) {
                for (int i = 0; i < pages.size() && i < savedPages.size(); i++) {
                    LLMPageData pageData = pages.get(i);
                    Page savedPage = savedPages.get(i);

                    if (pageData == null || pageData.getOptions() == null) {
                        log.warn("    ⚠️ [DB] Page {}의 옵션이 null - 건너뜀", i+1);
                        continue;
                    }

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
                        totalOptions++;
                    }
                }
            }
            log.info("  ✅ [DB] {}개 Options 저장 완료", totalOptions);
            log.info("  🎉 [DB] 전체 DB 저장 성공!");

            return true;

        } catch (Exception e) {
            log.error("  ❌❌❌ [DB] DB 저장 실패!", e);
            log.error("     오류 타입: {}", e.getClass().getName());
            log.error("     오류 메시지: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("     근본 원인: {}", e.getCause().getMessage());
            }
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
        status.put("timeout", aiServerTimeout);
        status.put("mode", "WebClient (Async)");
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