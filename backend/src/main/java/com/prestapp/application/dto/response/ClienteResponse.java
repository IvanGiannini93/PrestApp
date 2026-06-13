package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO de respuesta con datos de un cliente.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String nombreCompleto;
    private String documento;
    private String telefono;
    private String email;
    private String razonSocial;
    private LocalDateTime createdAt;
}
