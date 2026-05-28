package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO de respuesta con datos de un cliente.
 * <p>
 * Contiene la información del cliente para ser devuelta al frontend.
 * </p>
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {

    /** Identificador del cliente. */
    private Long id;

    /** Número de documento. */
    private String documento;

    /** Razón social del comercio. */
    private String razonSocial;

    /** Nombre de la persona responsable. */
    private String responsable;

    /** Número de teléfono de contacto. */
    private String telefono;

    /** Correo electrónico de contacto. */
    private String email;

    /** Fecha de registro del cliente. */
    private LocalDateTime createdAt;
}
