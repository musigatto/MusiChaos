package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.game.Round;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a base de datos para rondas
 */
public interface RoundRepository extends JpaRepository<Round, Long> {
}
