package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter@Setter
@Builder
@NoArgsConstructor@AllArgsConstructor
@Table(name="NOW")
public class Now {

    @Column(name="char_id")
    private long id;

    @Column(name="page_id")
    private long id;
}
