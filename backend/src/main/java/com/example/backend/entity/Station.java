package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

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
}
