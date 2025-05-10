package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

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
    private long staName;

    @Column(name="sta_line", nullable = false)
    private long staLine;

    @OneToMany(mappedBy = "sta_id", orphanRemoval = true)
    private List<Story> stories = new ArrayList<>();

    @OneToMany(mappedBy = "sta_id", orphanRemoval = true)
    private List<StationsTr> stationsTrs = new ArrayList<>();
}
