package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.game.PlayerAnswer;
import com.musigatto.musichaos.service.RoundAnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rounds/{roundId}/answers")
public class RoundAnswerController {

    private final RoundAnswerService answerService;

    public RoundAnswerController(RoundAnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    public ResponseEntity<PlayerAnswer> submitAnswer(
            @PathVariable Long roundId,
            @RequestParam String username,
            @RequestParam String answer
    ) {
        PlayerAnswer saved = answerService.submitAnswer(roundId, username, answer);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<PlayerAnswer>> getAnswers(@PathVariable Long roundId) {
        return ResponseEntity.ok(answerService.getAnswersForRound(roundId));
    }
}
