package com.example.backend.service.mapper;

import com.example.backend.dto.character.CharacterResponse;
import com.example.backend.dto.comment.CommentResponse;
import com.example.backend.dto.game.OptionResponse;
import com.example.backend.dto.game.PageResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.dto.post.PostResponse;
import com.example.backend.entity.*;
import com.example.backend.entity.Character;
import com.example.backend.repository.NowRepository;
import com.example.backend.repository.OptionsRepository;
import com.example.backend.repository.PageRepository;
import com.example.backend.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 🎯 공통 Entity → DTO 변환 Mapper
 *
 * 기존 중복 제거:
 * - PostService.mapToPostResponse()
 * - CommentService.mapToCommentResponse()
 * - StoryService.mapToStoryResponse()
 * - CharacterService.mapToCharacterResponse()
 * - GameService.createPageResponse()
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EntityDtoMapper {

    private final OptionsRepository optionsRepository;
    private final PageRepository pageRepository;
    private final NowRepository nowRepository;

    // ===== POST 관련 변환 =====

    /**
     * Post → PostResponse 변환
     * 기존: PostService.mapToPostResponse() 대체
     */
    public PostResponse toPostResponse(Post post) {
        if (post == null) {
            return null;
        }

        User currentUser = getCurrentUserSafely();
        boolean isOwner = isOwner(currentUser, post.getUser());

        return PostResponse.builder()
                .id(post.getPostId())
                .title(post.getPostTitle())
                .content(post.getPostContents())
                .authorName(post.getUser().getUserName())
                .authorId(post.getUser().getUserId())
                .viewCount(post.getViewCount())
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .isEditable(isOwner)
                .isDeletable(isOwner)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    // ===== COMMENT 관련 변환 =====

    /**
     * Comment → CommentResponse 변환
     * 기존: CommentService.mapToCommentResponse() 대체
     */
    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) {
            return null;
        }

        User currentUser = getCurrentUserSafely();
        boolean isOwner = isOwner(currentUser, comment.getUser());

        return CommentResponse.builder()
                .id(comment.getCmtId())
                .postId(comment.getPost().getPostId())
                .content(comment.getCmtContents())
                .authorName(comment.getUser().getUserName())
                .authorId(comment.getUser().getUserId())
                .isEditable(isOwner)
                .isDeletable(isOwner)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    // ===== CHARACTER 관련 변환 =====

    /**
     * Character → CharacterResponse 변환
     * 기존: CharacterService.mapToCharacterResponse() 대체
     */
    public CharacterResponse toCharacterResponse(com.example.backend.entity.Character character) {
        if (character == null) {
            return null;
        }

        boolean isAlive = !character.isDeleted();
        boolean isDying = isAlive && (character.getCharHealth() <= 20 || character.getCharSanity() <= 20);
        String statusMessage = getCharacterStatusMessage(character);

        // 게임 진행 상태 확인
        boolean hasGameProgress = false;
        Long currentStoryId = null;

        try {
            Optional<Now> gameProgress = nowRepository.findByCharacter(character);
            if (gameProgress.isPresent()) {
                hasGameProgress = true;
                currentStoryId = gameProgress.get().getPage().getStoId();
            }
        } catch (Exception e) {
            // Silently handle game progress check errors
        }

        return CharacterResponse.builder()
                .charId(character.getCharId())
                .charName(character.getCharName())
                .charHealth(character.getCharHealth())
                .charSanity(character.getCharSanity())
                .userId(character.getUser().getUserId())
                .userName(character.getUser().getUserName())
                .isAlive(isAlive)
                .isDying(isDying)
                .statusMessage(statusMessage)
                .hasGameProgress(hasGameProgress)
                .currentStoryId(currentStoryId)
                .createdAt(character.getCreatedAt())
                .updatedAt(character.getUpdatedAt())
                .deletedAt(character.getDeletedAt())
                .build();
    }

    // ===== STORY 관련 변환 =====

    /**
     * Story → StoryResponse 변환
     * 기존: StoryService.mapToStoryResponse() 대체
     */
    public StoryResponse toStoryResponse(Story story) {
        if (story == null) {
            return null;
        }

        // 플레이 가능 여부 확인
        boolean canPlay = canPlayStory(story.getStoId());
        String playStatus = determinePlayStatus(story.getStoId(), canPlay);
        String difficulty = determineDifficulty(story.getStoLength());
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

    // ===== GAME/PAGE 관련 변환 =====

    /**
     * Page → PageResponse 변환
     * 기존: GameService.createPageResponse() 대체
     */
    public PageResponse toPageResponse(Page page) {
        if (page == null) {
            return null;
        }

        List<Options> options = optionsRepository.findByPageId(page.getPageId());
        List<OptionResponse> optionResponses = options.stream()
                .map(this::toOptionResponse)
                .collect(Collectors.toList());

        // 전체 페이지 수 조회
        Long totalPages = pageRepository.countPagesByStoryId(page.getStoId());

        // 마지막 페이지 여부 확인
        long nextPageNumber = page.getPageNumber() + 1;
        boolean isLastPage = !pageRepository.existsNextPage(page.getStoId(), nextPageNumber);

        return PageResponse.builder()
                .pageId(page.getPageId())
                .pageNumber(page.getPageNumber())
                .content(page.getPageContents())
                .options(optionResponses)
                .isLastPage(isLastPage)
                .totalPages(totalPages.intValue())
                .build();
    }

    /**
     * Options → OptionResponse 변환
     */
    public OptionResponse toOptionResponse(Options option) {
        if (option == null) {
            return null;
        }

        return OptionResponse.builder()
                .optionId(option.getOptId())
                .content(option.getOptContents())
                .effect(option.getOptEffect())
                .amount(option.getOptAmount())
                .effectPreview(createEffectPreview(option))
                .build();
    }

    // ===== 공통 유틸리티 메서드들 =====

    /**
     * 현재 로그인한 사용자 조회 (안전)
     */
    private User getCurrentUserSafely() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                // 실제로는 UserRepository에서 조회해야 하지만, 여기서는 기본 정보만 사용
                User user = new User();
                user.setUserId(userDetails.getId());
                user.setUserName(userDetails.getName());
                user.setUserEmail(userDetails.getEmail());
                return user;
            }
        } catch (Exception e) {
            // Silently handle user retrieval errors
        }
        return null;
    }

    /**
     * 소유권 확인
     */
    private boolean isOwner(User currentUser, User owner) {
        if (currentUser == null || owner == null) {
            return false;
        }
        return currentUser.getUserId().equals(owner.getUserId());
    }

    /**
     * 캐릭터 상태 메시지 생성
     */
    private String getCharacterStatusMessage(Character character) {
        if (character.isDeleted()) {
            return "사망";
        }

        if (character.getCharHealth() <= 0 || character.getCharSanity() <= 0) {
            return "위험 - 즉시 치료 필요";
        }

        if (character.getCharHealth() <= 20 || character.getCharSanity() <= 20) {
            return "주의 - 상태가 좋지 않음";
        }

        if (character.getCharHealth() >= 80 && character.getCharSanity() >= 80) {
            return "건강";
        }

        return "보통";
    }

    /**
     * 스토리 플레이 가능 여부 확인
     */
    private boolean canPlayStory(Long storyId) {
        try {
            User currentUser = getCurrentUserSafely();
            if (currentUser == null) {
                return false;
            }

            // 간단한 체크 로직 (실제로는 CharacterService 로직 사용)
            return true; // 임시로 true 반환
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 플레이 상태 결정
     */
    private String determinePlayStatus(Long storyId, boolean canPlay) {
        try {
            User currentUser = getCurrentUserSafely();
            if (currentUser == null) {
                return "로그인 필요";
            }

            if (!canPlay) {
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
     * 노선에 따른 테마 결정
     */
    private String determineTheme(Integer lineNumber) {
        return switch (lineNumber) {
            case 1 -> "공포";
            case 2 -> "로맨스";
            case 3 -> "미스터리";
            case 4 -> "모험";
            case 5 -> "스릴러";
            case 6 -> "코미디";
            case 7 -> "판타지";
            case 8 -> "SF";
            case 9 -> "드라마";
            default -> "일반";
        };
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
                story.getStoLength() * 2,
                difficulty);
    }

    /**
     * 선택지 효과 미리보기 생성
     */
    private String createEffectPreview(Options option) {
        if (option.getOptEffect() == null || option.getOptAmount() == 0) {
            return null;
        }

        String effectType = option.getOptEffect().toLowerCase();
        int amount = option.getOptAmount();

        return switch (effectType) {
            case "health" -> amount > 0 ?
                    String.format("체력 +%d", amount) :
                    String.format("체력 %d", amount);
            case "sanity" -> amount > 0 ?
                    String.format("정신력 +%d", amount) :
                    String.format("정신력 %d", amount);
            default -> null;
        };
    }
}