package com.prestapp.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de solicitud para recuperación de contraseña.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecuperarPasswordRequest {

    /** Username del usuario que quiere recuperar su contraseña. */
    @NotBlank(message = "El usuario es obligatorio")
    private String username;
}
