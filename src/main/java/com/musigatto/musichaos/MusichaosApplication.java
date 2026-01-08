package com.musigatto.musichaos;

import com.musigatto.musichaos.repository.LobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class MusichaosApplication {

    private final LobbyRepository lobbyRepository;

    public static void main(String[] args) {
        SpringApplication.run(MusichaosApplication.class, args);
    }

}