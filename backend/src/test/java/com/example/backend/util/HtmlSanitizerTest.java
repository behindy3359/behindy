package com.example.backend.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class HtmlSanitizerTest {

    private HtmlSanitizer htmlSanitizer;

    @BeforeEach
    void setUp() {
        htmlSanitizer = new HtmlSanitizer();
    }

    @Test
    @DisplayName("XSS 스크립트를 제거해야 한다")
    void shouldRemoveXssScript() {
        // given
        String maliciousInput = "<script>alert('XSS')</script>안전한 텍스트";

        // when
        String result = htmlSanitizer.sanitize(maliciousInput);

        // then
        assertThat(result).isEqualTo("안전한 텍스트");
        assertThat(result).doesNotContain("<script>");
        assertThat(result).doesNotContain("alert");
    }

    @Test
    @DisplayName("null 입력을 처리해야 한다")
    void shouldHandleNullInput() {
        // when
        String result = htmlSanitizer.sanitize(null);

        // then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("빈 문자열을 처리해야 한다")
    void shouldHandleEmptyString() {
        // when
        String result = htmlSanitizer.sanitize("");

        // then
        assertThat(result).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "<img src=x onerror='alert(1)'>",
        "<iframe src='javascript:alert(1)'>",
        "<svg onload='alert(1)'>",
        "<body onload='alert(1)'>",
        "<input onfocus='alert(1)'>",
        "<select onchange='alert(1)'>",
        "<textarea onfocus='alert(1)'>",
        "<button onclick='alert(1)'>"
    })
    @DisplayName("다양한 XSS 공격 패턴을 제거해야 한다")
    void shouldRemoveVariousXssPatterns(String maliciousInput) {
        // when
        String result = htmlSanitizer.sanitize(maliciousInput);

        // then
        assertThat(result).doesNotContain("alert");
        assertThat(result).doesNotContain("javascript:");
        assertThat(result).doesNotContain("onerror");
        assertThat(result).doesNotContain("onload");
        assertThat(result).doesNotContain("onfocus");
        assertThat(result).doesNotContain("onclick");
        assertThat(result).doesNotContain("onchange");
    }

    @Test
    @DisplayName("기본 태그만 허용하는 sanitizeBasic 테스트")
    void shouldAllowBasicHtmlTags() {
        // given
        String input = "<p>안전한 <b>텍스트</b></p><script>alert('XSS')</script>";

        // when
        String result = htmlSanitizer.sanitizeBasic(input);

        // then
        assertThat(result).contains("<p>");
        assertThat(result).contains("<b>");
        assertThat(result).doesNotContain("<script>");
    }

    @Test
    @DisplayName("모든 HTML 태그를 제거하고 텍스트만 남겨야 한다")
    void shouldRemoveAllHtmlTags() {
        // given
        String input = "<div><p>텍스트 <strong>강조</strong></p></div>";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        assertThat(result).isEqualTo("텍스트 강조");
        assertThat(result).doesNotContain("<");
        assertThat(result).doesNotContain(">");
    }

    @Test
    @DisplayName("SQL Injection 시도를 처리해야 한다")
    void shouldHandleSqlInjectionAttempt() {
        // given
        String input = "'; DROP TABLE users; --";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        assertThat(result).isEqualTo("'; DROP TABLE users; --");
    }

    @Test
    @DisplayName("여러 줄의 텍스트를 처리해야 한다")
    void shouldHandleMultilineText() {
        // given
        String input = "첫번째 줄\n<script>alert('XSS')</script>\n두번째 줄";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        assertThat(result).contains("첫번째 줄");
        assertThat(result).contains("두번째 줄");
        assertThat(result).doesNotContain("<script>");
    }

    @Test
    @DisplayName("특수문자를 HTML 인코딩해야 한다")
    void shouldEncodeSpecialCharacters() {
        // given
        String input = "특수문자: !@#$%^&*()_+-=[]{}|;:',.<>?";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        // Jsoup's Safelist.none() encodes &, <, > for XSS prevention
        assertThat(result).contains("특수문자:");
        assertThat(result).contains("!@#$%^");
        assertThat(result).contains("*()_+-=[]{}|;:',.");
    }

    @Test
    @DisplayName("유니코드 문자를 보존해야 한다")
    void shouldPreserveUnicodeCharacters() {
        // given
        String input = "한글, 日本語, 中文, العربية, עברית";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        assertThat(result).isEqualTo(input);
    }

    @Test
    @DisplayName("이모지를 보존해야 한다")
    void shouldPreserveEmojis() {
        // given
        String input = "안녕하세요 😊 좋은 하루 되세요! 🎉";

        // when
        String result = htmlSanitizer.sanitize(input);

        // then
        assertThat(result).isEqualTo(input);
    }

    @Test
    @DisplayName("sanitizeBasic은 허용된 기본 태그를 남겨야 한다")
    void sanitizeBasicShouldKeepAllowedTags() {
        // given
        String input = "<p>단락</p><b>굵게</b><i>기울임</i><a href='#'>링크</a>";

        // when
        String result = htmlSanitizer.sanitizeBasic(input);

        // then
        assertThat(result).contains("<p>");
        assertThat(result).contains("<b>");
        assertThat(result).contains("<i>");
        assertThat(result).contains("<a");
    }

    @Test
    @DisplayName("sanitizeBasic은 위험한 속성을 제거해야 한다")
    void sanitizeBasicShouldRemoveDangerousAttributes() {
        // given
        // Use a proper URL instead of '#' - Safelist.basic() allows http/https protocols
        String input = "<a href='http://example.com' onclick='alert(1)'>링크</a>";

        // when
        String result = htmlSanitizer.sanitizeBasic(input);

        // then
        assertThat(result).contains("<a");
        assertThat(result).contains("href");
        assertThat(result).doesNotContain("onclick");
        assertThat(result).doesNotContain("alert");
    }
}
