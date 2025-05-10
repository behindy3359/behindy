package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter@Setter@Builder @NoArgsConstructor@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "LOGE")
public class LogE {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "loge_id")
    private Long logeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "char_id")
    @Column(name = "char_id")
    private Long charId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sto_id")
    @Column(name = "sto_id")
    private Long stoId;

    @Column(name = "loge_result")
    private String logeResult;

    @Column(name = "loge_ending")
    private int logeEnding;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "loge_id", orphanRemoval = true)
    private List<OpsLogB> OpsLogBs = new ArrayList<>();
}
