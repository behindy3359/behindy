package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="STA")
public class Station {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staId;

    @Column(name = "api_station_id", unique = true)
    private String apiStationId;

    @Column(name = "api_subway_id")
    private String apiSubwayId;

    @Column(name = "sta_name", nullable = false)
    private String staName;

    @Column(name = "sta_line", nullable = false)
    private Integer staLine;

    @Column(name = "sta_line_name")
    private String staLineName;

    @Column(name = "coordinates_x")
    private Double coordinatesX;

    @Column(name = "coordinates_y")
    private Double coordinatesY;

    @OneToMany(mappedBy = "station", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Story> stories = new ArrayList<>();
}