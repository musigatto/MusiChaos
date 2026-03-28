package com.musigatto.musichaos.websocket;

import com.musigatto.musichaos.model.Lobby;
import com.musigatto.musichaos.service.LobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class LobbySocketController {

    private final LobbyService lobbyService;

    @MessageMapping("/lobby/join")
    @SendTo("/topic/lobby")
    public Lobby joinLobby(LobbyMessage msg) {
        return lobbyService.joinLobby(msg.code(), msg.email());
    }

    record LobbyMessage(String code, String email) {}
}
