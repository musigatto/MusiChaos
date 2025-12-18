package com.musigatto.musichaos.service;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.model.User;
import com.musigatto.musichaos.repository.LobbyRepository;
import com.musigatto.musichaos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class LobbyService {

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;

    public Lobby createLobby(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Lobby lobby = Lobby.builder()
                .code(generateCode())
                .build();
        lobby.getPlayers().add(user);
        return lobbyRepository.save(lobby);
    }

    public Lobby joinLobby(String code, String email) {
        Lobby lobby = lobbyRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found"));
        User user = userRepository.findByEmail(email).orElseThrow();
        lobby.getPlayers().add(user);
        return lobbyRepository.save(lobby);
    }

    private String generateCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        Random r = new Random();
        return "" + chars.charAt(r.nextInt(chars.length()))
                + chars.charAt(r.nextInt(chars.length()))
                + chars.charAt(r.nextInt(chars.length()))
                + chars.charAt(r.nextInt(chars.length()));
    }
}
