package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter@Setter@Builder @NoArgsConstructor@AllArgsConstructor
@Table(name="PAGE")
public class Page {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="page_id")
    private long id;

    @Column(name="sto_id")
    private long stoId;

    @Column(name="page_number")
    private long pageNumber;

    @Column(name="page_contents", columnDefinition = "TEXT")
    private String contents;
}
