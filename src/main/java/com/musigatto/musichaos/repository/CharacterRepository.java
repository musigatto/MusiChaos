package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.model.Character;
import com.musigatto.musichaos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByUser(User user);
}
