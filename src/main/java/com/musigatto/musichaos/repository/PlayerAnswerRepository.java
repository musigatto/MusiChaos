package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.game.PlayerAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerAnswerRepository extends JpaRepository<PlayerAnswer, Long> {
    List<PlayerAnswer> findByRoundId(Long roundId);
    Optional<PlayerAnswer> findByRoundIdAndUsername(Long roundId, String username);

}
