package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter@Setter@Builder@NoArgsConstructor@AllArgsConstructor
@Table(name="OPS_LOGB")
public class OpsLogB {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="logb_id")
    private long id;

    @Column(name = "loge_id")
    private long logEId;

    @Column(name="logb_page")
    private long logBPage;
    


}
