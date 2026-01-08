package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.Score;
import com.musigatto.musichaos.service.LobbyService;
import com.musigatto.musichaos.service.ScoreService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lobby")
@RequiredArgsConstructor
public class LobbyController {

    private final LobbyService lobbyService;
    private final ScoreService scoreService;
    @PostMapping("/create")
    public Lobby create(Authentication auth) {
        return lobbyService.createLobby(auth.getName());
    }


    @PostMapping("/join")
    public Lobby join(@RequestBody JoinRequest request, Authentication auth) {
        return lobbyService.joinLobby(request.getCode(), auth.getName());
    }

    @Data
    static class JoinRequest {
        private String code;
    }
    @GetMapping("/lobbies/{lobbyId}/scores") // sin /api delante
    public List<Score> getLobbyScores(@PathVariable Long lobbyId) {
        return scoreService.getScoresByLobby(lobbyId)
                .stream()
                .sorted((s1, s2) -> Integer.compare(s2.getPoints(), s1.getPoints()))
                .toList();
    }

}
