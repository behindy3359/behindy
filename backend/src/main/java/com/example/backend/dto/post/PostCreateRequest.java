package com.example.backend.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
// 게시글 작성 요청 DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequest {

    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    @Size(min = 2, max = 100, message = "제목은 2자 이상 100자 이하로 입력해주세요.")
    private String title;

    @NotBlank(message = "내용은 필수 입력 항목입니다.")
    private String content;
}
