package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

// Options, 선택지들의 정보들에 대한 테이블

@Entity
@Getter@Setter@NoArgsConstructor@AllArgsConstructor@Builder
@Table(name = "OPTIONS")
public class Options {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="opt_id")
    private long optId;

    @Column(name="page_id")
    private long pageId;

    @Column(name="opt_Contents")
    private String optContents;

    @Column(name="opt_effect")
    private String optEffect;

    @Column(name = "opt_amount")
    private int optAmount;

    @OneToMany(mappedBy = "opt_id", orphanRemoval = true)
    private List<LogO> logOS = new ArrayList<>();
}
