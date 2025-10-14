package com.example.backend.exception;

import com.example.backend.dto.auth.ApiResponse;
import com.example.backend.entity.OpsLogX;
import com.example.backend.repository.OpsLogXRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.io.PrintWriter;
import java.io.StringWriter;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final OpsLogXRepository opsLogXRepository;

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.warn("접근 권한 오류: {}", ex.getMessage());
        saveErrorLog("AccessDeniedException", ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.builder()
                        .success(false)
                        .message("접근 권한이 없습니다: " + ex.getMessage())
                        .build());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        log.warn("리소스 찾을 수 없음: {}", ex.getMessage());
        // ResourceNotFoundException은 정상적인 비즈니스 로직의 일부이므로 로그 저장하지 않음

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        log.warn("잘못된 인자: {}", ex.getMessage());
        saveErrorLog("IllegalArgumentException", ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.builder()
                        .success(false)
                        .message("잘못된 요청: " + ex.getMessage())
                        .build());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
        log.warn("잘못된 상태: {}", ex.getMessage());
        saveErrorLog("IllegalStateException", ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex, WebRequest request) {
        log.error("예상치 못한 오류 발생", ex);
        saveErrorLog("Exception", ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.builder()
                        .success(false)
                        .message("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
                        .build());
    }

    /**
     * 에러 로그를 OpsLogX에 저장
     */
    private void saveErrorLog(String serviceName, String message, Exception ex) {
        try {
            String stackTrace = getStackTraceAsString(ex);

            // 스택 트레이스가 너무 길면 자르기 (10000자 제한)
            if (stackTrace.length() > 10000) {
                stackTrace = stackTrace.substring(0, 10000) + "... (truncated)";
            }

            OpsLogX errorLog = OpsLogX.builder()
                    .logxService(serviceName)
                    .logxMessage(message != null ? message : "No message")
                    .logxStktrace(stackTrace)
                    .build();

            opsLogXRepository.save(errorLog);
        } catch (Exception e) {
            // 에러 로그 저장 실패가 원래 요청 처리를 방해하지 않도록 예외를 삼킴
            log.error("에러 로그 저장 실패", e);
        }
    }

    /**
     * 예외의 스택 트레이스를 문자열로 변환
     */
    private String getStackTraceAsString(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        return sw.toString();
    }
}