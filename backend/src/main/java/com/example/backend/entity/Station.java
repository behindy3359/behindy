package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Station {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="station_id")
    private long id;

    @Column(name="station_name", nullable = false)
    private long stationName;

    @Column(name="station_line", nullable = false)
    private long stationLine;
}
