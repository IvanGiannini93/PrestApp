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
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequest {

    /** Nombre del cliente. */
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    /** Apellido del cliente. */
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellido;

    /** Número de documento DNI/CUIT (único por cliente). */
    @NotBlank(message = "El documento es obligatorio")
    @Size(max = 20, message = "El documento no puede exceder 20 caracteres")
    private String documento;

    /** Número de teléfono de contacto. */
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    /** Correo electrónico de contacto. */
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email es inválido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    /** Nombre del comercio (opcional). */
    @Size(max = 150, message = "El nombre del comercio no puede exceder 150 caracteres")
    private String razonSocial;
}
