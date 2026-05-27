package com.prestapp.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de solicitud para cambio de contraseña.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CambiarPasswordRequest {

    /** Contraseña actual del usuario. */
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String currentPassword;

    /** Nueva contraseña (mínimo 6 caracteres). */
    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, message = "La nueva contraseña debe tener al menos 6 caracteres")
    private String newPassword;
}
