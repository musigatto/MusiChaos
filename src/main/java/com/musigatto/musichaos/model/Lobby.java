package com.musigatto.musichaos.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lobbies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lobby {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Código tipo "ABCD"

    @Column(nullable = false)
    private String name; // Nombre del lobby

    private boolean started = false; // Estado de la partida

    @ManyToMany
    @JoinTable(
            name = "lobby_users",
            joinColumns = @JoinColumn(name = "lobby_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> players = new HashSet<>();

    // Métodos convenientes para manejar jugadores
    public void addPlayer(User user) {
        players.add(user);
    }

    public void removePlayer(User user) {
        players.remove(user);
    }

    // Método auxiliar para activar la partida
    public void start() {
        this.started = true;
    }

    public void finish() {
        this.started = false;
    }
}
