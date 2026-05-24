package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta de login exitoso.
 * <p>
 * Contiene el token JWT y la información del rol del usuario autenticado.
 * </p>
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    /** Token JWT para autenticación en requests posteriores. */
    private String token;

    /** Rol del usuario autenticado (ADMIN o CLIENTE). */
    private String rol;

    /** Nombre de usuario autenticado. */
    private String username;
}
