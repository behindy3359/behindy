package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter@Setter@Builder
@AllArgsConstructor@NoArgsConstructor
@Table(name="STO")
public class Story {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="sto_id")
    private Long id;

    @JoinColumn(name = "sta_id")
    @Column(name = "sta_id")
    private Long staId;

    @Column(name="sto_title")
    private String stoTitle;

    @Column(name="sto_length")
    private int stoLength;
}
