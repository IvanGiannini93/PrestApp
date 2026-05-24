package com.prestapp.application.mapper;

import com.prestapp.application.dto.response.CuotaResponse;
import com.prestapp.domain.model.Cuota;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversión entre entidad Cuota y DTOs.
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Component
public class CuotaMapper {

    /**
     * Convierte una entidad Cuota a DTO de response.
     *
     * @param cuota entidad Cuota
     * @return DTO con datos de la cuota
     */
    public CuotaResponse toResponse(Cuota cuota) {
        return CuotaResponse.builder()
                .id(cuota.getId())
                .numeroCuota(cuota.getNumeroCuota())
                .monto(cuota.getMonto())
                .fechaVencimiento(cuota.getFechaVencimiento())
                .fechaPago(cuota.getFechaPago())
                .estado(cuota.getEstado().name())
                .build();
    }
}
