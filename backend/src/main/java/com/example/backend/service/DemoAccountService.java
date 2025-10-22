package com.example.backend.service;

import com.example.backend.config.DemoAccountConfig;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * 데모 계정 관리 서비스
 * 배포 시 데모 계정 로그인 세션 해제 (데이터는 유지)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DemoAccountService {

    private final DemoAccountConfig demoAccountConfig;
    private final UserRepository userRepository;
    private final RedisService redisService;

    /**
     * 모든 데모 계정 로그인 세션 해제
     * - Redis Refresh Token만 삭제하여 다른 사용자가 로그인할 수 있게 함
     * - 실제 데이터(캐릭터, 게시글, 댓글 등)는 유지
     */
    @Transactional
    public void releaseAllDemoAccounts() {
        List<DemoAccountConfig.DemoAccount> demoAccounts = demoAccountConfig.getAccounts();

        if (demoAccounts == null || demoAccounts.isEmpty()) {
            log.warn("설정된 데모 계정이 없습니다");
            return;
        }

        int totalReleased = 0;

        for (DemoAccountConfig.DemoAccount demoAccount : demoAccounts) {
            try {
                int released = releaseDemoAccount(demoAccount.getEmail());
                totalReleased += released;
                log.info("✅ 데모 계정 세션 해제 완료: {} ({}개 토큰 삭제)", demoAccount.getEmail(), released);
            } catch (Exception e) {
                log.error("❌ 데모 계정 세션 해제 실패: {} - {}", demoAccount.getEmail(), e.getMessage(), e);
            }
        }

        log.info("🔓 전체 데모 계정 세션 해제 완료: 총 {}개 토큰 삭제", totalReleased);
    }

    /**
     * 특정 데모 계정 로그인 세션 해제
     * Redis Refresh Token만 삭제하여 다른 사용자가 로그인할 수 있게 함
     */
    @Transactional
    public int releaseDemoAccount(String email) {
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("데모 계정을 찾을 수 없습니다: " + email));

        int tokenCount = 0;

        // Redis 토큰 삭제 (로그인 세션 해제)
        try {
            // 먼저 토큰 개수 확인
            Set<String> tokens = redisService.getAllRefreshTokensForUser(String.valueOf(user.getUserId()));
            tokenCount = tokens.size();

            // 모든 Refresh Token 삭제
            redisService.deleteAllRefreshTokensForUser(String.valueOf(user.getUserId()));

            log.debug("  - Redis 토큰 삭제: {}개", tokenCount);
        } catch (Exception e) {
            log.warn("Redis 토큰 삭제 중 오류: {}", e.getMessage());
        }

        return tokenCount;
    }

    /**
     * 데모 계정 목록 조회
     */
    public List<DemoAccountConfig.DemoAccount> getDemoAccounts() {
        return demoAccountConfig.getAccounts();
    }

    /**
     * 이메일이 데모 계정인지 확인
     */
    public boolean isDemoAccount(String email) {
        return demoAccountConfig.getAccounts().stream()
                .anyMatch(account -> account.getEmail().equals(email));
    }
}
