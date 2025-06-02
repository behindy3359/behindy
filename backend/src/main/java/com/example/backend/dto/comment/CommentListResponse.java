package com.example.backend.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentListResponse {
    private List<CommentListResponse> coments;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
