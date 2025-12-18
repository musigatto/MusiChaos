package com.musigatto.musichaos.service;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.User;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LobbyService {

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;

    // Crear un lobby nuevo
    public Lobby createLobby(String name) {
        String code = generateUniqueCode();
        Lobby lobby = Lobby.builder()
                .name(name)
                .code(code)
                .started(false) // reemplaza .active(false)
                .build();
        return lobbyRepository.save(lobby);
    }

    // Agregar jugador al lobby
    public Lobby joinLobby(String code, String emailOrUsername) {
        Lobby lobby = lobbyRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found"));
        User user = userRepository.findByEmail(emailOrUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        lobby.getPlayers().add(user);
        return lobbyRepository.save(lobby);
    }


    // Iniciar lobby
    public Lobby startLobby(String code) {
        Lobby lobby = lobbyRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Lobby not found"));
        lobby.start(); // reemplaza setActive(true)
        return lobbyRepository.save(lobby);
    }

    // Finalizar lobby
    public Lobby finishLobby(String code) {
        Lobby lobby = lobbyRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Lobby not found"));
        lobby.finish(); // reemplaza setActive(false)
        return lobbyRepository.save(lobby);
    }

    // Genera un código único tipo "ABCD"
    private String generateUniqueCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        } while (lobbyRepository.findByCode(code).isPresent());
        return code;
    }
}
