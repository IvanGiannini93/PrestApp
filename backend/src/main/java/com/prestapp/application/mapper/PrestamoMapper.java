package com.prestapp.application.mapper;

import com.prestapp.application.dto.response.PrestamoResponse;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper para conversión entre entidad Prestamo y DTOs.
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Component
@RequiredArgsConstructor
public class PrestamoMapper {

    private final CuotaMapper cuotaMapper;

    /**
     * Convierte una entidad Prestamo a DTO de response (sin cuotas).
     *
     * @param prestamo entidad Prestamo
     * @return DTO con datos del préstamo
     */
    public PrestamoResponse toResponse(Prestamo prestamo) {
        return toResponse(prestamo, false);
    }

    /**
     * Convierte una entidad Prestamo a DTO de response.
     *
     * @param prestamo      entidad Prestamo
     * @param includeCuotas si se deben incluir las cuotas en la respuesta
     * @return DTO con datos del préstamo
     */
    public PrestamoResponse toResponse(Prestamo prestamo, boolean includeCuotas) {
        int totalCuotas = prestamo.getCuotas() != null ? prestamo.getCuotas().size() : 0;
        int pagadas = prestamo.getCuotas() != null
                ? (int) prestamo.getCuotas().stream()
                    .filter(c -> c.getEstado() == EstadoCuota.PAGADA)
                    .count()
                : 0;

        PrestamoResponse.PrestamoResponseBuilder builder = PrestamoResponse.builder()
                .id(prestamo.getId())
                .clienteId(prestamo.getCliente() != null ? prestamo.getCliente().getId() : null)
                .clienteNombre(prestamo.getCliente() != null ? prestamo.getCliente().getRazonSocial() : null)
                .clienteDocumento(prestamo.getCliente() != null ? prestamo.getCliente().getDocumento() : null)
                .monto(prestamo.getMonto())
                .tasaInteres(prestamo.getTasaInteres())
                .plazo(prestamo.getPlazo())
                .frecuencia(prestamo.getFrecuencia().name())
                .fechaInicio(prestamo.getFechaInicio())
                .saldoRestante(prestamo.getSaldoRestante())
                .estado(prestamo.getEstado().name())
                .totalCuotas(totalCuotas)
                .cuotasPagadas(pagadas)
                .cuotasPendientes(totalCuotas - pagadas)
                .createdAt(prestamo.getCreatedAt());

        if (includeCuotas && prestamo.getCuotas() != null) {
            builder.cuotas(prestamo.getCuotas().stream()
                    .map(cuotaMapper::toResponse)
                    .toList());
        }

        return builder.build();
    }

    /**
     * Convierte una lista de préstamos a lista de DTOs.
     *
     * @param prestamos lista de entidades
     * @return lista de DTOs
     */
    public List<PrestamoResponse> toResponseList(List<Prestamo> prestamos) {
        return prestamos.stream()
                .map(this::toResponse)
                .toList();
    }
}
