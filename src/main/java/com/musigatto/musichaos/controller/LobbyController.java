package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.service.LobbyService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lobby")
@RequiredArgsConstructor
public class LobbyController {

    private final LobbyService lobbyService;

    @PostMapping("/create")
    public Lobby create(Authentication auth) {
        return lobbyService.createLobby(auth.getName());
    }

    @PostMapping("/join")
    public Lobby join(@RequestBody JoinRequest request, Authentication auth) {
        return lobbyService.joinLobby(request.getCode(), auth.getName());
    }

    @Data
    static class JoinRequest {
        private String code;
    }
}
