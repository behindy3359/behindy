package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="STA",
    indexes = {
        // API ID로 조회 (이미 unique 제약이 있지만 명시적 인덱스)
        @Index(name = "idx_station_api_id", columnList = "api_station_id", unique = true),
        // 노선별 역 조회 (1호선, 2호선 등)
        @Index(name = "idx_station_line", columnList = "sta_line"),
        // 역명 검색 (LIKE 쿼리 최적화)
        @Index(name = "idx_station_name", columnList = "sta_name"),
        // 복합 인덱스: 노선별 역명 정렬
        @Index(name = "idx_station_line_name", columnList = "sta_line, sta_name")
    }
)
public class Station {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staId;

    @Column(name = "api_station_id", unique = true)
    private String apiStationId;

    @Column(name = "sta_name", nullable = false)
    private String staName;

    @Column(name = "sta_line", nullable = false)
    private Integer staLine;

    @OneToMany(mappedBy = "station", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Story> stories = new ArrayList<>();
}