package com.musigatto.musichaos.game;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class LobbyNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public LobbyNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendLobbyUpdate(Long lobbyId, LobbyMessage message) {
        messagingTemplate.convertAndSend("/topic/lobby/" + lobbyId, message);
    }
}
