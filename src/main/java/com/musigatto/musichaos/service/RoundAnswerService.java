package com.musigatto.musichaos.service;

import com.musigatto.musichaos.game.PlayerAnswer;
import com.musigatto.musichaos.model.Round;
import com.musigatto.musichaos.model.RoundStatus;
import com.musigatto.musichaos.repository.PlayerAnswerRepository;
import com.musigatto.musichaos.repository.RoundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoundAnswerService {

    private final PlayerAnswerRepository answerRepository;
    private final RoundRepository roundRepository;

    public RoundAnswerService(PlayerAnswerRepository answerRepository, RoundRepository roundRepository) {
        this.answerRepository = answerRepository;
        this.roundRepository = roundRepository;
    }

    @Transactional
    public PlayerAnswer submitAnswer(Long roundId, String username, String answerText) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        if (round.getStatus() != RoundStatus.ACTIVE) {
            throw new RuntimeException("Round is not active");
        }

        PlayerAnswer answer = PlayerAnswer.builder()
                .username(username)
                .answer(answerText)
                .round(round)
                .correct(false) // se puede actualizar después
                .build();

        return answerRepository.save(answer);
    }

    public List<PlayerAnswer> getAnswersForRound(Long roundId) {
        return answerRepository.findByRoundId(roundId);
    }
}
