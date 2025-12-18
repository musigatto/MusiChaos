package com.musigatto.musichaos.game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "player_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // jugador que respondió

    private String answer; // la respuesta que envió

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id")
    private Round round;

    private boolean correct; // opcional, se puede calcular después
}
