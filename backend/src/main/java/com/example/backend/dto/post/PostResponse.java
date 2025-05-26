package com.example.backend.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
// 게시글 응답 DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id; // 게시글 식별번호
    private String title;
    private String content;
    private String authorName;
    private Long authorId;

//    private Long postX;
//    private Long postY;

    private boolean isEditable;  // 현재 사용자가 수정 가능한지
    private boolean isDeletable; // 현재 사용자가 삭제 가능한지

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
