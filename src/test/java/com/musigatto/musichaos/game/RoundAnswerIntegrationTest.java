package com.musigatto.musichaos.game;

import com.musigatto.musichaos.repository.PlayerAnswerRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RoundAnswerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private PlayerAnswerRepository answerRepository;

    private WebTestClient webClient;

    @BeforeEach
    void setup() {
        webClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();

        // Limpiamos DB antes de cada test
        answerRepository.deleteAll();
        roundRepository.deleteAll();
    }

    @Test
    void submitAndRetrieveAnswers() {
        // --- 1️⃣ Crear ronda ---
        Round round = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder.path("/api/rounds")
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

        assertThat(round).isNotNull();

        Long roundId = round.getId();

        // --- 2️⃣ Iniciar ronda ---
        webClient.post()
                .uri("/api/rounds/{id}/start", roundId)
                .exchange()
                .expectStatus().isOk();

        // --- 3️⃣ Enviar respuestas ---
        PlayerAnswer answer1 = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder.path("/api/rounds/{id}/answers")
                                .queryParam("username", "player1")
                                .queryParam("answer", "queen")
                                .build(roundId)
                )
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PlayerAnswer.class)
                .returnResult()
                .getResponseBody();

        PlayerAnswer answer2 = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder.path("/api/rounds/{id}/answers")
                                .queryParam("username", "player2")
                                .queryParam("answer", "king")
                                .build(roundId)
                )
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PlayerAnswer.class)
                .returnResult()
                .getResponseBody();

        assertThat(answer1).isNotNull();
        assertThat(answer2).isNotNull();

        // --- 4️⃣ Obtener todas las respuestas ---
        List<PlayerAnswer> answers = webClient.get()
                .uri("/api/rounds/{id}/answers", roundId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(PlayerAnswer.class)
                .returnResult()
                .getResponseBody();

        assertThat(answers).hasSize(2);
        assertThat(answers).extracting("username").containsExactlyInAnyOrder("player1", "player2");
    }
}
