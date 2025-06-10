package com.example.backend.repository;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByValue(String value);
    Optional<RefreshToken> findByUser(Users users);
    void deleteByUser(Users users);
}