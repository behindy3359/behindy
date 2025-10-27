package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter@Setter@Builder @AllArgsConstructor@NoArgsConstructor
@Table(name="STO",
    indexes = {
        // 역별 스토리 조회 (가장 빈번한 쿼리)
        @Index(name = "idx_story_station_id", columnList = "sta_id"),
        // 테마별 스토리 검색
        @Index(name = "idx_story_theme", columnList = "sto_theme"),
        // 스토리 길이별 필터링 (짧은/중간/긴 스토리)
        @Index(name = "idx_story_length", columnList = "sto_length")
    }
)
public class Story {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="sto_id")
    private Long stoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sta_id")
    private Station station;

    @Column(name="sto_title")
    private String stoTitle;

    @Column(name="sto_length")
    private int stoLength;

    @Column(name="sto_description", columnDefinition = "TEXT")
    private String stoDescription;

    @Column(name="sto_theme")
    private String stoTheme;

    @Column(name="sto_keywords", columnDefinition = "TEXT")
    private String stoKeywords;
}
