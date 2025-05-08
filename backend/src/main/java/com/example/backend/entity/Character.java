package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Character {

    // 서비스영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "char_id")
    private Long id;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(name = "char_name", nullable = false)
    private Long charName;

    @Column(name = "char_hp", nullable = false)
    private Integer charHealth = 100;

    @Column(name = "char_sant", nullable = false)
    private Integer charSanity = 100;

    // 관리영역
    @CreatedDate
    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
