package com.musigatto.musichaos.service;

import com.musigatto.musichaos.game.LobbyMessage;
import com.musigatto.musichaos.game.LobbyNotificationService;
import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.Round;
import com.musigatto.musichaos.model.RoundStatus;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class RoundService {

    private final RoundRepository roundRepository;
    private final LobbyRepository lobbyRepository;
    private final LobbyNotificationService notificationService;

    public RoundService(RoundRepository roundRepository,
                        LobbyRepository lobbyRepository,
                        LobbyNotificationService notificationService) {
        this.roundRepository = roundRepository;
        this.lobbyRepository = lobbyRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Round createRound(Long lobbyId, int roundNumber, String correctAnswer) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new RuntimeException("Lobby not found"));

        Round round = Round.builder()
                .roundNumber(roundNumber)
                .correctAnswer(correctAnswer)
                .status(RoundStatus.WAITING)
                .lobby(lobby)
                .build();

        Round saved = roundRepository.save(round);

        // Notificar a todos los jugadores del lobby usando LobbyMessage
        LobbyMessage message = new LobbyMessage(
                "NEW_ROUND",
                null,
                "Ronda " + roundNumber + " creada"
        );
        notificationService.sendLobbyUpdate(lobbyId, message);

        return saved;
    }

    @Transactional
    public Round submitAnswer(Long roundId, String username, String answer) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        // Notificamos la respuesta usando LobbyMessage
        LobbyMessage message = new LobbyMessage(
                "ANSWER",
                username,
                answer
        );
        notificationService.sendLobbyUpdate(round.getLobby().getId(), message);

        return round;
    }

    @Transactional
    public Round finishRound(Long roundId) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        round.setStatus(RoundStatus.FINISHED);
        Round saved = roundRepository.save(round);

        // Notificar que la ronda finalizó
        LobbyMessage message = new LobbyMessage(
                "ROUND_FINISHED",
                null,
                "Ronda " + round.getRoundNumber() + " finalizada"
        );
        notificationService.sendLobbyUpdate(round.getLobby().getId(), message);

        return saved;
    }
}
