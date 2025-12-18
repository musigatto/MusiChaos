package com.musigatto.musichaos.game;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.Round;
import com.musigatto.musichaos.model.RoundStatus;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RoundIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private LobbyRepository lobbyRepository;

    private WebTestClient webClient;
    private Long lobbyId;

    @BeforeEach
    void setup() {
        roundRepository.deleteAll();
        lobbyRepository.deleteAll();

        Lobby lobby = new Lobby();
        lobby.setCode("TEST");
        lobby.setName("Test Lobby");
        lobby.setStarted(false);

        lobbyId = lobbyRepository.save(lobby).getId();

        webClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    void fullRoundFlow() {
        // Crear ronda
        Round round = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder.path("/api/rounds")
                                .queryParam("lobbyId", lobbyId)
                                .queryParam("roundNumber", 1)
                                .queryParam("correctAnswer", "queen")
                                .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Round.class)
                .returnResult()
                .getResponseBody();

        assertThat(round).isNotNull();
        assertThat(round.getStatus()).isEqualTo(RoundStatus.WAITING);
        Long roundId = round.getId();

        // Enviar respuesta jugador
        Round updatedRound = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder.path("/api/rounds/{id}/answer")
                                .queryParam("username", "player1")
                                .queryParam("answer", "queen")
                                .build(roundId)
                )
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Round.class)
                .returnResult()
                .getResponseBody();

        assertThat(updatedRound).isNotNull();
        assertThat(updatedRound.getId()).isEqualTo(roundId);

        // Finalizar ronda
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
