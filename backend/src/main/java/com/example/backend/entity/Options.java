package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

// Options, 선택지들의 정보들에 대한 테이블

@Entity
@Getter@Setter@NoArgsConstructor@AllArgsConstructor@Builder
@Table(name = "OPTIONS")
public class Options {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ops_id")
    private long id;

    @Column(name="page_id")
    private long pageId;

    @Column(name="ops_Contents")
    private String opsContents;

    @Column(name="ops_effect")
    private String opsEffect;

    @Column(name = "ops_amount")
    private int opsAmount;
}
