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

    @Value("${ai.server.url:http://aiserver:8000}")
    private String aiServerUrl;

    @Value("${ai.server.enabled:true}")
    private Boolean aiServerEnabled;

    @Value("${ai.story.generation.enabled:true}")
    private Boolean storyGenerationEnabled;

    @Value("${ai.story.generation.daily-limit:50}")
    private Integer dailyGenerationLimit;

    @Value("${ai.story.generation.batch-size:5}")
    private Integer batchSize;

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
        log.info("일일 생성 한도: {}개", dailyGenerationLimit);
        log.info("배치 크기: {}개", batchSize);

        // 10초 후 첫 번째 생성 실행 (개발 테스트용)
        if (storyGenerationEnabled && aiServerEnabled) {
            new Thread(() -> {
                try {
                    Thread.sleep(10000);
                    generateStoriesBatch();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
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

            // 1. 스토리가 부족한 역들 조회
            List<Station> targetStations = findStationsNeedingStories();

            if (targetStations.isEmpty()) {
                log.info("모든 역에 충분한 스토리가 있습니다.");
                return;
            }

            // 2. 배치 크기만큼 생성
            int actualBatchSize = Math.min(batchSize, targetStations.size());
            actualBatchSize = Math.min(actualBatchSize, dailyGenerationLimit - dailyGeneratedCount.get());

            log.info("배치 생성 대상: {}개 역, 생성 예정: {}개", targetStations.size(), actualBatchSize);

            // 3. 랜덤하게 역 선택
            Collections.shuffle(targetStations);
            List<Station> selectedStations = targetStations.subList(0, actualBatchSize);

            // 4. 각 역에 대해 스토리 생성
            int successCount = 0;
            for (Station station : selectedStations) {
                try {
                    boolean success = generateStoryForStation(station);
                    if (success) {
                        successCount++;
                        dailyGeneratedCount.incrementAndGet();
                    }

                    // 생성 간격 조절 (AI 서버 부하 방지)
                    Thread.sleep(2000);

                } catch (Exception e) {
                    log.error("{}역 스토리 생성 실패: {}", station.getStaName(), e.getMessage());
                }
            }

            // 5. 결과 기록
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
            log.info("{}역({}호선) 스토리 생성 시작", station.getStaName(), station.getStaLine());

            // 1. AI 서버에 스토리 생성 요청
            AIStoryRequest request = AIStoryRequest.builder()
                    .stationName(station.getStaName())
                    .lineNumber(station.getStaLine())
                    .characterHealth(80) // 기본값
                    .characterSanity(80)  // 기본값
                    .storyType("BATCH_GENERATION")
                    .build();

            AIStoryResponse aiResponse = callAIServer(request);
            if (aiResponse == null) {
                log.warn("{}역 AI 서버 응답 없음", station.getStaName());
                return false;
            }

            // 2. Story 엔티티 생성 및 저장
            Story story = Story.builder()
                    .station(station)
                    .stoTitle(aiResponse.getStoryTitle())
                    .stoLength(aiResponse.getPages().size())
                    .stoDescription(aiResponse.getDescription())
                    .stoTheme(aiResponse.getTheme())
                    .stoKeywords(String.join(",", aiResponse.getKeywords()))
                    .build();

            Story savedStory = storyRepository.save(story);
            log.info("Story 저장 완료: storyId={}, title={}", savedStory.getStoId(), savedStory.getStoTitle());

            // 3. Page 엔티티들 생성 및 저장
            List<Page> pages = new ArrayList<>();
            for (int i = 0; i < aiResponse.getPages().size(); i++) {
                AIPageData pageData = aiResponse.getPages().get(i);

                Page page = Page.builder()
                        .stoId(savedStory.getStoId())
                        .pageNumber(i + 1)
                        .pageContents(pageData.getContent())
                        .build();

                pages.add(page);
            }

            List<Page> savedPages = pageRepository.saveAll(pages);
            log.info("Pages 저장 완료: {}개", savedPages.size());

            // 4. Options 엔티티들 생성 및 저장
            List<Options> allOptions = new ArrayList<>();
            for (int i = 0; i < aiResponse.getPages().size(); i++) {
                AIPageData pageData = aiResponse.getPages().get(i);
                Page savedPage = savedPages.get(i);

                for (AIOptionData optionData : pageData.getOptions()) {
                    Options option = Options.builder()
                            .pageId(savedPage.getPageId())
                            .optContents(optionData.getContent())
                            .optEffect(optionData.getEffect())
                            .optAmount(optionData.getAmount())
                            .nextPageId(determineNextPageId(savedPages, i, optionData))
                            .build();

                    allOptions.add(option);
                }
            }

            optionsRepository.saveAll(allOptions);
            log.info("Options 저장 완료: {}개", allOptions.size());

            log.info("{}역 스토리 생성 완료: storyId={}", station.getStaName(), savedStory.getStoId());
            return true;

        } catch (Exception e) {
            log.error("{}역 스토리 생성 실패: {}", station.getStaName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * AI 서버 호출
     */
    private AIStoryResponse callAIServer(AIStoryRequest request) {
        try {
            String url = aiServerUrl + "/generate-complete-story";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-API-Key", "behindy-internal-2024-secret-key");

            HttpEntity<AIStoryRequest> entity = new HttpEntity<>(request, headers);

            log.debug("AI 서버 요청: {}", url);

            ParameterizedTypeReference<AIStoryResponse> responseType =
                    new ParameterizedTypeReference<AIStoryResponse>() {};

            ResponseEntity<AIStoryResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, responseType
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.debug("AI 서버 응답 성공: {} 페이지", response.getBody().getPages().size());
                return response.getBody();
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
     * 스토리가 부족한 역들 조회
     */
    private List<Station> findStationsNeedingStories() {
        List<Station> allStations = stationRepository.findAll();
        List<Station> stationsNeedingStories = new ArrayList<>();

        for (Station station : allStations) {
            List<Story> existingStories = storyRepository.findByStation(station);

            // 각 역당 최소 2개의 스토리 유지
            if (existingStories.size() < 2) {
                stationsNeedingStories.add(station);
            }
        }

        log.info("스토리가 부족한 역: {}개 / 전체 {}개", stationsNeedingStories.size(), allStations.size());
        return stationsNeedingStories;
    }

    /**
     * 다음 페이지 ID 결정 (간단한 순차 진행)
     */
    private Long determineNextPageId(List<Page> pages, int currentIndex, AIOptionData optionData) {
        // 마지막 페이지가 아니면 다음 페이지로
        if (currentIndex < pages.size() - 1) {
            return pages.get(currentIndex + 1).getPageId();
        }
        // 마지막 페이지면 null (게임 종료)
        return null;
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
        lastSuccessfulGeneration = LocalDateTime.now();
        consecutiveFailures = 0;

        log.info("=== 배치 생성 완료 ===");
        log.info("성공: {}개 / 시도: {}개", successCount, totalAttempts);
        log.info("일일 누적 생성: {}/{}", dailyGeneratedCount.get(), dailyGenerationLimit);

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
        private String stationName;
        private Integer lineNumber;
        private Integer characterHealth;
        private Integer characterSanity;
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