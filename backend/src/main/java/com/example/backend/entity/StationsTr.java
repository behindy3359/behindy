package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter@Setter @Builder@NoArgsConstructor@AllArgsConstructor
@Table(name="TRA")
public class StationsTr {

    @Id@GeneratedValue(strategy = GenerationType.AUTO )
    @Column(name="tr_id")
    private long id;

    @Column(name="station_id")
    private long stationId;

    @Column(name="tr_day")
    private String trafficDay;

    @Column(name="tr_time")
    private String trafficTime;

    @Column(name="tr_traffic")
    private String trafficTraffic;
}
