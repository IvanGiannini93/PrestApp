package com.prestapp.application.mapper;

import com.prestapp.application.dto.request.ClienteRequest;
import com.prestapp.application.dto.response.ClienteResponse;
import com.prestapp.domain.model.Cliente;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversión entre entidad Cliente y DTOs.
 */
@Component
public class ClienteMapper {

    /**
     * Convierte un DTO de request a entidad de dominio.
     */
    public Cliente toEntity(ClienteRequest request) {
        return Cliente.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .documento(request.getDocumento())
                .razonSocial(request.getRazonSocial())
                .responsable(request.getNombre() + " " + request.getApellido())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .build();
    }

    /**
     * Convierte una entidad de dominio a DTO de response.
     */
    public ClienteResponse toResponse(Cliente cliente) {
        String nombreCompleto = buildNombreCompleto(cliente);
        return ClienteResponse.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .nombreCompleto(nombreCompleto)
                .documento(cliente.getDocumento())
                .telefono(cliente.getTelefono())
                .email(cliente.getEmail())
                .razonSocial(cliente.getRazonSocial())
                .createdAt(cliente.getCreatedAt())
                .build();
    }

    /**
     * Construye el nombre completo del cliente.
     */
    private String buildNombreCompleto(Cliente cliente) {
        if (cliente.getNombre() != null && cliente.getApellido() != null) {
            return cliente.getNombre() + " " + cliente.getApellido();
        }
        if (cliente.getResponsable() != null) {
            return cliente.getResponsable();
        }
        return cliente.getRazonSocial() != null ? cliente.getRazonSocial() : "Sin nombre";
    }
}
