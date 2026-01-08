package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    Optional<Score> findByLobbyIdAndUsername(Long lobbyId, String username);

    List<Score> findByLobbyId(Long lobbyId);
}
