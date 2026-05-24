package com.prestapp.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de solicitud de login.
 * <p>
 * Contiene las credenciales del usuario para autenticación.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    /** Nombre de usuario. */
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    /** Contraseña del usuario. */
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
