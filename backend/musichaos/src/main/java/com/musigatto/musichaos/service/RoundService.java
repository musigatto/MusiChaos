package com.musigatto.musichaos.service;

import com.musigatto.musichaos.game.LobbyMessage;
import com.musigatto.musichaos.game.LobbyNotificationService;
import com.musigatto.musichaos.game.PlayerAnswer;
import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.Round;
import com.musigatto.musichaos.model.RoundStatus;
import com.musigatto.musichaos.model.Score;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.PlayerAnswerRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoundService {

    private final RoundRepository roundRepository;
    private final LobbyRepository lobbyRepository;
    private final PlayerAnswerRepository answerRepository;
    private final LobbyNotificationService notificationService;
    private final ScoreService scoreService;

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

        // Verificar si ya se respondió
        boolean alreadyAnswered = answerRepository.findByRoundIdAndUsername(roundId, username).isPresent();
        if (alreadyAnswered) {
            throw new RuntimeException("Player has already answered this round");
        }

        // Comprobar si la respuesta es correcta
        boolean correct = round.getCorrectAnswer().equalsIgnoreCase(answer);

        // Guardar PlayerAnswer
        PlayerAnswer playerAnswer = PlayerAnswer.builder()
                .round(round)
                .username(username)
                .answer(answer)
                .correct(correct)
                .build();
        answerRepository.save(playerAnswer);

        // Notificar la respuesta al lobby
        LobbyMessage answerMessage = new LobbyMessage(
                "ANSWER",
                username,
                answer
        );
        notificationService.sendLobbyUpdate(round.getLobby().getId(), answerMessage);

        // Si es correcta, actualizar puntaje
        if (correct) {
            Score updatedScore = scoreService.addOrUpdateScore(round.getLobby(), username, 10); // 10 puntos por acierto

            LobbyMessage scoreMessage = new LobbyMessage(
                    "SCORE_UPDATE",
                    username,
                    String.valueOf(updatedScore.getPoints())
            );
            notificationService.sendLobbyUpdate(round.getLobby().getId(), scoreMessage);
        }

        return round;
    }


    @Transactional
    public Round finishRound(Long roundId) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        round.setStatus(RoundStatus.FINISHED);
        Round saved = roundRepository.save(round);

        LobbyMessage message = new LobbyMessage(
                "ROUND_FINISHED",
                null,
                "Ronda " + round.getRoundNumber() + " finalizada"
        );
        notificationService.sendLobbyUpdate(round.getLobby().getId(), message);

        return saved;
    }
}
