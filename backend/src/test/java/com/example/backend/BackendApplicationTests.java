package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
	// JWT secret must be at least 256 bits (32 characters) for HMAC-SHA algorithms
	"JWT_SECRET=test-jwt-secret-key-for-testing-purposes-at-least-32-characters-long"
})
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
