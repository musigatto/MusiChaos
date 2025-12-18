package com.musigatto.musichaos.game;

import jakarta.persistence.*;

/**
 * Representa una ronda del juego
 */
@Entity
@Table(name = "rounds")
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Número de la ronda (1, 2, 3...)
     */
    private int roundNumber;

    /**
     * Estado actual de la ronda
     */
    @Enumerated(EnumType.STRING)
    private RoundStatus status;

    /**
     * Respuesta correcta (por ahora texto simple)
     * Más adelante será música / audio
     */
    private String correctAnswer;

    public Round() {}

    public Round(int roundNumber, String correctAnswer) {
        this.roundNumber = roundNumber;
        this.correctAnswer = correctAnswer;
        this.status = RoundStatus.WAITING;
    }

    // -------- getters & setters --------

    public Long getId() {
        return id;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public RoundStatus getStatus() {
        return status;
    }

    public void setStatus(RoundStatus status) {
        this.status = status;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }
}
