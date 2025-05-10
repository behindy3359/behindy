package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="STA")
public class Station {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="sta_id")
    private long staId;

    @Column(name="sta_name", nullable = false)
    private String staName;

    @Column(name="sta_line", nullable = false)
    private Integer staLine;

    @OneToMany(mappedBy = "station", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Story> stories = new ArrayList<>();

    @OneToMany(mappedBy = "station", orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StationsTr> stationsTrs = new ArrayList<>();
}
