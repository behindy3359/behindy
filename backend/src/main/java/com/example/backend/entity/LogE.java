package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Entity
@Getter@Setter@Builder
@NoArgsConstructor@AllArgsConstructor
@Table(name = "LOGE")
public class LogE {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "loge_id")
    private Long id;

    @Column(name = "char_id")
    private Long charId;

    @Column(name = "sto_id")
    private Long stoId;

    @Column(name = "loge_result")
    private String logEResult;

    @Column(name = "loge_endpage")
    private int logEEndpage;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;
}
