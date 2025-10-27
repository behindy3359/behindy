package com.example.backend.controller.admin;

import com.example.backend.dto.admin.AdminStatsDTO;
import com.example.backend.dto.admin.AdminUserDTO;
import com.example.backend.entity.User;
import com.example.backend.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 대시보드 API
 * 읽기 전용 - ROLE_ADMIN만 접근 가능
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    /**
     * 전체 통계 조회
     * GET /api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal User user) {
        // 권한 확인
        if (!adminService.isAdmin(user)) {
            log.warn("Unauthorized admin access attempt by user: {}", user != null ? user.getUserId() : "null");
            return ResponseEntity.status(403).body("관리자 권한이 필요합니다.");
        }

        AdminStatsDTO stats = adminService.getStats();
        log.info("Admin stats retrieved by user: {}", user.getUserId());
        return ResponseEntity.ok(stats);
    }

    /**
     * 사용자 목록 조회 (페이징)
     * GET /api/admin/users?page=0&size=20
     */
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // 권한 확인
        if (!adminService.isAdmin(user)) {
            log.warn("Unauthorized admin access attempt by user: {}", user != null ? user.getUserId() : "null");
            return ResponseEntity.status(403).body("관리자 권한이 필요합니다.");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminUserDTO> users = adminService.getUsers(pageable);

        log.info("Admin users list retrieved by user: {} (page: {}, size: {})",
                user.getUserId(), page, size);

        return ResponseEntity.ok(users);
    }

    /**
     * 최근 활동 사용자 조회 (Top 10)
     * GET /api/admin/users/recent
     */
    @GetMapping("/users/recent")
    public ResponseEntity<?> getRecentActiveUsers(@AuthenticationPrincipal User user) {
        // 권한 확인
        if (!adminService.isAdmin(user)) {
            log.warn("Unauthorized admin access attempt by user: {}", user != null ? user.getUserId() : "null");
            return ResponseEntity.status(403).body("관리자 권한이 필요합니다.");
        }

        List<AdminUserDTO> recentUsers = adminService.getRecentActiveUsers();
        log.info("Recent active users retrieved by user: {}", user.getUserId());

        return ResponseEntity.ok(recentUsers);
    }

    /**
     * 관리자 권한 확인
     * GET /api/admin/check
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkAdminAuth(@AuthenticationPrincipal User user) {
        boolean isAdmin = adminService.isAdmin(user);

        if (isAdmin) {
            log.info("Admin auth check: user {} is admin", user.getUserId());
            return ResponseEntity.ok().body(new AdminCheckResponse(true, "관리자 권한 확인"));
        } else {
            log.info("Admin auth check: user {} is not admin", user != null ? user.getUserId() : "null");
            return ResponseEntity.ok().body(new AdminCheckResponse(false, "관리자 권한 없음"));
        }
    }

    /**
     * 관리자 권한 확인 응답 DTO
     */
    private record AdminCheckResponse(boolean isAdmin, String message) {
    }
}
