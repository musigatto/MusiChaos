package com.musigatto.musichaos.game;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a base de datos para rondas
 */
public interface RoundRepository extends JpaRepository<Round, Long> {
}
