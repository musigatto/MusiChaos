package com.musigatto.musichaos.game;

import org.springframework.web.bind.annotation.*;

/**
 * Endpoints REST para rondas
 */
@RestController
@RequestMapping("/api/rounds")
public class RoundController {

    private final RoundService roundService;

    public RoundController(RoundService roundService) {
        this.roundService = roundService;
    }

    /**
     * Crear ronda
     */
    @PostMapping
    public Round createRound(@RequestParam int number,
                             @RequestParam String answer) {
        return roundService.createRound(number, answer);
    }

    /**
     * Iniciar ronda
     */
    @PostMapping("/{id}/start")
    public Round start(@PathVariable Long id) {
        return roundService.startRound(id);
    }

    /**
     * Finalizar ronda
     */
    @PostMapping("/{id}/finish")
    public Round finish(@PathVariable Long id) {
        return roundService.finishRound(id);
    }
}
