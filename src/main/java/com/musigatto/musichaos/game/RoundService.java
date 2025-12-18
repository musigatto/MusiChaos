package com.musigatto.musichaos.game;

import org.springframework.stereotype.Service;

@Service
public class RoundService {

    private final RoundRepository roundRepository;

    public RoundService(RoundRepository roundRepository) {
        this.roundRepository = roundRepository;
    }

    /**
     * Crea una nueva ronda
     */
    public Round createRound(int roundNumber, String correctAnswer) {
        Round round = new Round(roundNumber, correctAnswer);
        return roundRepository.save(round);
    }

    /**
     * Inicia una ronda
     */
    public Round startRound(Long roundId) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        round.setStatus(RoundStatus.ACTIVE);
        return roundRepository.save(round);
    }

    /**
     * Finaliza una ronda
     */
    public Round finishRound(Long roundId) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        round.setStatus(RoundStatus.FINISHED);
        return roundRepository.save(round);
    }
}
