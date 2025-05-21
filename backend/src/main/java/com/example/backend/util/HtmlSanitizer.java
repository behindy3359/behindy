package com.example.backend.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizer {

    public String sanitize(String input) {
        if (input == null) {
            return null;
        }
        return Jsoup.clean(input, Safelist.none());
    }

    // 기본 태그만 허용하는 메서드 (필요시)
    public String sanitizeBasic(String input) {
        if (input == null) {
            return null;
        }
        return Jsoup.clean(input, Safelist.basic());
    }
}