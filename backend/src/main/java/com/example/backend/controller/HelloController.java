package com.example.backend.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello from Backend";
    }

    /**
     * CSRF 토큰을 클라이언트에 제공하는 엔드포인트
     * Spring Security가 자동으로 CsrfToken 객체를 주입
     */
    @GetMapping("/api/csrf-token")
    public Map<String, String> getCsrfToken(CsrfToken csrfToken) {
        Map<String, String> response = new HashMap<>();
        if (csrfToken != null) {
            response.put("token", csrfToken.getToken());
            response.put("headerName", csrfToken.getHeaderName());
            response.put("parameterName", csrfToken.getParameterName());
        }
        return response;
    }
}