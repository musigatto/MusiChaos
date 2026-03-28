package com.musigatto.musichaos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.musigatto.musichaos.security.SecurityConstants.JWT.EXPIRATION_MS;

/**
 * Servicio para generación y validación de tokens JWT.
 *
 * Proporciona métodos para:
 * - Generar tokens JWT con información del usuario
 * - Extraer información (claims) de los tokens
 * - Validar tokens
 */
@Slf4j
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // Default: 24 horas
    private long jwtExpiration;

    private Key key;

    /**
     * Inicializa la clave JWT después de inyectar las propiedades.
     * Se ejecuta automáticamente después de la construcción del bean.
     */
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        log.info("JWT Service initialized with expiration: {} ms", jwtExpiration);
    }

    /**
     * Genera un token JWT para el usuario especificado.
     *
     * @param email Email del usuario (usado como subject)
     * @return Token JWT firmado
     */
    public String generateToken(String email) {
        return generateToken(email, new HashMap<>());
    }

    /**
     * Genera un token JWT con claims adicionales.
     *
     * @param email Email del usuario
     * @param extraClaims Claims adicionales a incluir en el token
     * @return Token JWT firmado
     */
    public String generateToken(String email, Map<String, Object> extraClaims) {
        long now = System.currentTimeMillis();

        String token = Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + EXPIRATION_MS))
                .signWith(key)
                .compact();

        log.debug("Generated JWT token for user: {}", email);
        return token;
    }

    /**
     * Extrae el email (subject) del token JWT.
     *
     * @param token Token JWT
     * @return Email del usuario
     * @throws io.jsonwebtoken.JwtException Si el token es inválido
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la fecha de expiración del token.
     *
     * @param token Token JWT
     * @return Fecha de expiración
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del token.
     *
     * @param token Token JWT
     * @param claimsResolver Función para extraer el claim deseado
     * @return Valor del claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae todos los claims del token.
     *
     * @param token Token JWT
     * @return Todos los claims del token
     * @throws io.jsonwebtoken.JwtException Si el token es inválido o expirado
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Verifica si el token ha expirado.
     *
     * @param token Token JWT
     * @return true si el token está expirado
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            log.warn("Error checking token expiration: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Valida un token JWT para un usuario específico.
     *
     * @param token Token JWT
     * @param email Email del usuario
     * @return true si el token es válido para el usuario
     */
    public boolean isTokenValid(String token, String email) {
        try {
            final String tokenEmail = extractEmail(token);
            boolean valid = tokenEmail.equals(email) && !isTokenExpired(token);

            if (!valid) {
                log.warn("Invalid token for user: {}", email);
            }

            return valid;
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}