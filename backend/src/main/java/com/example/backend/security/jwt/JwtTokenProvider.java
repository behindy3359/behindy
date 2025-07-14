// AuthService.java 수정 사항도 포함

package com.example.backend.security.jwt;

import com.example.backend.security.user.CustomUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, accessTokenValidity, "ACCESS");
    }

    public String generateRefreshToken(Authentication authentication) {
        return generateToken(authentication, refreshTokenValidity, "REFRESH");
    }

    // 🔄 수정: 토큰 타입 구분 추가
    private String generateToken(Authentication authentication, long validity, String tokenType) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validity);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userDetails.getId());
        claims.put("email", userDetails.getEmail());
        claims.put("name", userDetails.getName());
        claims.put("type", tokenType); // 🎯 토큰 타입 추가
        claims.put("iat", now.getTime() / 1000); // 발급 시간 추가

        // 🎯 리프레시 토큰의 경우 추가 정보 제한
        if ("REFRESH".equals(tokenType)) {
            // 리프레시 토큰에는 최소한의 정보만 포함
            claims = new HashMap<>();
            claims.put("id", userDetails.getId());
            claims.put("type", tokenType);
            claims.put("iat", now.getTime() / 1000);
        }

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getId().toString()) // subject 명시적 설정
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("id", Long.class);
    }

    // 🎯 토큰 타입 확인 메서드 추가
    public String getTokenType(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("type", String.class);
        } catch (Exception e) {
            log.error("토큰 타입 확인 실패: {}", e.getMessage());
            return null;
        }
    }

    // 🎯 액세스 토큰 검증
    public boolean validateAccessToken(String token) {
        return validateToken(token) && "ACCESS".equals(getTokenType(token));
    }

    // 🎯 리프레시 토큰 검증
    public boolean validateRefreshToken(String token) {
        return validateToken(token) && "REFRESH".equals(getTokenType(token));
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }

    public Date getExpirationDateFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    // 🎯 토큰 정보 조회 (디버깅용)
    public Map<String, Object> getTokenInfo(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Map<String, Object> info = new HashMap<>();
            info.put("userId", claims.get("id"));
            info.put("type", claims.get("type"));
            info.put("issuedAt", claims.getIssuedAt());
            info.put("expiration", claims.getExpiration());
            info.put("subject", claims.getSubject());

            return info;
        } catch (Exception e) {
            log.error("토큰 정보 조회 실패: {}", e.getMessage());
            return Map.of("error", e.getMessage());
        }
    }
}