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

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;
    private ObjectMapper objectMapper;

    private WebTestClient webClient;

    @BeforeEach
    void setup() {
        webClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
        objectMapper = new ObjectMapper();
        userRepository.deleteAll();
    }

    @Test
    void registerLoginAndGetProfile() throws Exception {
        // --- 1️⃣ Registro ---
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
                .expectBody(String.class).isEqualTo("User registered");

        // --- 2️⃣ Login ---
        String loginJson = """
                {
                  "email": "test@example.com",
                  "password": "1234"
                }
                """;

        String token = webClient.post()
                .uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginJson)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        // Parseamos token desde JSON
        JsonNode jsonNode = objectMapper.readTree(token);
        String jwtToken = jsonNode.get("token").asText();

        // --- 3️⃣ Obtener perfil ---
        webClient.get()
                .uri("/api/me")
                .header("Authorization", "Bearer " + jwtToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserProfile.class)
                .consumeWith(response -> {
                    UserProfile profile = response.getResponseBody();
                    assert profile != null;
                    assert profile.getEmail().equals("test@example.com");
                    assert profile.getUsername().equals("tester");
                });
    }
}
