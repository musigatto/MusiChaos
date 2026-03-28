package com.musigatto.musichaos.model;

/**
 * Estados posibles de una ronda
 */
public enum RoundStatus {
    WAITING,     // creada pero no iniciada
    ACTIVE,      // jugadores pueden responder
    FINISHED     // ronda terminada
}
