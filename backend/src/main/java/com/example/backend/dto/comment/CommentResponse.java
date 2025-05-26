package com.example.backend.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private Long postId;
    private String content;
    private String authorName;
    private Long authorId;

    private boolean isEditable;
    private boolean isDeletable;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}