package com.example.backend.dto.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse {
    private Long pageId;
    private Long pageNumber;
    private String content;
    private List<OptionResponse> options;
    private boolean isLastPage;
    private Integer totalPages;
}
