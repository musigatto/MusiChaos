package com.musigatto.musichaos.model;

import jakarta.persistence.*;
import lombok.*;

@Entity                 // Marca esta clase como una tabla de base de datos
@Table(name = "users")  // Nombre de la tabla
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Email único para login
    @Column(nullable = false, unique = true)
    private String email;

    // Username visible en el juego
    @Column(nullable = false, unique = true)
    private String username;

    // Password hasheado (NUNCA guardar texto plano)
    @Column(nullable = false)
    private String password;

    // Info extra para perfil (opcional)
    private String avatarUrl;       // URL del avatar
    private Integer coins = 0;      // Moneda del juego
    private Integer level = 1;      // Nivel
}
