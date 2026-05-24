package com.prestapp.infrastructure.security;

import com.prestapp.domain.model.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Representa al usuario autenticado extraído del token JWT.
 * <p>
 * Se almacena como principal en el SecurityContext de Spring Security
 * para acceder a la información del usuario en los controladores.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Getter
@AllArgsConstructor
public class JwtAuthenticatedUser {

    /** Nombre de usuario. */
    private final String username;

    /** Rol del usuario. */
    private final Rol rol;

    /** ID del cliente asociado (null para admin). */
    private final Long clienteId;
}
