package com.example.backend.dto.metro;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RealtimePositionResponse {

    // === 정상 응답용 필드 ===
    @JsonProperty("realtimePositionList")
    private List<RealtimePositionInfo> realtimePositionList;

    @JsonProperty("errorMessage")
    private MetroErrorMessage metroErrorMessage;

    // === 직접 에러 응답용 필드 ===
    @JsonProperty("status")
    private Integer directStatus;

    @JsonProperty("code")
    private String directCode;

    @JsonProperty("message")
    private String directMessage;

    @JsonProperty("link")
    private String directLink;

    @JsonProperty("developerMessage")
    private String directDeveloperMessage;

    @JsonProperty("total")
    private Integer directTotal;

    // === 유틸리티 메서드 ===

    /**
     * 직접 에러 응답인지 확인
     * 예: {"status":500,"message":"해당하는 데이터가 없습니다."}
     */
    public boolean isDirectError() {
        return directStatus != null && directStatus != 200;
    }

    /**
     * 래퍼 에러 응답인지 확인
     * 예: {"errorMessage":{"status":400,"message":"..."}}
     */
    public boolean isWrapperError() {
        return metroErrorMessage != null &&
                (metroErrorMessage.getStatus() == null || metroErrorMessage.getStatus() != 200);
    }

    /**
     * 어떤 형태든 에러인지 확인
     */
    public boolean isAnyError() {
        return isDirectError() || isWrapperError();
    }

    /**
     * 데이터가 비어있는지 확인
     */
    public boolean isEmpty() {
        return realtimePositionList == null || realtimePositionList.isEmpty();
    }

    /**
     * Mock 데이터 생성이 필요한지 확인
     */
    public boolean needsMockData() {
        return isAnyError() || isEmpty();
    }

    /**
     * 통합 에러 메시지 반환
     */
    public String getUnifiedErrorMessage() {
        // 직접 에러 메시지 우선
        if (directMessage != null && !directMessage.trim().isEmpty()) {
            return directMessage;
        }

        // 래퍼 에러 메시지
        if (metroErrorMessage != null && metroErrorMessage.getMessage() != null) {
            return metroErrorMessage.getMessage();
        }

        return "알 수 없는 오류";
    }

    /**
     * 통합 상태 코드 반환
     */
    public Integer getUnifiedStatus() {
        if (directStatus != null) {
            return directStatus;
        }

        if (metroErrorMessage != null && metroErrorMessage.getStatus() != null) {
            return metroErrorMessage.getStatus();
        }

        return null;
    }

    /**
     * 디버깅용 요약 정보
     */
    public String getDebugSummary() {
        if (isDirectError()) {
            return String.format("DirectError[%d]: %s", directStatus, directMessage);
        }

        if (isWrapperError()) {
            return String.format("WrapperError[%d]: %s",
                    metroErrorMessage.getStatus(), metroErrorMessage.getMessage());
        }

        if (isEmpty()) {
            return "Success but Empty Data";
        }

        return String.format("Success with %d trains",
                realtimePositionList != null ? realtimePositionList.size() : 0);
    }
}