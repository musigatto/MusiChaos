package com.musigatto.musichaos.model;

import com.musigatto.musichaos.game.PlayerAnswer;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "rounds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int roundNumber;

    private String correctAnswer;

    @Enumerated(EnumType.STRING)
    private RoundStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lobby_id")
    private Lobby lobby;

    @OneToMany(mappedBy = "round", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PlayerAnswer> answers = new HashSet<>();
}
