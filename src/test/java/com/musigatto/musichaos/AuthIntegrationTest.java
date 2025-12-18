package com.musigatto.musichaos;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musigatto.musichaos.dto.UserProfile;
import com.musigatto.musichaos.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    private WebTestClient webClient;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        objectMapper = new ObjectMapper();

        webClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    void registerLoginAndGetProfile() throws Exception {

        // --- 1️⃣ Register ---
        String registerJson = """
            {
              "email": "test@example.com",
              "username": "tester",
              "password": "1234"
            }
            """;

        webClient.post()
                .uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(registerJson)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .isEqualTo("User registered");

        // --- 2️⃣ Login ---
        String loginJson = """
            {
              "email": "test@example.com",
              "password": "1234"
            }
            """;

        String responseBody = webClient.post()
                .uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginJson)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertNotNull(responseBody);

        JsonNode json = objectMapper.readTree(responseBody);
        String jwtToken = json.get("token").asText();

        assertNotNull(jwtToken);
        assertFalse(jwtToken.isBlank());

        // --- 3️⃣ Get profile ---
        webClient.get()
                .uri("/api/me")
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserProfile.class)
                .consumeWith(response -> {
                    UserProfile profile = response.getResponseBody();
                    assertNotNull(profile);
                    assertEquals("test@example.com", profile.getEmail());
                    assertEquals("tester", profile.getUsername());
                });
    }
}
