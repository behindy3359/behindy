package com.example.backend.service;

import com.example.backend.dto.game.StoryListResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.entity.Now;
import com.example.backend.entity.Station;
import com.example.backend.entity.Story;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.StationRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final StationRepository stationRepository;
    private final NowRepository nowRepository;
    private final AuthService authService;
    private final CharacterService characterService;
    private final EntityDtoMapper entityDtoMapper;

    /**
     * 전체 스토리 목록 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getAllStories() {
        List<Story> stories = storyRepository.findAll();

        return stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 노선별 스토리 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesByLine(Integer lineNumber) {
        List<Story> stories = storyRepository.findByStationLine(lineNumber);

        return stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 역의 스토리 조회
     */
    @Transactional(readOnly = true)
    public StoryListResponse getStoriesByStation(String stationName) {
        List<Story> stories = storyRepository.findByStationName(stationName);

        if (stories.isEmpty()) {
            throw new ResourceNotFoundException("Stories", "stationName", stationName);
        }

        Station station = stories.get(0).getStation();

        List<StoryResponse> storyResponses = stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());

        boolean hasActiveGame = checkHasActiveGame();

        return StoryListResponse.builder()
                .stories(storyResponses)
                .stationName(station.getStaName())
                .stationLine(station.getStaLine())
                .hasActiveGame(hasActiveGame)
                .build();
    }

    /**
     * 특정 역 + 노선의 스토리 조회
     */
    @Transactional(readOnly = true)
    public StoryListResponse getStoriesByStationAndLine(String stationName, Integer lineNumber) {
        List<Story> stories = storyRepository.findByStationNameAndLine(stationName, lineNumber);

        if (stories.isEmpty()) {
            Optional<Station> station = stationRepository.findByStaNameAndStaLine(stationName, lineNumber);
            if (station.isEmpty()) {
                throw new ResourceNotFoundException("Station", "name and line", stationName + " " + lineNumber);
            }

            return StoryListResponse.builder()
                    .stories(List.of())
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .hasActiveGame(checkHasActiveGame())
                    .build();
        }

        List<StoryResponse> storyResponses = stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());

        return StoryListResponse.builder()
                .stories(storyResponses)
                .stationName(stationName)
                .stationLine(lineNumber)
                .hasActiveGame(checkHasActiveGame())
                .build();
    }

    /**
     * 단일 스토리 상세 조회
     */
    @Transactional(readOnly = true)
    public StoryResponse getStoryById(Long storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", storyId));

        return entityDtoMapper.toStoryResponse(story);
    }

    /**
     * 랜덤 스토리 추천
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getRandomStories(Integer count) {
        List<Story> stories = storyRepository.findRandomStories(count);

        return stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 노선의 랜덤 스토리 추천
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getRandomStoriesByLine(Integer lineNumber, Integer count) {
        List<Story> stories = storyRepository.findRandomStoriesByLine(lineNumber, count);

        return stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 난이도별 스토리 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesByDifficulty(String difficulty) {
        List<Story> stories;

        switch (difficulty.toLowerCase()) {
            case "easy", "쉬움" -> stories = storyRepository.findShortStories();
            case "hard", "어려움" -> stories = storyRepository.findLongStories();
            case "medium", "보통" -> stories = storyRepository.findByLengthRange(6, 9);
            default -> stories = storyRepository.findByLengthRange(6, 9);
        }

        return stories.stream()
                .map(entityDtoMapper::toStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 스토리 플레이 가능 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean canPlayStory(Long storyId) {
        try {
            // 로그인 확인
            authService.getCurrentUser();

            // 살아있는 캐릭터 확인
            Optional<com.example.backend.dto.character.CharacterResponse> character =
                    characterService.getCurrentCharacterOptional();

            if (character.isEmpty()) {
                return false;
            }

            // 캐릭터 상태 확인
            com.example.backend.dto.character.CharacterResponse charResp = character.get();
            if (charResp.getCharHealth() <= 0 || charResp.getCharSanity() <= 0) {
                return false;
            }

            // 진행 중인 게임 확인
            Optional<Now> activeGame = nowRepository.findByCharacterId(charResp.getCharId());
            return activeGame.isEmpty();

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 현재 진행 중인 게임 확인
     */
    private boolean checkHasActiveGame() {
        try {
            authService.getCurrentUser();
            Optional<com.example.backend.dto.character.CharacterResponse> character =
                    characterService.getCurrentCharacterOptional();

            if (character.isEmpty()) {
                return false;
            }

            Optional<Now> activeGame = nowRepository.findByCharacterId(character.get().getCharId());
            return activeGame.isPresent();

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 스토리 생성 (관리자용)
     */
    @Transactional
    public Story createStory(String title, String stationName, Integer lineNumber, Integer length) {
        Station station = stationRepository.findByStaNameAndStaLine(stationName, lineNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Station", "name and line", stationName + " " + lineNumber));

        Story story = Story.builder()
                .station(station)
                .stoTitle(title)
                .stoLength(length)
                .build();

        Story savedStory = storyRepository.save(story);
        log.info("새 스토리 생성: storyId={}, title={}, station={}-{}",
                savedStory.getStoId(), title, stationName, lineNumber);

        return savedStory;
    }

    /**
     * 스토리 삭제
     */
    @Transactional
    public void deleteStory(Long storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", storyId));

        // 진행 중인 게임이 있는지 확인
        List<Now> activeGames = nowRepository.findCharactersInStory(storyId);
        if (!activeGames.isEmpty()) {
            throw new IllegalStateException("진행 중인 게임이 있는 스토리는 삭제할 수 없습니다.");
        }

        storyRepository.delete(story);
        log.info("스토리 삭제: storyId={}, title={}", storyId, story.getStoTitle());
    }

    /**
     * 스토리별 통계 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesWithStatistics() {
        List<Story> stories = storyRepository.findAll();

        return stories.stream()
                .map(story -> {
                    StoryResponse response = entityDtoMapper.toStoryResponse(story);

                    // 현재 플레이 중인 사용자 수 추가 (추가 통계 정보는 DTO 확장 후 구현)
                    List<Now> currentPlayers = nowRepository.findCharactersInStory(story.getStoId());

                    return response;
                })
                .collect(Collectors.toList());
    }

    /**
     * 스토리가 없는 역 조회
     */
    @Transactional(readOnly = true)
    public List<Station> getStationsWithoutStories() {
        List<Station> allStations = stationRepository.findAll();
        List<Station> stationsWithStories = stationRepository.findStationsWithStories();

        return allStations.stream()
                .filter(station -> !stationsWithStories.contains(station))
                .collect(Collectors.toList());
    }
}