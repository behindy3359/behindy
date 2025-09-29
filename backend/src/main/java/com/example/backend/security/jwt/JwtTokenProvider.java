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

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${JWT_ACCESS_VALIDITY:900000}")
    private long accessTokenValidity;

    @Value("${JWT_REFRESH_VALIDITY:604800000}")
    private long refreshTokenValidity;

    private Key key;
    private final SecureRandom secureRandom = new SecureRandom();
    private static final int MIN_HS512_KEY_BYTES = 64;

    @PostConstruct
    public void init() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("JWT secret key must be provided");
        }

        byte[] keyBytes = resolveKeyBytes(secretKey);

        if (keyBytes.length < MIN_HS512_KEY_BYTES) {
            throw new IllegalStateException("JWT secret key must be at least " + MIN_HS512_KEY_BYTES + " bytes after decoding");
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] resolveKeyBytes(String candidate) {
        byte[] rawBytes = candidate.getBytes(StandardCharsets.UTF_8);
        byte[] decodedBytes = decodeBase64(candidate);

        if (decodedBytes.length >= MIN_HS512_KEY_BYTES) {
            return decodedBytes;
        }

        return rawBytes;
    }

    private byte[] decodeBase64(String candidate) {
        try {
            return Base64.getDecoder().decode(candidate);
        } catch (IllegalArgumentException ignored) {
            return new byte[0];
        }
    }

    /**
     * Access Token 생성 - 짧은 수명, 많은 정보 포함
     */
    public String generateAccessToken(Authentication authentication) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenValidity);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userDetails.getId());
        claims.put("email", userDetails.getEmail());
        claims.put("name", userDetails.getName());
        claims.put("type", "ACCESS");
        claims.put("iat", now.getTime() / 1000);
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toList());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getId().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Refresh Token 생성 - 긴 수명, 최소 정보만 포함, 랜덤 요소 추가
     */
    public String generateRefreshToken(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenValidity);

        // 랜덤 요소 추가로 각 토큰을 고유하게 만듦
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String jti = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "REFRESH");
        claims.put("jti", jti); // JWT ID로 고유성 보장
        claims.put("iat", now.getTime() / 1000);

        return Jwts.builder()
                .setClaims(claims)
                .setId(jti)
                .setSubject(userId.toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userId", Long.class);
    }

    /**
     * 토큰에서 JTI(JWT ID) 추출
     */
    public String getJtiFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("jti", String.class);
        } catch (Exception e) {
            log.error("JTI 추출 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 토큰 타입 확인
     */
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

    /**
     * Access Token 전용 검증
     */
    public boolean validateAccessToken(String token) {
        return validateToken(token) && "ACCESS".equals(getTokenType(token));
    }

    /**
     * Refresh Token 전용 검증
     */
    public boolean validateRefreshToken(String token) {
        return validateToken(token) && "REFRESH".equals(getTokenType(token));
    }

    /**
     * 기본 토큰 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("잘못된 JWT 토큰 형식: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("만료된 JWT 토큰: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("지원되지 않는 JWT 토큰: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT 클레임이 비어있음: {}", ex.getMessage());
        } catch (Exception ex) {
            log.error("JWT 토큰 검증 실패: {}", ex.getMessage());
        }
        return false;
    }

    /**
     * 토큰 만료 시간 조회
     */
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    /**
     * 토큰이 곧 만료되는지 확인 (5분 이내)
     */
    public boolean isTokenExpiringSoon(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            Date now = new Date();
            return expiration.getTime() - now.getTime() < (5 * 60 * 1000); // 5분
        } catch (Exception e) {
            return true; // 에러 시 갱신 필요로 간주
        }
    }

    /**
     * 토큰 정보 조회 (디버깅용)
     */
    public Map<String, Object> getTokenInfo(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Map<String, Object> info = new HashMap<>();
            info.put("userId", claims.get("userId"));
            info.put("type", claims.get("type"));
            info.put("jti", claims.get("jti"));
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
