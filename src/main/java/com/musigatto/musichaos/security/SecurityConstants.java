package com.musigatto.musichaos.security;

/**
 * Constantes centralizadas de seguridad.
 * Define todas las rutas públicas de la aplicación en un solo lugar.
 *
 * Esta clase asegura que SecurityConfig y JwtAuthFilter usen
 * las mismas rutas, evitando inconsistencias de seguridad.
 */
public final class SecurityConstants {

    /**
     * Rutas públicas que NO requieren autenticación JWT.
     * Estas rutas son accesibles sin token.
     */
    public static final String[] PUBLIC_ENDPOINTS = {
            // Autenticación
            "/api/auth/register",
            "/api/auth/login",

            // HTML de prueba/desarrollo
            "/test.html",

            // WebSocket (STOMP sobre SockJS)
            "/ws/**",

            // Recursos estáticos (si los hay)
            "/static/**",
            "/css/**",
            "/js/**",
            "/images/**",

            // Health check (opcional, para monitoreo)
            "/actuator/health"
    };

    /**
     * Rutas que requieren autenticación, pero están configuradas
     * como públicas temporalmente para desarrollo/testing.
     *
     * ⚠️ IMPORTANTE: En producción, estas rutas DEBEN requerir autenticación.
     * Considera eliminar estas rutas de PUBLIC_ENDPOINTS antes de deployment.
     */
    public static final String[] DEV_PUBLIC_ENDPOINTS = {
            "/api/rounds/**",
            "/api/lobby/**",
            "/api/lobbies/**"
    };

    /**
     * Todas las rutas públicas combinadas (desarrollo).
     * Usa esto en SecurityConfig durante desarrollo.
     */
    public static final String[] ALL_PUBLIC_ENDPOINTS_DEV = concatenate(
            PUBLIC_ENDPOINTS,
            DEV_PUBLIC_ENDPOINTS
    );

    /**
     * Configuración de JWT
     */
    public static final class JWT {
        public static final String TOKEN_PREFIX = "Bearer ";
        public static final String HEADER_NAME = "Authorization";
        public static final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 horas

        private JWT() {
            throw new UnsupportedOperationException("Cannot instantiate JWT constants class");
        }
    }

    /**
     * Headers de seguridad personalizados
     */
    public static final class Headers {
        public static final String REQUEST_ID = "X-Request-ID";
        public static final String USER_AGENT = "User-Agent";

        private Headers() {
            throw new UnsupportedOperationException("Cannot instantiate Headers constants class");
        }
    }

    // Constructor privado para prevenir instanciación
    private SecurityConstants() {
        throw new UnsupportedOperationException("Cannot instantiate SecurityConstants class");
    }

    // Helper para concatenar arrays
    private static String[] concatenate(String[] array1, String[] array2) {
        String[] result = new String[array1.length + array2.length];
        System.arraycopy(array1, 0, result, 0, array1.length);
        System.arraycopy(array2, 0, result, array1.length, array2.length);
        return result;
    }
}