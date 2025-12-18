package com.musigatto.musichaos.game;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import com.musigatto.musichaos.service.RoundService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class RoundLobbyIntegrationTest {

    @Autowired
    private LobbyRepository lobbyRepository;

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private RoundService roundService;

    @Autowired
    private LobbyNotificationService notificationService;

    private Lobby testLobby;

    @BeforeEach
    void setup() {
        roundRepository.deleteAll();
        lobbyRepository.deleteAll();

        testLobby = new Lobby();
        testLobby.setName("Test Lobby");
        testLobby = lobbyRepository.save(testLobby);
    }

    @Test
    void testCreateRoundAndFinish() {
        // Crear ronda
        Round round = roundService.createRound(testLobby.getId(), 1, "queen");
        assertNotNull(round.getId());
        assertEquals(RoundStatus.WAITING, round.getStatus());
        assertEquals(testLobby.getId(), round.getLobby().getId());

        // Enviar respuesta
        Round updated = roundService.submitAnswer(round.getId(), "player1", "queen");
        assertEquals(round.getId(), updated.getId());

        // Terminar ronda
        Round finished = roundService.finishRound(round.getId());
        assertEquals(RoundStatus.FINISHED, finished.getStatus());
    }
}
