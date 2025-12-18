package com.musigatto.musichaos.game;

import com.musigatto.musichaos.repository.RoundRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de integración para el flujo completo de una ronda
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RoundIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoundRepository roundRepository;

    private WebTestClient webClient;

    @BeforeEach
    void setup() {
        // Cliente HTTP para llamar a la app real
        webClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();

        // Limpiamos la DB antes de cada test
        roundRepository.deleteAll();
    }

    @Test
    void createStartAndFinishRound() {
        // --- 1️⃣ Crear ronda ---
        Round createdRound = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/api/rounds")
                                .queryParam("number", 1)
                                .queryParam("answer", "queen")
                                .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Round.class)
                .returnResult()
                .getResponseBody();

        assertThat(createdRound).isNotNull();
        assertThat(createdRound.getStatus()).isEqualTo(RoundStatus.WAITING);

        Long roundId = createdRound.getId();

        // --- 2️⃣ Iniciar ronda ---
        Round startedRound = webClient.post()
                .uri("/api/rounds/{id}/start", roundId)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Round.class)
                .returnResult()
                .getResponseBody();

        assertThat(startedRound).isNotNull();
        assertThat(startedRound.getStatus()).isEqualTo(RoundStatus.ACTIVE);

        // --- 3️⃣ Finalizar ronda ---
        Round finishedRound = webClient.post()
                .uri("/api/rounds/{id}/finish", roundId)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Round.class)
                .returnResult()
                .getResponseBody();

        assertThat(finishedRound).isNotNull();
        assertThat(finishedRound.getStatus()).isEqualTo(RoundStatus.FINISHED);
    }
}
