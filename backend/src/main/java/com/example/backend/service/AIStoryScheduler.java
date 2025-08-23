package com.example.backend.service;

import com.example.backend.entity.Station;
import com.example.backend.entity.Story;
import com.example.backend.entity.Page;
import com.example.backend.entity.Options;
import com.example.backend.repository.StationRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.repository.PageRepository;
import com.example.backend.repository.OptionsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * AI 스토리 배치 생성 스케줄러
 * 일정 시간마다 AI 서버에서 스토리를 받아와 DB에 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIStoryScheduler {

    private final RestTemplate restTemplate;
    private final StationRepository stationRepository;
    private final StoryRepository storyRepository;
    private final PageRepository pageRepository;
    private final OptionsRepository optionsRepository;

    @Value("${ai.server.url:http://llmserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.enabled:true}")
    private Boolean aiServerEnabled;

    @Value("${ai.story.generation.enabled:true}")
    private Boolean storyGenerationEnabled;

    @Value("${ai.story.generation.daily-limit:50}")
    private Integer dailyGenerationLimit;

    @Value("${ai.story.generation.batch-size:5}")
    private Integer batchSize;

    @Value("${ai.story.generation.min-stories-per-station:2}")
    private Integer minStoriesPerStation;

    @Value("${behindy.internal.api-key:behindy-internal-2024-secret-key}")
    private String internalApiKey;

    // 상태 관리
    private final AtomicBoolean isGenerating = new AtomicBoolean(false);
    private final AtomicInteger dailyGeneratedCount = new AtomicInteger(0);
    private LocalDateTime lastSuccessfulGeneration = null;
    private int consecutiveFailures = 0;
    private static final int MAX_CONSECUTIVE_FAILURES = 3;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("=== AI 스토리 배치 생성 시스템 시작 ===");
        log.info("스토리 생성 활성화: {}", storyGenerationEnabled);
        log.info("AI 서버 활성화: {}", aiServerEnabled);
        log.info("AI 서버 URL: {}", aiServerUrl);
        log.info("일일 생성 한도: {}개", dailyGenerationLimit);
        log.info("배치 크기: {}개", batchSize);
        log.info("역당 최소 스토리: {}개", minStoriesPerStation);

        // 10초 후 첫 번째 생성 실행 (개발 테스트용)
        if (storyGenerationEnabled && aiServerEnabled) {
            new Thread(() -> {
                try {
                    Thread.sleep(10000);
                    log.info("=== 서버 시작 후 첫 배치 생성 실행 ===");
                    generateStoriesBatch();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("초기 배치 생성 스레드 중단됨");
                } catch (Exception e) {
                    log.error("초기 배치 생성 실패: {}", e.getMessage(), e);
                }
            }).start();
        }
    }

    /**
     * 스케줄된 스토리 배치 생성 (매일 오전 2시)
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void scheduledStoryGeneration() {
        log.info("=== 일일 스케줄된 스토리 생성 시작 ===");
        generateStoriesBatch();
    }

    /**
     * 개발용 빈번한 스케줄 (30분마다) - 운영시 제거 예정
     */
    @Scheduled(fixedRateString = "${ai.story.generation.test-interval:1800000}")
    public void testStoryGeneration() {
        if (!storyGenerationEnabled || !aiServerEnabled) {
            return;
        }

        log.info("=== 테스트용 스토리 생성 (30분 주기) ===");
        generateStoriesBatch();
    }

    /**
     * 스토리 배치 생성 메인 로직
     */
    public void generateStoriesBatch() {
        if (!storyGenerationEnabled || !aiServerEnabled) {
            log.debug("스토리 생성 비활성화 - 배치 생성 건너뛰기");
            return;
        }

        if (!isGenerating.compareAndSet(false, true)) {
            log.warn("스토리 생성 중복 실행 방지");
            return;
        }

        try {
            log.info("=== AI 스토리 배치 생성 시작 ===");

            if (!checkGenerationLimit()) {
                return;
            }

            // 1. AI 서버 상태 확인
            if (!checkAIServerHealth()) {
                log.warn("AI 서버 상태 불량으로 배치 생성 중단");
                return;
            }

            // 2. 스토리가 부족한 역들 조회
            List<Station> targetStations = findStationsNeedingStories();

            if (targetStations.isEmpty()) {
                log.info("모든 역에 충분한 스토리가 있습니다.");
                return;
            }

            // 3. 배치 크기만큼 생성
            int actualBatchSize = Math.min(batchSize, targetStations.size());
            actualBatchSize = Math.min(actualBatchSize, dailyGenerationLimit - dailyGeneratedCount.get());

            log.info("배치 생성 대상: {}개 역, 생성 예정: {}개", targetStations.size(), actualBatchSize);

            // 4. 랜덤하게 역 선택
            Collections.shuffle(targetStations);
            List<Station> selectedStations = targetStations.subList(0, actualBatchSize);

            // 5. 각 역에 대해 스토리 생성
            int successCount = 0;
            for (int i = 0; i < selectedStations.size(); i++) {
                Station station = selectedStations.get(i);

                try {
                    log.info("🎯 [{}/{}] {}역({}호선) 스토리 생성 시작",
                            i + 1, selectedStations.size(), station.getStaName(), station.getStaLine());

                    boolean success = generateStoryForStation(station);
                    if (success) {
                        successCount++;
                        dailyGeneratedCount.incrementAndGet();
                        log.info("✅ [{}/{}] {}역 스토리 생성 성공",
                                i + 1, selectedStations.size(), station.getStaName());
                    } else {
                        log.warn("❌ [{}/{}] {}역 스토리 생성 실패",
                                i + 1, selectedStations.size(), station.getStaName());
                    }

                    // 생성 간격 조절 (AI 서버 부하 방지)
                    if (i < selectedStations.size() - 1) {
                        Thread.sleep(3000); // 3초 대기
                    }

                } catch (Exception e) {
                    log.error("{}역 스토리 생성 중 예외 발생: {}", station.getStaName(), e.getMessage(), e);
                }
            }

            // 6. 결과 기록
            handleBatchResult(successCount, actualBatchSize);

        } catch (Exception e) {
            handleBatchFailure(e);
        } finally {
            isGenerating.set(false);
        }
    }

    /**
     * 특정 역의 스토리 생성
     */
    @Transactional
    public boolean generateStoryForStation(Station station) {
        try {
            log.debug("🎯 {}역({}호선) 스토리 생성 시작", station.getStaName(), station.getStaLine());

            // 1. AI 서버에 완전한 스토리 생성 요청
            AIStoryRequest request = AIStoryRequest.builder()
                    .stationName(station.getStaName())
                    .lineNumber(station.getStaLine())
                    .characterHealth(80)
                    .characterSanity(80)
                    .storyType("BATCH_GENERATION")
                    .build();

            AIStoryResponse aiResponse = callAIServerForCompleteStory(request);
            if (aiResponse == null) {
                log.warn("{}역 AI 서버 응답 없음", station.getStaName());
                return false;
            }

            // 2. 응답 검증
            if (!validateAIResponse(aiResponse)) {
                log.warn("{}역 AI 응답 검증 실패", station.getStaName());
                return false;
            }

            // 3. 트랜잭션 내에서 순차적 저장
            return saveStoryToDatabase(station, aiResponse);

        } catch (Exception e) {
            log.error("{}역 스토리 생성 실패: {}", station.getStaName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * AI 서버 호출 (완전한 스토리용)
     */
    private AIStoryResponse callAIServerForCompleteStory(AIStoryRequest request) {
        try {
            String url = aiServerUrl + "/generate-complete-story";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", internalApiKey);

            HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

            log.debug("AI 서버 완전한 스토리 요청: {}", url);

            ParameterizedTypeReference<AIStoryResponse> responseType =
                    new ParameterizedTypeReference<AIStoryResponse>() {};

            ResponseEntity<AIStoryResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, responseType
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                AIStoryResponse storyResponse = response.getBody();
                log.debug("AI 서버 응답 성공: {} 페이지",
                        storyResponse.getPages() != null ? storyResponse.getPages().size() : 0);
                return storyResponse;
            } else {
                log.warn("AI 서버 응답 실패: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            log.error("AI 서버 호출 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * AI 응답 검증
     */
    private boolean validateAIResponse(AIStoryResponse response) {
        try {
            if (response == null) {
                log.warn("AI 응답이 null");
                return false;
            }

            if (response.getStoryTitle() == null || response.getStoryTitle().trim().isEmpty()) {
                log.warn("스토리 제목이 없음");
                return false;
            }

            if (response.getPages() == null || response.getPages().isEmpty()) {
                log.warn("페이지가 없음");
                return false;
            }

            if (response.getPages().size() > 15) {
                log.warn("페이지가 너무 많음: {}페이지", response.getPages().size());
                return false;
            }

            // 각 페이지 검증
            for (int i = 0; i < response.getPages().size(); i++) {
                AIPageData page = response.getPages().get(i);

                if (page == null) {
                    log.warn("페이지 {}가 null", i + 1);
                    return false;
                }

                if (page.getContent() == null || page.getContent().trim().isEmpty()) {
                    log.warn("페이지 {}의 내용이 없음", i + 1);
                    return false;
                }

                if (page.getOptions() == null || page.getOptions().size() < 2 || page.getOptions().size() > 4) {
                    log.warn("페이지 {}의 선택지 개수 오류: {}개", i + 1,
                            page.getOptions() != null ? page.getOptions().size() : 0);
                    return false;
                }

                // 선택지 검증
                for (int j = 0; j < page.getOptions().size(); j++) {
                    AIOptionData option = page.getOptions().get(j);
                    if (option == null || option.getContent() == null || option.getContent().trim().isEmpty()) {
                        log.warn("페이지 {} 선택지 {}가 비어있음", i + 1, j + 1);
                        return false;
                    }
                }
            }

            log.debug("AI 응답 검증 성공: {}페이지", response.getPages().size());
            return true;

        } catch (Exception e) {
            log.error("AI 응답 검증 중 오류: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 데이터베이스 저장 (순차적 저장으로 문제 해결)
     */
    private boolean saveStoryToDatabase(Station station, AIStoryResponse aiResponse) {
        try {
            log.debug("💾 DB 저장 시작: {}역 스토리", station.getStaName());

            // 1. Story 엔티티 생성 및 저장
            Story story = Story.builder()
                    .station(station)
                    .stoTitle(aiResponse.getStoryTitle())
                    .stoLength(aiResponse.getPages().size())
                    .stoDescription(aiResponse.getDescription() != null ?
                            aiResponse.getDescription() :
                            station.getStaName() + "역에서 벌어지는 이야기")
                    .stoTheme(aiResponse.getTheme() != null ? aiResponse.getTheme() : "미스터리")
                    .stoKeywords(aiResponse.getKeywords() != null ?
                            String.join(",", aiResponse.getKeywords()) :
                            station.getStaName() + ",지하철,모험")
                    .build();

            Story savedStory = storyRepository.save(story);
            log.debug("Story 저장 완료: storyId={}, title={}", savedStory.getStoId(), savedStory.getStoTitle());

            // 2. Page 엔티티들 생성 및 저장 (순차적)
            List<Page> savedPages = new ArrayList<>();
            for (int i = 0; i < aiResponse.getPages().size(); i++) {
                AIPageData pageData = aiResponse.getPages().get(i);

                Page page = Page.builder()
                        .stoId(savedStory.getStoId())
                        .pageNumber((long)(i + 1))
                        .pageContents(pageData.getContent())
                        .build();

                Page savedPage = pageRepository.save(page);
                savedPages.add(savedPage);

                log.debug("Page 저장: pageId={}, pageNumber={}", savedPage.getPageId(), savedPage.getPageNumber());
            }

            log.debug("Pages 저장 완료: {}개", savedPages.size());

            // 3. Options 엔티티들 생성 및 저장 (Page ID 확정 후)
            List<Options> allOptions = new ArrayList<>();
            for (int i = 0; i < aiResponse.getPages().size(); i++) {
                AIPageData pageData = aiResponse.getPages().get(i);
                Page savedPage = savedPages.get(i);

                for (AIOptionData optionData : pageData.getOptions()) {
                    // 수정된 nextPageId 결정 로직
                    Long nextPageId = determineNextPageIdFixed(savedPages, i, aiResponse.getPages().size());

                    Options option = Options.builder()
                            .pageId(savedPage.getPageId())
                            .optContents(optionData.getContent())
                            .optEffect(optionData.getEffect() != null ? optionData.getEffect() : "none")
                            .optAmount(optionData.getAmount() != null ? optionData.getAmount() : 0)
                            .nextPageId(nextPageId)
                            .build();

                    allOptions.add(option);
                }
            }

            List<Options> savedOptions = optionsRepository.saveAll(allOptions);
            log.debug("Options 저장 완료: {}개", savedOptions.size());

            log.info("✅ {}역 스토리 DB 저장 완료: storyId={}", station.getStaName(), savedStory.getStoId());
            return true;

        } catch (Exception e) {
            log.error("❌ DB 저장 실패: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * 수정된 다음 페이지 ID 결정 로직
     */
    private Long determineNextPageIdFixed(List<Page> savedPages, int currentPageIndex, int totalPages) {
        try {
            // 마지막 페이지면 null (게임 종료)
            if (currentPageIndex >= totalPages - 1) {
                return null;
            }

            // 다음 페이지가 존재하면 해당 페이지 ID 반환
            if (currentPageIndex + 1 < savedPages.size()) {
                Page nextPage = savedPages.get(currentPageIndex + 1);
                if (nextPage != null) {
                    Long nextPageId = nextPage.getPageId();
                    if (nextPageId != null && nextPageId > 0) {
                        return nextPageId;
                    }
                }
            }

            // 안전장치: null 반환
            return null;

        } catch (Exception e) {
            log.warn("NextPageId 결정 실패: currentIndex={}, totalPages={}", currentPageIndex, totalPages);
            return null;
        }
    }

    /**
     * AI 서버 상태 확인
     */
    private boolean checkAIServerHealth() {
        try {
            String url = aiServerUrl + "/health";

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            boolean healthy = response.getStatusCode() == HttpStatus.OK;

            if (!healthy) {
                log.warn("AI 서버 상태 불량: {}", response.getStatusCode());
            }

            return healthy;

        } catch (Exception e) {
            log.error("AI 서버 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 스토리가 부족한 역들 조회
     */
    private List<Station> findStationsNeedingStories() {
        List<Station> allStations = stationRepository.findAll();
        List<Station> stationsNeedingStories = new ArrayList<>();

        for (Station station : allStations) {
            List<Story> existingStories = storyRepository.findByStation(station);

            // 각 역당 최소 스토리 개수 확인
            if (existingStories.size() < minStoriesPerStation) {
                stationsNeedingStories.add(station);
            }
        }

        log.info("스토리가 부족한 역: {}개 / 전체 {}개 (기준: 역당 최소 {}개)",
                stationsNeedingStories.size(), allStations.size(), minStoriesPerStation);
        return stationsNeedingStories;
    }

    /**
     * 생성 한도 확인
     */
    private boolean checkGenerationLimit() {
        int currentCount = dailyGeneratedCount.get();

        if (currentCount >= dailyGenerationLimit) {
            log.warn("일일 스토리 생성 한도 도달: {}/{}", currentCount, dailyGenerationLimit);
            return false;
        }

        if (currentCount >= dailyGenerationLimit * 0.9) {
            log.warn("일일 스토리 생성 한도 임박: {}/{}", currentCount, dailyGenerationLimit);
        }

        return true;
    }

    /**
     * 배치 결과 처리
     */
    private void handleBatchResult(int successCount, int totalAttempts) {
        if (successCount > 0) {
            lastSuccessfulGeneration = LocalDateTime.now();
            consecutiveFailures = 0;
        }

        log.info("=== 배치 생성 완료 ===");
        log.info("성공: {}개 / 시도: {}개", successCount, totalAttempts);
        log.info("일일 누적 생성: {}/{}", dailyGeneratedCount.get(), dailyGenerationLimit);
        log.info("마지막 성공: {}", lastSuccessfulGeneration);

        if (successCount == 0) {
            log.warn("모든 스토리 생성 실패");
        }
    }

    /**
     * 배치 실패 처리
     */
    private void handleBatchFailure(Throwable error) {
        consecutiveFailures++;

        log.error("=== 배치 생성 실패 ({}/{}) ===", consecutiveFailures, MAX_CONSECUTIVE_FAILURES);
        log.error("오류: {}", error.getMessage(), error);

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            log.error("연속 실패 한도 도달 - 스토리 생성 일시 중단");
        }
    }

    /**
     * 일일 카운트 초기화 (자정)
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyCount() {
        int previousCount = dailyGeneratedCount.getAndSet(0);
        consecutiveFailures = 0;

        log.info("=== 일일 스토리 생성 통계 초기화 ===");
        log.info("어제 생성된 스토리: {}개", previousCount);
        log.info("오늘 생성 한도: {}개", dailyGenerationLimit);
    }

    // ===== 관리자용 수동 실행 메서드들 =====

    /**
     * 수동 배치 생성
     */
    public void manualBatchGeneration() {
        log.info("=== 수동 스토리 배치 생성 요청 ===");
        generateStoriesBatch();
    }

    /**
     * 특정 역 수동 생성
     */
    public boolean manualStationGeneration(String stationName, Integer lineNumber) {
        Optional<Station> stationOpt = stationRepository.findByStaNameAndStaLine(stationName, lineNumber);

        if (stationOpt.isEmpty()) {
            log.warn("역을 찾을 수 없음: {}-{}호선", stationName, lineNumber);
            return false;
        }

        log.info("=== 수동 스토리 생성: {}-{}호선 ===", stationName, lineNumber);
        return generateStoryForStation(stationOpt.get());
    }

    /**
     * 시스템 상태 조회
     */
    public AIStorySystemStatus getSystemStatus() {
        return AIStorySystemStatus.builder()
                .isGenerationEnabled(storyGenerationEnabled)
                .isAIServerEnabled(aiServerEnabled)
                .isGenerating(isGenerating.get())
                .dailyGeneratedCount(dailyGeneratedCount.get())
                .dailyGenerationLimit(dailyGenerationLimit)
                .lastSuccessfulGeneration(lastSuccessfulGeneration)
                .consecutiveFailures(consecutiveFailures)
                .batchSize(batchSize)
                .stationsNeedingStories(findStationsNeedingStories().size())
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
        private String storyTitle;
        private String description;
        private String theme;
        private List<String> keywords;
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

    @lombok.Data
    @lombok.Builder
    public static class AIStorySystemStatus {
        private Boolean isGenerationEnabled;
        private Boolean isAIServerEnabled;
        private Boolean isGenerating;
        private Integer dailyGeneratedCount;
        private Integer dailyGenerationLimit;
        private LocalDateTime lastSuccessfulGeneration;
        private Integer consecutiveFailures;
        private Integer batchSize;
        private Integer stationsNeedingStories;
    }
}