package com.example.backend.service;

import com.example.backend.dto.character.CharacterCreateRequest;
import com.example.backend.dto.character.CharacterGameStatusResponse;
import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.entity.Character;
import com.example.backend.entity.Now;
import com.example.backend.entity.Page;
import com.example.backend.entity.Story;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CharacterRepository;
import com.example.backend.repository.LogERepository;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.StoryRepository;
import com.example.backend.service.mapper.EntityDtoMapper;
import com.example.backend.util.HtmlSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * CharacterService 단위 테스트
 *
 * 테스트 범위:
 * - 캐릭터 생성 (createCharacter)
 * - 현재 캐릭터 조회 (getCurrentCharacter, getCurrentCharacterOptional)
 * - 캐릭터 게임 상태 조회 (getCharacterGameStatus)
 * - 캐릭터 히스토리 조회 (getCharacterHistory)
 * - 캐릭터 삭제 (killCharacter)
 * - 캐릭터 스탯 업데이트 (updateCharacterStats)
 * - 사망 처리 (checkAndProcessDeath)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CharacterService 단위 테스트")
class CharacterServiceTest {

    @Mock
    private CharacterRepository characterRepository;

    @Mock
    private AuthService authService;

    @Mock
    private HtmlSanitizer htmlSanitizer;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    @Mock
    private NowRepository nowRepository;

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private LogERepository logERepository;

    @InjectMocks
    private CharacterService characterService;

    // 테스트 데이터
    private User testUser;
    private User otherUser;
    private Character testCharacter;
    private Character deadCharacter;

    @BeforeEach
    void setUp() {
        // 사용자 설정
        testUser = User.builder()
                .userId(1L)
                .userName("테스트유저")
                .userEmail("test@test.com")
                .userPassword("encoded_password")
                .build();

        otherUser = User.builder()
                .userId(2L)
                .userName("다른유저")
                .userEmail("other@test.com")
                .userPassword("encoded_password")
                .build();

        // 살아있는 캐릭터
        testCharacter = Character.builder()
                .charId(1L)
                .user(testUser)
                .charName("테스트캐릭터")
                .charHealth(100)
                .charSanity(100)
                .build();

        // 죽은 캐릭터
        deadCharacter = Character.builder()
                .charId(2L)
                .user(testUser)
                .charName("죽은캐릭터")
                .charHealth(0)
                .charSanity(0)
                .build();
        deadCharacter.delete();
    }

    @Nested
    @DisplayName("캐릭터 생성 테스트 (createCharacter)")
    class CreateCharacterTests {

        @Test
        @DisplayName("성공: 정상적으로 캐릭터 생성")
        void createCharacter_Success() {
            // given
            CharacterCreateRequest request = new CharacterCreateRequest();
            request.setCharName("새캐릭터");

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.existsByUserAndDeletedAtIsNull(testUser)).thenReturn(false);
            when(htmlSanitizer.sanitize("새캐릭터")).thenReturn("새캐릭터");
            when(characterRepository.existsByCharNameAndDeletedAtIsNull("새캐릭터")).thenReturn(false);

            Character newCharacter = Character.builder()
                    .charId(10L)
                    .user(testUser)
                    .charName("새캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(characterRepository.save(any(Character.class))).thenReturn(newCharacter);

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(10L)
                    .charName("새캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            CharacterResponse response = characterService.createCharacter(request);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getCharId()).isEqualTo(10L);
            assertThat(response.getCharName()).isEqualTo("새캐릭터");
            assertThat(response.getCharHealth()).isEqualTo(100);
            assertThat(response.getCharSanity()).isEqualTo(100);

            verify(characterRepository).save(any(Character.class));
            verify(htmlSanitizer).sanitize("새캐릭터");
        }

        @Test
        @DisplayName("실패: 이미 살아있는 캐릭터가 있는 경우")
        void createCharacter_AlreadyHasCharacter_ThrowsException() {
            // given
            CharacterCreateRequest request = new CharacterCreateRequest();
            request.setCharName("새캐릭터");

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.existsByUserAndDeletedAtIsNull(testUser)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> characterService.createCharacter(request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("이미 살아있는 캐릭터가 있습니다");

            verify(characterRepository, never()).save(any());
        }

        @Test
        @DisplayName("실패: 중복된 캐릭터 이름")
        void createCharacter_DuplicateName_ThrowsException() {
            // given
            CharacterCreateRequest request = new CharacterCreateRequest();
            request.setCharName("중복이름");

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.existsByUserAndDeletedAtIsNull(testUser)).thenReturn(false);
            when(htmlSanitizer.sanitize("중복이름")).thenReturn("중복이름");
            when(characterRepository.existsByCharNameAndDeletedAtIsNull("중복이름")).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> characterService.createCharacter(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("이미 사용 중인 캐릭터 이름입니다");

            verify(characterRepository, never()).save(any());
        }

        @Test
        @DisplayName("성공: HTML 태그가 포함된 이름 sanitize")
        void createCharacter_WithHtmlTags_Sanitizes() {
            // given
            CharacterCreateRequest request = new CharacterCreateRequest();
            request.setCharName("<script>alert('xss')</script>캐릭터");

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.existsByUserAndDeletedAtIsNull(testUser)).thenReturn(false);
            when(htmlSanitizer.sanitize("<script>alert('xss')</script>캐릭터")).thenReturn("캐릭터");
            when(characterRepository.existsByCharNameAndDeletedAtIsNull("캐릭터")).thenReturn(false);

            Character newCharacter = Character.builder()
                    .charId(10L)
                    .user(testUser)
                    .charName("캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(characterRepository.save(any(Character.class))).thenReturn(newCharacter);

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(10L)
                    .charName("캐릭터")
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(characterResponse);

            // when
            CharacterResponse response = characterService.createCharacter(request);

            // then
            assertThat(response.getCharName()).isEqualTo("캐릭터");
            verify(htmlSanitizer).sanitize("<script>alert('xss')</script>캐릭터");
        }
    }

    @Nested
    @DisplayName("현재 캐릭터 조회 테스트 (getCurrentCharacter)")
    class GetCurrentCharacterTests {

        @Test
        @DisplayName("성공: 살아있는 캐릭터 조회")
        void getCurrentCharacter_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .charHealth(100)
                    .charSanity(100)
                    .build();

            when(entityDtoMapper.toCharacterResponse(testCharacter)).thenReturn(characterResponse);

            // when
            CharacterResponse response = characterService.getCurrentCharacter();

            // then
            assertThat(response).isNotNull();
            assertThat(response.getCharId()).isEqualTo(1L);
            assertThat(response.getCharName()).isEqualTo("테스트캐릭터");
            assertThat(response.getCharHealth()).isEqualTo(100);
            assertThat(response.getCharSanity()).isEqualTo(100);
        }

        @Test
        @DisplayName("예외: 살아있는 캐릭터가 없는 경우")
        void getCurrentCharacter_NoCharacter_ThrowsException() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> characterService.getCurrentCharacter())
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Character");
        }
    }

    @Nested
    @DisplayName("현재 캐릭터 Optional 조회 테스트 (getCurrentCharacterOptional)")
    class GetCurrentCharacterOptionalTests {

        @Test
        @DisplayName("성공: 캐릭터가 있는 경우 Optional 반환")
        void getCurrentCharacterOptional_HasCharacter_ReturnsOptional() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));

            CharacterResponse characterResponse = CharacterResponse.builder()
                    .charId(1L)
                    .charName("테스트캐릭터")
                    .build();

            when(entityDtoMapper.toCharacterResponse(testCharacter)).thenReturn(characterResponse);

            // when
            Optional<CharacterResponse> response = characterService.getCurrentCharacterOptional();

            // then
            assertThat(response).isPresent();
            assertThat(response.get().getCharId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("성공: 캐릭터가 없는 경우 빈 Optional 반환")
        void getCurrentCharacterOptional_NoCharacter_ReturnsEmpty() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.empty());

            // when
            Optional<CharacterResponse> response = characterService.getCurrentCharacterOptional();

            // then
            assertThat(response).isEmpty();
        }
    }

    @Nested
    @DisplayName("캐릭터 게임 상태 조회 테스트 (getCharacterGameStatus)")
    class GetCharacterGameStatusTests {

        @Test
        @DisplayName("성공: 게임 진행 중이 아닌 상태")
        void getCharacterGameStatus_NoActiveGame_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.empty());
            when(logERepository.countCompletionsByCharacter(testCharacter.getCharId())).thenReturn(5L);
            when(logERepository.countTotalPlaysByCharacter(testCharacter.getCharId())).thenReturn(10L);

            // when
            CharacterGameStatusResponse response = characterService.getCharacterGameStatus();

            // then
            assertThat(response).isNotNull();
            assertThat(response.getCharId()).isEqualTo(1L);
            assertThat(response.getCharName()).isEqualTo("테스트캐릭터");
            assertThat(response.getCharHealth()).isEqualTo(100);
            assertThat(response.getCharSanity()).isEqualTo(100);
            assertThat(response.isAlive()).isTrue();
            assertThat(response.isDying()).isFalse();
            assertThat(response.getStatusMessage()).isEqualTo("건강");
            assertThat(response.isHasActiveGame()).isFalse();
            assertThat(response.getTotalClears()).isEqualTo(5L);
            assertThat(response.getTotalPlays()).isEqualTo(10L);
            assertThat(response.getClearRate()).isEqualTo(50.0);
            assertThat(response.isCanEnterNewGame()).isTrue();
            assertThat(response.getCannotEnterReason()).isNull();
        }

        @Test
        @DisplayName("성공: 게임 진행 중인 상태")
        void getCharacterGameStatus_WithActiveGame_Success() {
            // given
            Page currentPage = Page.builder()
                    .pageId(1L)
                    .stoId(1L)
                    .pageNumber(5L)
                    .pageContents("페이지 내용")
                    .build();

            Now gameSession = Now.builder()
                    .nowId(1L)
                    .character(testCharacter)
                    .page(currentPage)
                    .build();

            Story story = Story.builder()
                    .stoId(1L)
                    .stoTitle("강남역의 비밀")
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.of(gameSession));
            when(storyRepository.findById(1L)).thenReturn(Optional.of(story));
            when(logERepository.countCompletionsByCharacter(testCharacter.getCharId())).thenReturn(0L);
            when(logERepository.countTotalPlaysByCharacter(testCharacter.getCharId())).thenReturn(1L);

            // when
            CharacterGameStatusResponse response = characterService.getCharacterGameStatus();

            // then
            assertThat(response).isNotNull();
            assertThat(response.isHasActiveGame()).isTrue();
            assertThat(response.getCurrentStoryId()).isEqualTo(1L);
            assertThat(response.getCurrentStoryTitle()).isEqualTo("강남역의 비밀");
            assertThat(response.getCurrentPageNumber()).isEqualTo(5L);
            assertThat(response.isCanEnterNewGame()).isFalse();
            assertThat(response.getCannotEnterReason()).isEqualTo("이미 진행 중인 게임이 있습니다.");
        }

        @Test
        @DisplayName("성공: 위험한 상태 (체력 낮음)")
        void getCharacterGameStatus_LowHealth_ShowsDyingStatus() {
            // given
            testCharacter.setCharHealth(15);

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserAndDeletedAtIsNull(testUser))
                    .thenReturn(Optional.of(testCharacter));
            when(nowRepository.findByCharacterIdWithPage(testCharacter.getCharId()))
                    .thenReturn(Optional.empty());
            when(logERepository.countCompletionsByCharacter(testCharacter.getCharId())).thenReturn(0L);
            when(logERepository.countTotalPlaysByCharacter(testCharacter.getCharId())).thenReturn(0L);

            // when
            CharacterGameStatusResponse response = characterService.getCharacterGameStatus();

            // then
            assertThat(response.isDying()).isTrue();
            assertThat(response.getStatusMessage()).isEqualTo("주의 - 상태가 좋지 않음");
        }
    }

    @Nested
    @DisplayName("캐릭터 히스토리 조회 테스트 (getCharacterHistory)")
    class GetCharacterHistoryTests {

        @Test
        @DisplayName("성공: 캐릭터 히스토리 조회")
        void getCharacterHistory_Success() {
            // given
            Character char1 = Character.builder()
                    .charId(1L)
                    .charName("첫번째캐릭터")
                    .build();

            Character char2 = Character.builder()
                    .charId(2L)
                    .charName("두번째캐릭터")
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserOrderByCreatedAtDesc(testUser))
                    .thenReturn(Arrays.asList(char1, char2));

            CharacterResponse response1 = CharacterResponse.builder()
                    .charId(1L)
                    .charName("첫번째캐릭터")
                    .build();

            CharacterResponse response2 = CharacterResponse.builder()
                    .charId(2L)
                    .charName("두번째캐릭터")
                    .build();

            when(entityDtoMapper.toCharacterResponse(char1)).thenReturn(response1);
            when(entityDtoMapper.toCharacterResponse(char2)).thenReturn(response2);

            // when
            List<CharacterResponse> responses = characterService.getCharacterHistory();

            // then
            assertThat(responses).hasSize(2);
            assertThat(responses.get(0).getCharId()).isEqualTo(1L);
            assertThat(responses.get(1).getCharId()).isEqualTo(2L);
        }

        @Test
        @DisplayName("성공: 캐릭터가 없는 경우 빈 리스트 반환")
        void getCharacterHistory_NoCharacters_ReturnsEmptyList() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findByUserOrderByCreatedAtDesc(testUser))
                    .thenReturn(Arrays.asList());

            // when
            List<CharacterResponse> responses = characterService.getCharacterHistory();

            // then
            assertThat(responses).isEmpty();
        }
    }

    @Nested
    @DisplayName("캐릭터 삭제 테스트 (killCharacter)")
    class KillCharacterTests {

        @Test
        @DisplayName("성공: 정상적으로 캐릭터 삭제")
        void killCharacter_Success() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            // when
            characterService.killCharacter(1L);

            // then
            verify(characterRepository).save(testCharacter);
            verify(nowRepository).deleteByCharacter(testCharacter);
            assertThat(testCharacter.isDeleted()).isTrue();
        }

        @Test
        @DisplayName("예외: 다른 사용자의 캐릭터 삭제 시도")
        void killCharacter_OtherUserCharacter_ThrowsException() {
            // given
            Character otherCharacter = Character.builder()
                    .charId(10L)
                    .user(otherUser)
                    .charName("다른캐릭터")
                    .build();

            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findAliveCharacterById(10L))
                    .thenReturn(Optional.of(otherCharacter));

            // when & then
            assertThatThrownBy(() -> characterService.killCharacter(10L))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("캐릭터를 삭제할 권한이 없습니다");

            verify(characterRepository, never()).save(any());
        }

        @Test
        @DisplayName("예외: 존재하지 않는 캐릭터")
        void killCharacter_NotFound_ThrowsException() {
            // given
            when(authService.getCurrentUser()).thenReturn(testUser);
            when(characterRepository.findAliveCharacterById(999L))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> characterService.killCharacter(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Character");
        }
    }

    @Nested
    @DisplayName("캐릭터 스탯 업데이트 테스트 (updateCharacterStats)")
    class UpdateCharacterStatsTests {

        @Test
        @DisplayName("성공: 체력 증가")
        void updateCharacterStats_IncreaseHealth_Success() {
            // given
            testCharacter.setCharHealth(50);

            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            CharacterResponse response = CharacterResponse.builder()
                    .charId(1L)
                    .charHealth(60)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(response);

            // when
            CharacterResponse result = characterService.updateCharacterStats(1L, 10, null);

            // then
            assertThat(testCharacter.getCharHealth()).isEqualTo(60);
            verify(characterRepository).save(testCharacter);
        }

        @Test
        @DisplayName("성공: 정신력 감소")
        void updateCharacterStats_DecreaseSanity_Success() {
            // given
            testCharacter.setCharSanity(100);

            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            CharacterResponse response = CharacterResponse.builder()
                    .charId(1L)
                    .charSanity(70)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(response);

            // when
            CharacterResponse result = characterService.updateCharacterStats(1L, null, -30);

            // then
            assertThat(testCharacter.getCharSanity()).isEqualTo(70);
            verify(characterRepository).save(testCharacter);
        }

        @Test
        @DisplayName("성공: 체력과 정신력 동시 변경")
        void updateCharacterStats_BothStats_Success() {
            // given
            testCharacter.setCharHealth(50);
            testCharacter.setCharSanity(50);

            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            CharacterResponse response = CharacterResponse.builder()
                    .charId(1L)
                    .charHealth(60)
                    .charSanity(40)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(response);

            // when
            CharacterResponse result = characterService.updateCharacterStats(1L, 10, -10);

            // then
            assertThat(testCharacter.getCharHealth()).isEqualTo(60);
            assertThat(testCharacter.getCharSanity()).isEqualTo(40);
        }

        @Test
        @DisplayName("성공: 최솟값 0 유지 (음수 방지)")
        void updateCharacterStats_MinimumZero_Success() {
            // given
            testCharacter.setCharHealth(10);

            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            CharacterResponse response = CharacterResponse.builder()
                    .charId(1L)
                    .charHealth(0)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(response);

            // when
            CharacterResponse result = characterService.updateCharacterStats(1L, -50, null);

            // then
            assertThat(testCharacter.getCharHealth()).isEqualTo(0);
        }

        @Test
        @DisplayName("성공: 체력 0 → 사망 처리")
        void updateCharacterStats_HealthZero_Dies() {
            // given
            testCharacter.setCharHealth(5);

            when(characterRepository.findAliveCharacterById(1L))
                    .thenReturn(Optional.of(testCharacter));
            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            CharacterResponse response = CharacterResponse.builder()
                    .charId(1L)
                    .charHealth(0)
                    .build();

            when(entityDtoMapper.toCharacterResponse(any(Character.class))).thenReturn(response);

            // when
            CharacterResponse result = characterService.updateCharacterStats(1L, -10, null);

            // then
            assertThat(testCharacter.getCharHealth()).isEqualTo(0);
            assertThat(testCharacter.isDeleted()).isTrue();
            verify(nowRepository).deleteByCharacter(testCharacter);
        }
    }

    @Nested
    @DisplayName("사망 처리 테스트 (checkAndProcessDeath)")
    class CheckAndProcessDeathTests {

        @Test
        @DisplayName("성공: 체력 0 → 사망 처리")
        void checkAndProcessDeath_HealthZero_Dies() {
            // given
            testCharacter.setCharHealth(0);

            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            // when
            characterService.checkAndProcessDeath(testCharacter);

            // then
            assertThat(testCharacter.isDeleted()).isTrue();
            verify(characterRepository).save(testCharacter);
            verify(nowRepository).deleteByCharacter(testCharacter);
        }

        @Test
        @DisplayName("성공: 정신력 0 → 사망 처리")
        void checkAndProcessDeath_SanityZero_Dies() {
            // given
            testCharacter.setCharSanity(0);

            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            // when
            characterService.checkAndProcessDeath(testCharacter);

            // then
            assertThat(testCharacter.isDeleted()).isTrue();
            verify(characterRepository).save(testCharacter);
            verify(nowRepository).deleteByCharacter(testCharacter);
        }

        @Test
        @DisplayName("성공: 건강한 상태 → 사망 처리 안 됨")
        void checkAndProcessDeath_Healthy_NotDies() {
            // given
            testCharacter.setCharHealth(50);
            testCharacter.setCharSanity(50);

            // when
            characterService.checkAndProcessDeath(testCharacter);

            // then
            assertThat(testCharacter.isDeleted()).isFalse();
            verify(characterRepository, never()).save(any());
            verify(nowRepository, never()).deleteByCharacter(any());
        }

        @Test
        @DisplayName("성공: 체력과 정신력 모두 0 → 사망 처리")
        void checkAndProcessDeath_BothZero_Dies() {
            // given
            testCharacter.setCharHealth(0);
            testCharacter.setCharSanity(0);

            when(characterRepository.save(any(Character.class))).thenReturn(testCharacter);

            // when
            characterService.checkAndProcessDeath(testCharacter);

            // then
            assertThat(testCharacter.isDeleted()).isTrue();
            verify(characterRepository).save(testCharacter);
            verify(nowRepository).deleteByCharacter(testCharacter);
        }
    }
}
