package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.model.Round;
import com.musigatto.musichaos.service.RoundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rounds")
public class RoundController {

    private final RoundService roundService;

    public RoundController(RoundService roundService) {
        this.roundService = roundService;
    }

    @PostMapping
    public ResponseEntity<Round> createRound(@RequestParam Long lobbyId,
                                             @RequestParam int roundNumber,
                                             @RequestParam String correctAnswer) {
        return ResponseEntity.ok(roundService.createRound(lobbyId, roundNumber, correctAnswer));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<Round> submitAnswer(@PathVariable Long id,
                                              @RequestParam String username,
                                              @RequestParam String answer) {
        return ResponseEntity.ok(roundService.submitAnswer(id, username, answer));
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<Round> finishRound(@PathVariable Long id) {
        return ResponseEntity.ok(roundService.finishRound(id));
    }
}
