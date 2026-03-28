package com.musigatto.musichaos.service;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.Score;
import com.musigatto.musichaos.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;

    @Transactional
    public Score addOrUpdateScore(Lobby lobby, String username, int points) {
        return scoreRepository.findByLobbyIdAndUsername(lobby.getId(), username)
                .map(score -> {
                    score.setPoints(score.getPoints() + points);
                    return scoreRepository.save(score);
                })
                .orElseGet(() -> {
                    Score newScore = Score.builder()
                            .lobby(lobby)
                            .username(username)
                            .points(points)
                            .build();
                    return scoreRepository.save(newScore);
                });
    }

    @Transactional(readOnly = true)
    public List<Score> getScoresByLobby(Long lobbyId) {
        return scoreRepository.findByLobbyId(lobbyId);
    }

}
