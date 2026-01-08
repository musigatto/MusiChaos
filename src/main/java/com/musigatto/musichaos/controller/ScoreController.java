package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.model.Score;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;
    private final LobbyRepository lobbyRepository;

    public ScoreController(ScoreService scoreService, LobbyRepository lobbyRepository) {
        this.scoreService = scoreService;
        this.lobbyRepository = lobbyRepository;
    }

    // Obtener ranking de un lobby
    @GetMapping("/lobby/{lobbyId}")
    public ResponseEntity<List<Score>> getLobbyScores(@PathVariable Long lobbyId) {
        if (!lobbyRepository.existsById(lobbyId)) {
            return ResponseEntity.notFound().build();
        }

        List<Score> scores = scoreService.getScoresByLobby(lobbyId);
        return ResponseEntity.ok(scores);
    }
}
