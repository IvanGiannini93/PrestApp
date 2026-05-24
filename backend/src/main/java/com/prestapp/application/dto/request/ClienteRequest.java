package com.prestapp.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de solicitud para registro de clientes.
 * <p>
 * Contiene los datos necesarios para crear un nuevo cliente
 * con validaciones de Bean Validation.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequest {

    /** Razón social del comercio (máximo 150 caracteres). */
    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 150, message = "La razón social no puede exceder 150 caracteres")
    private String razonSocial;

    /** Nombre de la persona responsable (máximo 100 caracteres). */
    @NotBlank(message = "El nombre del responsable es obligatorio")
    @Size(max = 100, message = "El nombre del responsable no puede exceder 100 caracteres")
    private String responsable;

    /** Número de teléfono de contacto. */
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    /** Correo electrónico de contacto. */
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email es inválido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;
}
