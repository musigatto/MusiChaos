package com.musigatto.musichaos.config;

import com.musigatto.musichaos.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.musigatto.musichaos.security.SecurityConstants.ALL_PUBLIC_ENDPOINTS_DEV;

/**
 * Configuración de seguridad de la aplicación.
 *
 * Define:
 * - Rutas públicas vs protegidas
 * - Configuración JWT
 * - Políticas de sesión
 * - CORS y CSRF
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (usamos JWT, no cookies de sesión)
                .csrf(AbstractHttpConfigurer::disable)

                // Configurar autorización de requests
                .authorizeHttpRequests(auth -> auth
                        // ✅ Rutas públicas (desde SecurityConstants)
                        .requestMatchers(ALL_PUBLIC_ENDPOINTS_DEV).permitAll()

                        // 🔒 Todas las demás rutas requieren autenticación
                        .anyRequest().authenticated()
                )

                // Política de sesión: STATELESS (sin sesiones de servidor)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Añadir filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Encoder para passwords usando BCrypt.
     * BCrypt es resistente a ataques de fuerza bruta.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}