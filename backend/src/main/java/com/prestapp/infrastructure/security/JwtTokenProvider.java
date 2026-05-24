package com.prestapp.infrastructure.security;

import com.prestapp.domain.model.enums.Rol;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Proveedor de tokens JWT para autenticación.
 * <p>
 * Genera y valida tokens JWT que contienen el nombre de usuario,
 * rol y opcionalmente el ID del cliente asociado.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long adminExpirationMs;
    private final long clientExpirationMs;

    /**
     * Constructor con inyección de configuración.
     *
     * @param secret             clave secreta para firmar tokens
     * @param adminExpirationMs  tiempo de expiración para admin en milisegundos
     * @param clientExpirationMs tiempo de expiración para cliente en milisegundos
     */
    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.admin-expiration-ms}") long adminExpirationMs,
            @Value("${app.jwt.client-expiration-ms}") long clientExpirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.adminExpirationMs = adminExpirationMs;
        this.clientExpirationMs = clientExpirationMs;
    }

    /**
     * Genera un token JWT para el usuario autenticado.
     *
     * @param username  nombre de usuario
     * @param rol       rol del usuario
     * @param clienteId ID del cliente (null para admin)
     * @return token JWT firmado
     */
    public String generateToken(String username, Rol rol, Long clienteId) {
        long expirationMs = (rol == Rol.ADMIN) ? adminExpirationMs : clientExpirationMs;
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        JwtBuilder builder = Jwts.builder()
                .subject(username)
                .claim("rol", rol.name())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey);

        if (clienteId != null) {
            builder.claim("clienteId", clienteId);
        }

        return builder.compact();
    }

    /**
     * Extrae el nombre de usuario del token.
     *
     * @param token token JWT
     * @return nombre de usuario
     */
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extrae el rol del token.
     *
     * @param token token JWT
     * @return rol del usuario
     */
    public Rol getRol(String token) {
        String rolStr = getClaims(token).get("rol", String.class);
        return Rol.valueOf(rolStr);
    }

    /**
     * Extrae el ID del cliente del token.
     *
     * @param token token JWT
     * @return ID del cliente o null si es admin
     */
    public Long getClienteId(String token) {
        return getClaims(token).get("clienteId", Long.class);
    }

    /**
     * Valida si un token JWT es válido y no ha expirado.
     *
     * @param token token JWT a validar
     * @return true si el token es válido
     */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Obtiene los claims del token.
     *
     * @param token token JWT
     * @return claims del token
     * @throws JwtException si el token es inválido o expirado
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
