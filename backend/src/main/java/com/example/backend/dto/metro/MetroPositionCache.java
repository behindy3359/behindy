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
public class MetroPositionCache {
    private Integer lineNumber;              // 노선 번호 (null이면 전체)
    private List<TrainPosition> positions;   // 열차 위치 목록
    private LocalDateTime lastUpdated;       // 마지막 업데이트
    private LocalDateTime nextUpdateTime;    // 다음 업데이트 예정
    private Boolean isHealthy;               // 데이터 상태
    private String dataSource;               // 데이터 출처
}
