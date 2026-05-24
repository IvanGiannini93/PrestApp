package com.prestapp.application.mapper;

import com.prestapp.application.dto.request.ClienteRequest;
import com.prestapp.application.dto.response.ClienteResponse;
import com.prestapp.domain.model.Cliente;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversión entre entidad Cliente y DTOs.
 * <p>
 * Convierte entre la entidad de dominio {@link Cliente} y los DTOs
 * de request/response de la capa de aplicación.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Component
public class ClienteMapper {

    /**
     * Convierte un DTO de request a entidad de dominio.
     *
     * @param request DTO con datos del cliente
     * @return entidad Cliente
     */
    public Cliente toEntity(ClienteRequest request) {
        return Cliente.builder()
                .razonSocial(request.getRazonSocial())
                .responsable(request.getResponsable())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .build();
    }

    /**
     * Convierte una entidad de dominio a DTO de response.
     *
     * @param cliente entidad Cliente
     * @return DTO con datos del cliente
     */
    public ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .razonSocial(cliente.getRazonSocial())
                .responsable(cliente.getResponsable())
                .telefono(cliente.getTelefono())
                .email(cliente.getEmail())
                .createdAt(cliente.getCreatedAt())
                .build();
    }
}
