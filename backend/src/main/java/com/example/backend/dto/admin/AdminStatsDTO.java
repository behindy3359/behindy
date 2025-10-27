package com.example.backend.dto.admin;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 관리자 대시보드 통계 DTO
 * 읽기 전용, 개인정보 미포함
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {

    // 사용자 통계
    private Long totalUsers;
    private Long activeUsers;           // deleted_at IS NULL
    private Long newUsersToday;
    private Long newUsersThisWeek;

    // 게시글 통계
    private Long totalPosts;
    private Long activePosts;           // deleted_at IS NULL
    private Long newPostsToday;
    private Long newPostsThisWeek;

    // 댓글 통계
    private Long totalComments;
    private Long activeComments;
    private Long newCommentsToday;
    private Long newCommentsThisWeek;

    // AI 스토리 통계
    private Long totalStories;
    private Long storiesGeneratedToday;
    private Long storiesGeneratedThisWeek;

    // 역 통계
    private Long totalStations;
    private Long totalLines;

    // 시스템 정보
    private LocalDateTime serverTime;
    private String serverStatus;        // "HEALTHY", "WARNING", "ERROR"

    /**
     * 서버 상태를 설정하는 편의 메서드
     */
    public void setHealthyStatus() {
        this.serverStatus = "HEALTHY";
    }

    public void setWarningStatus() {
        this.serverStatus = "WARNING";
    }

    public void setErrorStatus() {
        this.serverStatus = "ERROR";
    }
}
