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
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Long authorId;

//    private Long postX;
//    private Long postY;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
