package com.musigatto.musichaos.game;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LobbyMessage {
    private String type;      // "JOIN", "START", "ANSWER", etc.
    private String username;  // jugador que generó el evento
    private String content;   // mensaje adicional
}
