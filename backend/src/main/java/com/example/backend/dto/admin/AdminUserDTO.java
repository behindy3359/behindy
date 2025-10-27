package com.example.backend.dto.admin;

import com.example.backend.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 관리자용 사용자 정보 DTO
 * 개인정보 마스킹 처리
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {

    private Long userId;
    private String userName;            // 마스킹: "홍*동"
    private String userEmail;           // 마스킹: "hong***@gmail.com"
    private Role role;
    private Long postCount;
    private Long commentCount;
    private Long characterCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;  // 추후 구현 시 사용
    private Boolean isDeleted;          // deleted_at != null

    /**
     * 이메일 마스킹 처리
     * 예: "test@example.com" -> "tes***@example.com"
     */
    public static String maskEmail(String email) {
        if (email == null || email.length() < 5) {
            return "***";
        }

        int atIndex = email.indexOf('@');
        if (atIndex < 3) {
            return "***" + email.substring(atIndex);
        }

        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex);

        // 앞 3자만 표시
        String masked = localPart.substring(0, Math.min(3, localPart.length())) + "***";
        return masked + domain;
    }

    /**
     * 이름 마스킹 처리
     * 예: "홍길동" -> "홍*동", "김철수" -> "김*수"
     */
    public static String maskName(String name) {
        if (name == null || name.length() < 2) {
            return "*";
        }

        if (name.length() == 2) {
            return name.charAt(0) + "*";
        }

        // 3자 이상: 첫 글자 + * + 마지막 글자
        return name.charAt(0) + "*" + name.charAt(name.length() - 1);
    }
}
