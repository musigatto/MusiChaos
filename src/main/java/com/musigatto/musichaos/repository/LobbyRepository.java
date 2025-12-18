package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.model.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LobbyRepository extends JpaRepository<Lobby, Long> {
    Optional<Lobby> findByCode(String code);
}
