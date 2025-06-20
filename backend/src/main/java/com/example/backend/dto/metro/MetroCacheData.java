package com.example.backend.dto.metro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetroCacheData {

    private String lineNumber;              // 노선 번호
    private List<MetroRealtimeDto> trains;  // 해당 노선의 모든 열차
    private LocalDateTime lastUpdated;      // 마지막 업데이트 시간
    private LocalDateTime nextUpdateTime;   // 다음 업데이트 예정 시간
    private Boolean isHealthy;              // 데이터 건강 상태
    private String dataSource;              // 데이터 출처 (API/CACHE/MOCK)
}