package com.example.backend.service;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.game.*;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import com.example.backend.service.mapper.EntityDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * GameService 단위 테스트
 *
 * 테스트 범위:
 * - 게임 입장 (enterGameByStation)
 * - 게임 시작 (startGame)
 * - 게임 재개 (resumeGame)
 * - 게임 상태 조회 (getCurrentGameState)
 * - 선택 처리 (makeChoice)
 * - 게임 포기 (quitGame)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("GameService 단위 테스트")
class GameServiceTest {

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private PageRepository pageRepository;

    @Mock
    private OptionsRepository optionsRepository;

    @Mock
    private NowRepository nowRepository;

    @Mock
    private CharacterRepository characterRepository;

    @Mock
    private LogERepository logERepository;

    @Mock
    private LogORepository logORepository;

    @Mock
    private OpsLogBRepository opsLogBRepository;

    @Mock
    private CharacterService characterService;

    @Mock
    private AuthService authService;

    @Mock
    private StoryService storyService;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    @InjectMocks
    private GameService gameService;

    // 테스트 데이터
    private User testUser;
    private Character testCharacter;
    private Station testStation;
    private Story testStory;
    private Page testFirstPage;
    private Options testOption;
    private Now testGameSession;

    @BeforeEach
    void setUp() {
        // 사용자 설정
        testUser = User.builder()
                .userId(1L)
                .userName("테스트유저")
                .userEmail("test@test.com")
                .userPassword("encoded_password")
                .build();

        // 캐릭터 설정
        testCharacter = Character.builder()
                .charId(1L)
                .user(testUser)
                .charName("테스트캐릭터")
                .charHealth(100)
                .charSanity(100)
                .build();

        // 역 설정
        testStation = Station.builder()
                .staId(1L)
                .staName("강남")
                .staLine(2)
                .build();

        // 스토리 설정
        testStory = Story.builder()
                .stoId(1L)
                .stoTitle("강남역의 비밀")
                .station(testStation)
                .stoLength(10)
                .build();

        // 페이지 설정
        testFirstPage = Page.builder()
                .pageId(1L)
                .stoId(1L)
                .pageNumber(1L)
                .pageContents("당신은 강남역에 도착했다.")
                .build();

        // 선택지 설정
        testOption = Options.builder()
                .optId(1L)
                .pageId(1L)
                .optContents("앞으로 나아간다")
                .optEffect("health")
                .optAmount(-10)
                .build();

        // 게임 세션 설정
        testGameSession = Now.builder()
                .nowId(1L)
                .character(testCharacter)
                .page(testFirstPage)
                .pageEnteredAt(LocalDateTime.now())
                .build();
    }

    @Nested
    @DisplayName("게임 입장 테스트 (enterGameByStation)")
    class EnterGameByStationTests {

        @Test
        @DisplayName("성공: 새 게임 시작 - 플레이 가능한 스토리가 있는 경우")
        void enterGame_NewGame_Success() {
            // given
            String stationName = "강남";
            Integer lineNumber = 2;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacter(testCharacter))
                    .thenReturn(Optional.empty());

            StoryResponse storyResponse = StoryResponse.builder()
                    .storyId(1L)
                    .storyTitle("강남역의 비밀")
                    .build();
            when(storyService.getUncompletedStoriesByStation(stationName, lineNumber, testCharacter.getCharId()))
                    .thenReturn(Arrays.asList(storyResponse));

            // startGame 호출 시 동작 모킹
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));
            when(pageRepository.findFirstPageByStoryId(1L)).thenReturn(Optional.of(testFirstPage));
            when(nowRepository.save(any(Now.class))).thenReturn(testGameSession);

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(1L)
                    .content("당신은 강남역에 도착했다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getAction()).isEqualTo("START_NEW");
            assertThat(response.getSelectedStoryId()).isEqualTo(1L);
            assertThat(response.getStationName()).isEqualTo(stationName);
            assertThat(response.getStationLine()).isEqualTo(lineNumber);

            verify(nowRepository).save(any(Now.class));
        }

        @Test
        @DisplayName("실패: 플레이 가능한 스토리가 없는 경우")
        void enterGame_NoStories_Failure() {
            // given
            String stationName = "강남";
            Integer lineNumber = 2;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacter(testCharacter))
                    .thenReturn(Optional.empty());
            when(storyService.getUncompletedStoriesByStation(stationName, lineNumber, testCharacter.getCharId()))
                    .thenReturn(Collections.emptyList());

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isFalse();
            assertThat(response.getAction()).isEqualTo("NO_STORIES");
            assertThat(response.getMessage()).contains("플레이 가능한 스토리가 없습니다");
        }

        @Test
        @DisplayName("성공: 기존 게임 재개 - 같은 역인 경우")
        void enterGame_ResumeExistingGame_SameStation_Success() {
            // given
            String stationName = "강남";
            Integer lineNumber = 2;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacter(testCharacter))
                    .thenReturn(Optional.of(testGameSession));
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(1L)
                    .content("당신은 강남역에 도착했다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameEnterResponse response = gameService.enterGameByStation(stationName, lineNumber);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getAction()).isEqualTo("RESUME_EXISTING");
            assertThat(response.getResumeStoryId()).isEqualTo(1L);
            assertThat(response.getMessage()).contains("진행 중인 게임을 재개합니다");
        }

        @Test
        @DisplayName("예외: 살아있는 캐릭터가 없는 경우")
        void enterGame_NoLivingCharacter_ThrowsException() {
            // given
            String stationName = "강남";
            Integer lineNumber = 2;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.enterGameByStation(stationName, lineNumber))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Living Character");
        }
    }

    @Nested
    @DisplayName("게임 시작 테스트 (startGame)")
    class StartGameTests {

        @Test
        @DisplayName("성공: 정상적으로 게임 시작")
        void startGame_Success() {
            // given
            Long storyId = 1L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(storyRepository.findById(storyId)).thenReturn(Optional.of(testStory));
            when(nowRepository.findByCharacter(testCharacter)).thenReturn(Optional.empty());
            when(pageRepository.findFirstPageByStoryId(storyId)).thenReturn(Optional.of(testFirstPage));
            when(nowRepository.save(any(Now.class))).thenReturn(testGameSession);

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(1L)
                    .content("당신은 강남역에 도착했다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameStartResponse response = gameService.startGame(storyId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getStoryId()).isEqualTo(storyId);
            assertThat(response.getStoryTitle()).isEqualTo("강남역의 비밀");
            assertThat(response.getMessage()).isEqualTo("게임이 시작되었습니다.");
            assertThat(response.getCurrentPage()).isNotNull();
            assertThat(response.getCharacter()).isNotNull();

            verify(nowRepository).save(any(Now.class));
        }

        @Test
        @DisplayName("예외: 존재하지 않는 스토리 ID")
        void startGame_InvalidStoryId_ThrowsException() {
            // given
            Long invalidStoryId = 999L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(storyRepository.findById(invalidStoryId)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.startGame(invalidStoryId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Story");
        }

        @Test
        @DisplayName("예외: 이미 진행 중인 게임이 있는 경우")
        void startGame_AlreadyHasActiveGame_ThrowsException() {
            // given
            Long storyId = 1L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(storyRepository.findById(storyId)).thenReturn(Optional.of(testStory));
            when(nowRepository.findByCharacter(testCharacter)).thenReturn(Optional.of(testGameSession));

            // when & then
            assertThatThrownBy(() -> gameService.startGame(storyId))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("이미 진행 중인 게임이 있습니다");
        }

        @Test
        @DisplayName("예외: 첫 페이지가 없는 스토리")
        void startGame_NoFirstPage_ThrowsException() {
            // given
            Long storyId = 1L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(storyRepository.findById(storyId)).thenReturn(Optional.of(testStory));
            when(nowRepository.findByCharacter(testCharacter)).thenReturn(Optional.empty());
            when(pageRepository.findFirstPageByStoryId(storyId)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.startGame(storyId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("First Page");
        }
    }

    @Nested
    @DisplayName("게임 재개 테스트 (resumeGame)")
    class ResumeGameTests {

        @Test
        @DisplayName("성공: 진행 중인 게임 재개")
        void resumeGame_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(1L)
                    .content("당신은 강남역에 도착했다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameResumeResponse response = gameService.resumeGame();

            // then
            assertThat(response).isNotNull();
            assertThat(response.getStoryId()).isEqualTo(1L);
            assertThat(response.getStoryTitle()).isEqualTo("강남역의 비밀");
            assertThat(response.getMessage()).isEqualTo("게임을 이어서 진행합니다.");
            assertThat(response.getCurrentPage()).isNotNull();
            assertThat(response.getCharacter()).isNotNull();
        }

        @Test
        @DisplayName("예외: 진행 중인 게임이 없는 경우")
        void resumeGame_NoActiveGame_ThrowsException() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.resumeGame())
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Active Game");
        }
    }

    @Nested
    @DisplayName("게임 상태 조회 테스트 (getCurrentGameState)")
    class GetCurrentGameStateTests {

        @Test
        @DisplayName("성공: 진행 중인 게임이 있는 경우")
        void getCurrentGameState_HasActiveGame_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(1L)
                    .content("당신은 강남역에 도착했다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameStateResponse response = gameService.getCurrentGameState();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isHasActiveGame()).isTrue();
            assertThat(response.getStoryId()).isEqualTo(1L);
            assertThat(response.getMessage()).isEqualTo("게임이 진행 중입니다.");
        }

        @Test
        @DisplayName("성공: 진행 중인 게임이 없는 경우")
        void getCurrentGameState_NoActiveGame_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.empty());

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            GameStateResponse response = gameService.getCurrentGameState();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isHasActiveGame()).isFalse();
            assertThat(response.getMessage()).isEqualTo("진행 중인 게임이 없습니다.");
        }
    }

    @Nested
    @DisplayName("선택 처리 테스트 (makeChoice)")
    class MakeChoiceTests {

        @Test
        @DisplayName("성공: 정상적인 선택 처리 - 다음 페이지로 이동")
        void makeChoice_Success_NextPage() {
            // given
            Long optionId = 1L;

            Page nextPage = Page.builder()
                    .pageId(2L)
                    .stoId(1L)
                    .pageNumber(2L)
                    .pageContents("복도로 나아갔다.")
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(optionsRepository.findById(optionId)).thenReturn(Optional.of(testOption));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);
            when(pageRepository.findByStoIdAndPageNumber(1L, 2L)).thenReturn(Optional.of(nextPage));
            when(nowRepository.save(any(Now.class))).thenReturn(testGameSession);

            PageResponse pageResponse = PageResponse.builder()
                    .pageId(2L)
                    .content("복도로 나아갔다.")
                    .build();
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(90)  // -10 적용
                    .build();

            when(entityDtoMapper.toPageResponse(any(Page.class))).thenReturn(pageResponse);
            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            ChoiceResultResponse response = gameService.makeChoice(optionId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.isGameOver()).isFalse();
            assertThat(response.getNextPage()).isNotNull();
            assertThat(response.getMessage()).isEqualTo("선택이 적용되었습니다.");

            // 캐릭터 상태 변경 확인
            assertThat(testCharacter.getCharHealth()).isEqualTo(90);

            verify(characterRepository).save(testCharacter);
            verify(nowRepository).save(any(Now.class));
            verify(logORepository).save(any(LogO.class));
        }

        @Test
        @DisplayName("성공: 스토리 완료 - 다음 페이지가 없는 경우")
        void makeChoice_StoryComplete_Success() {
            // given
            Long optionId = 1L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(optionsRepository.findById(optionId)).thenReturn(Optional.of(testOption));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);
            when(pageRepository.findByStoIdAndPageNumber(1L, 2L)).thenReturn(Optional.empty());
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(90)
                    .build();
            when(characterService.getCurrentCharacter()).thenReturn(characterResponse);

            // when
            ChoiceResultResponse response = gameService.makeChoice(optionId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.isGameOver()).isTrue();
            assertThat(response.getGameOverReason()).isEqualTo("스토리 완료");
            assertThat(response.getMessage()).contains("축하합니다");

            verify(nowRepository).deleteByCharacter(testCharacter);
            verify(logERepository).save(any(LogE.class));
        }

        @Test
        @DisplayName("성공: 게임 오버 - 체력 0 이하")
        void makeChoice_GameOver_HealthDepleted() {
            // given
            Long optionId = 1L;
            testCharacter.setCharHealth(10);  // 낮은 체력

            Options deadlyOption = Options.builder()
                    .optId(1L)
                    .pageId(1L)
                    .optContents("위험한 선택")
                    .optEffect("health")
                    .optAmount(-20)  // 치명적인 데미지
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(optionsRepository.findById(optionId)).thenReturn(Optional.of(deadlyOption));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);
            when(storyRepository.findById(1L)).thenReturn(Optional.of(testStory));

            // when
            ChoiceResultResponse response = gameService.makeChoice(optionId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.isGameOver()).isTrue();
            assertThat(response.getGameOverReason()).isEqualTo("캐릭터 사망");

            verify(nowRepository).deleteByCharacter(testCharacter);
            verify(characterService).killCharacter(testCharacter.getCharId());
            verify(logERepository).save(any(LogE.class));
        }

        @Test
        @DisplayName("예외: 잘못된 선택지 ID")
        void makeChoice_InvalidOption_ThrowsException() {
            // given
            Long optionId = 1L;

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(optionsRepository.findById(optionId)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.makeChoice(optionId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Option");
        }

        @Test
        @DisplayName("예외: 현재 페이지와 맞지 않는 선택지")
        void makeChoice_OptionNotForCurrentPage_ThrowsException() {
            // given
            Long optionId = 1L;

            Options wrongPageOption = Options.builder()
                    .optId(1L)
                    .pageId(999L)  // 다른 페이지의 선택지
                    .optContents("잘못된 선택")
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(testGameSession));
            when(optionsRepository.findById(optionId)).thenReturn(Optional.of(wrongPageOption));

            // when & then
            assertThatThrownBy(() -> gameService.makeChoice(optionId))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("잘못된 선택지입니다");
        }
    }

    @Nested
    @DisplayName("게임 포기 테스트 (quitGame)")
    class QuitGameTests {

        @Test
        @DisplayName("성공: 정상적으로 게임 포기")
        void quitGame_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacter(testCharacter))
                    .thenReturn(Optional.of(testGameSession));

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();
            when(characterService.getCurrentCharacter()).thenReturn(characterResponse);

            // when
            GameQuitResponse response = gameService.quitGame();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getMessage()).isEqualTo("게임을 포기했습니다.");

            verify(nowRepository).deleteByCharacter(testCharacter);
        }

        @Test
        @DisplayName("예외: 진행 중인 게임이 없는 경우")
        void quitGame_NoActiveGame_ThrowsException() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacter(testCharacter))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> gameService.quitGame())
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Active Game");
        }
    }

    @Nested
    @DisplayName("게임 자격 확인 테스트 (checkGameEligibility)")
    class CheckGameEligibilityTests {

        @Test
        @DisplayName("성공: 게임 시작 가능한 상태")
        void checkGameEligibility_CanStart_Success() {
            // given
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterService.getCurrentCharacterOptional()).thenReturn(Optional.of(characterResponse));
            when(nowRepository.findByCharacterId(1L)).thenReturn(Optional.empty());

            // when
            GameEligibilityResponse response = gameService.checkGameEligibility();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isCanStartGame()).isTrue();
            assertThat(response.getReason()).isEqualTo("게임을 시작할 수 있습니다.");
        }

        @Test
        @DisplayName("실패: 캐릭터가 없는 경우")
        void checkGameEligibility_NoCharacter_Failure() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterService.getCurrentCharacterOptional()).thenReturn(Optional.empty());

            // when
            GameEligibilityResponse response = gameService.checkGameEligibility();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isCanStartGame()).isFalse();
            assertThat(response.getReason()).contains("살아있는 캐릭터가 없습니다");
            assertThat(response.isRequiresCharacterCreation()).isTrue();
        }

        @Test
        @DisplayName("실패: 캐릭터 체력이 0인 경우")
        void checkGameEligibility_DeadCharacter_Failure() {
            // given
            CharacterResponse deadCharacter = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(0)  // 체력 0
                    .charSanity(100)
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterService.getCurrentCharacterOptional()).thenReturn(Optional.of(deadCharacter));

            // when
            GameEligibilityResponse response = gameService.checkGameEligibility();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isCanStartGame()).isFalse();
            assertThat(response.getReason()).contains("게임을 진행할 수 없는 상태입니다");
        }

        @Test
        @DisplayName("실패: 이미 진행 중인 게임이 있는 경우")
        void checkGameEligibility_HasActiveGame_Failure() {
            // given
            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterService.getCurrentCharacterOptional()).thenReturn(Optional.of(characterResponse));
            when(nowRepository.findByCharacterId(1L)).thenReturn(Optional.of(testGameSession));

            // when
            GameEligibilityResponse response = gameService.checkGameEligibility();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isCanStartGame()).isFalse();
            assertThat(response.getReason()).contains("이미 진행 중인 게임이 있습니다");
            assertThat(response.isHasActiveGame()).isTrue();
        }

        @Test
        @DisplayName("실패: 인증되지 않은 사용자")
        void checkGameEligibility_NotAuthenticated_Failure() {
            // given
            when(authService.getCurrentUser()).thenThrow(new RuntimeException("Not authenticated"));

            // when
            GameEligibilityResponse response = gameService.checkGameEligibility();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isCanStartGame()).isFalse();
            assertThat(response.getReason()).contains("사용자 인증이 필요합니다");
            assertThat(response.isRequiresLogin()).isTrue();
        }
    }
}
