// StoryService.java
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

    /**
     * 전체 스토리 목록 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getAllStories() {
        List<Story> stories = storyRepository.findAll();
        return stories.stream()
                .map(this::mapToStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 노선별 스토리 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesByLine(Integer lineNumber) {
        List<Story> stories = storyRepository.findByStationLine(lineNumber);
        return stories.stream()
                .map(this::mapToStoryResponse)
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

        // 첫 번째 스토리에서 역 정보 가져오기
        Station station = stories.get(0).getStation();

        List<StoryResponse> storyResponses = stories.stream()
                .map(this::mapToStoryResponse)
                .collect(Collectors.toList());

        // 현재 진행 중인 게임 확인
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
            // 역이 존재하는지 확인
            Optional<Station> station = stationRepository.findByStaNameAndStaLine(stationName, lineNumber);
            if (station.isEmpty()) {
                throw new ResourceNotFoundException("Station", "name and line", stationName + " " + lineNumber);
            }

            // 역은 있지만 스토리가 없는 경우
            return StoryListResponse.builder()
                    .stories(List.of())
                    .stationName(stationName)
                    .stationLine(lineNumber)
                    .hasActiveGame(checkHasActiveGame())
                    .build();
        }

        List<StoryResponse> storyResponses = stories.stream()
                .map(this::mapToStoryResponse)
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

        return mapToStoryResponse(story);
    }

    /**
     * 랜덤 스토리 추천
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getRandomStories(Integer count) {
        List<Story> stories = storyRepository.findRandomStories(count);
        return stories.stream()
                .map(this::mapToStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 노선의 랜덤 스토리 추천
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getRandomStoriesByLine(Integer lineNumber, Integer count) {
        List<Story> stories = storyRepository.findRandomStoriesByLine(lineNumber, count);
        return stories.stream()
                .map(this::mapToStoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 난이도별 스토리 조회
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesByDifficulty(String difficulty) {
        List<Story> stories;

        switch (difficulty.toLowerCase()) {
            case "easy":
            case "쉬움":
                stories = storyRepository.findShortStories();
                break;
            case "hard":
            case "어려움":
                stories = storyRepository.findLongStories();
                break;
            case "medium":
            case "보통":
            default:
                stories = storyRepository.findByLengthRange(6, 9);
                break;
        }

        return stories.stream()
                .map(this::mapToStoryResponse)
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
     * Story 엔티티를 StoryResponse DTO로 변환
     */
    private StoryResponse mapToStoryResponse(Story story) {
        // 플레이 가능 여부 확인
        boolean canPlay = canPlayStory(story.getStoId());

        // 플레이 상태 결정
        String playStatus = determinePlayStatus(story.getStoId(), canPlay);

        // 난이도 결정
        String difficulty = determineDifficulty(story.getStoLength());

        // 테마 결정 (향후 Story 엔티티에 theme 필드 추가 시 사용)
        String theme = determineTheme(story.getStation().getStaLine());

        return StoryResponse.builder()
                .storyId(story.getStoId())
                .storyTitle(story.getStoTitle())
                .estimatedLength(story.getStoLength())
                .difficulty(difficulty)
                .theme(theme)
                .description(generateStoryDescription(story))
                .stationName(story.getStation().getStaName())
                .stationLine(story.getStation().getStaLine())
                .canPlay(canPlay)
                .playStatus(playStatus)
                .build();
    }

    /**
     * 플레이 상태 결정
     */
    private String determinePlayStatus(Long storyId, boolean canPlay) {
        try {
            Optional<com.example.backend.dto.character.CharacterResponse> character =
                    characterService.getCurrentCharacterOptional();

            if (character.isEmpty()) {
                return "로그인 필요";
            }

            // 현재 이 스토리를 플레이 중인지 확인
            Optional<Now> activeGame = nowRepository.findByCharacterId(character.get().getCharId());
            if (activeGame.isPresent()) {
                Long currentStoryId = activeGame.get().getPage().getStoId();
                if (currentStoryId.equals(storyId)) {
                    return "진행 중";
                } else {
                    return "다른 게임 진행 중";
                }
            }

            if (!canPlay) {
                if (character.get().getCharHealth() <= 0 || character.get().getCharSanity() <= 0) {
                    return "캐릭터 치료 필요";
                }
                return "플레이 불가";
            }

            return "플레이 가능";

        } catch (Exception e) {
            return "새로운 스토리";
        }
    }

    /**
     * 스토리 길이에 따른 난이도 결정
     */
    private String determineDifficulty(Integer storyLength) {
        if (storyLength == null) {
            return "보통";
        }

        if (storyLength <= 5) {
            return "쉬움";
        } else if (storyLength >= 10) {
            return "어려움";
        } else {
            return "보통";
        }
    }

    /**
     * 노선에 따른 테마 결정 (임시)
     */
    private String determineTheme(Integer lineNumber) {
        // 향후 Story 엔티티에 theme 필드 추가 시 해당 필드 사용
        switch (lineNumber) {
            case 1: return "공포";
            case 2: return "로맨스";
            case 3: return "미스터리";
            case 4: return "모험";
            case 5: return "스릴러";
            case 6: return "코미디";
            case 7: return "판타지";
            case 8: return "SF";
            case 9: return "드라마";
            default: return "일반";
        }
    }

    /**
     * 스토리 설명 생성
     */
    private String generateStoryDescription(Story story) {
        String theme = determineTheme(story.getStation().getStaLine());
        String difficulty = determineDifficulty(story.getStoLength());

        return String.format("%s역에서 펼쳐지는 %s 장르의 텍스트 어드벤처입니다. " +
                        "예상 플레이 시간: %d분 (난이도: %s)",
                story.getStation().getStaName(),
                theme,
                story.getStoLength() * 2, // 페이지당 2분 예상
                difficulty);
    }

    // === 관리자용 메서드들 ===

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
     * 스토리 삭제 (관리자용)
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
     * 스토리별 통계 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesWithStatistics() {
        List<Story> stories = storyRepository.findAll();

        return stories.stream()
                .map(story -> {
                    StoryResponse response = mapToStoryResponse(story);

                    // 현재 플레이 중인 사용자 수 추가
                    List<Now> currentPlayers = nowRepository.findCharactersInStory(story.getStoId());
                    // 추가 통계 정보는 DTO 확장 후 구현

                    return response;
                })
                .collect(Collectors.toList());
    }

    /**
     * 스토리가 없는 역 조회 (관리자용)
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