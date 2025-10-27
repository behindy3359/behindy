package com.example.backend.service.admin;

import com.example.backend.dto.admin.AdminStatsDTO;
import com.example.backend.dto.admin.AdminUserDTO;
import com.example.backend.entity.User;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자 대시보드 서비스
 * 읽기 전용 - 통계 및 조회 기능만 제공
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final StoryRepository storyRepository;
    private final StationRepository stationRepository;
    private final CharacterRepository characterRepository;

    /**
     * 전체 통계 조회
     */
    public AdminStatsDTO getStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minusDays(7);

        AdminStatsDTO stats = AdminStatsDTO.builder()
                // 사용자 통계
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByDeletedAtIsNull())
                .newUsersToday(userRepository.countByCreatedAtAfter(todayStart))
                .newUsersThisWeek(userRepository.countByCreatedAtAfter(weekStart))

                // 게시글 통계
                .totalPosts(postRepository.count())
                .activePosts(postRepository.countByDeletedAtIsNull())
                .newPostsToday(postRepository.countByCreatedAtAfter(todayStart))
                .newPostsThisWeek(postRepository.countByCreatedAtAfter(weekStart))

                // 댓글 통계
                .totalComments(commentRepository.count())
                .activeComments(commentRepository.countByDeletedAtIsNull())
                .newCommentsToday(commentRepository.countByCreatedAtAfter(todayStart))
                .newCommentsThisWeek(commentRepository.countByCreatedAtAfter(weekStart))

                // AI 스토리 통계
                .totalStories(storyRepository.count())
                // Story 엔티티에 createdAt이 없으므로 임시로 0 설정
                .storiesGeneratedToday(0L)
                .storiesGeneratedThisWeek(0L)

                // 역 통계
                .totalStations(stationRepository.count())
                .totalLines(stationRepository.countDistinctStaLine())

                // 시스템 정보
                .serverTime(now)
                .build();

        // 서버 상태 판정 (간단한 로직)
        if (stats.getActiveUsers() > 0 && stats.getActivePosts() > 0) {
            stats.setHealthyStatus();
        } else {
            stats.setWarningStatus();
        }

        log.info("Admin stats retrieved: {} active users, {} active posts",
                stats.getActiveUsers(), stats.getActivePosts());

        return stats;
    }

    /**
     * 사용자 목록 조회 (페이징)
     * 개인정보 마스킹 처리
     */
    public Page<AdminUserDTO> getUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);

        return users.map(user -> AdminUserDTO.builder()
                .userId(user.getUserId())
                .userName(AdminUserDTO.maskName(user.getUserName()))
                .userEmail(AdminUserDTO.maskEmail(user.getUserEmail()))
                .role(user.getRole())
                .postCount((long) user.getPosts().size())
                .commentCount((long) user.getComments().size())
                .characterCount((long) user.getCharacters().size())
                .createdAt(user.getCreatedAt())
                .isDeleted(user.getDeletedAt() != null)
                .build());
    }

    /**
     * 최근 활동 사용자 조회 (Top 10)
     */
    public List<AdminUserDTO> getRecentActiveUsers() {
        // 최근 7일간 게시글이나 댓글을 작성한 사용자
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        List<User> activeUsers = userRepository.findTop10ByDeletedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(weekStart);

        return activeUsers.stream()
                .map(user -> AdminUserDTO.builder()
                        .userId(user.getUserId())
                        .userName(AdminUserDTO.maskName(user.getUserName()))
                        .userEmail(AdminUserDTO.maskEmail(user.getUserEmail()))
                        .role(user.getRole())
                        .postCount((long) user.getPosts().size())
                        .commentCount((long) user.getComments().size())
                        .createdAt(user.getCreatedAt())
                        .isDeleted(false)
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 관리자 권한 확인
     */
    public boolean isAdmin(User user) {
        return user != null && user.getRole() != null
                && user.getRole().name().equals("ROLE_ADMIN");
    }
}
