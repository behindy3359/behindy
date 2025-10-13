package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorSummaryDto {
    private Long errorId;
    private String service;
    private String message;
    private String stackTrace;
    private LocalDateTime occurredAt;
    private Integer frequency;
}
