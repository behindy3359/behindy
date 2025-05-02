package com.example.backend.entity;

import com.example.backend.security.crypto.TableCryptoConverter;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter@Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class User {

    // 서비스 영역
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Convert(converter = TableCryptoConverter.class)
    private Long id;

    @Column(nullable = false)
    @Convert(converter = TableCryptoConverter.class)
    private String name;

    @Column(nullable = false)
    @Convert(converter = TableCryptoConverter.class)
    private String password;

    @Convert(converter = TableCryptoConverter.class)
    private String email;

    // 관리 영역
    private Boolean isAdmins = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}
