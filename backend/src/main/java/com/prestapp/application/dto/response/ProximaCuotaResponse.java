package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de respuesta para las próximas cuotas a cobrar.
 * Incluye datos del cliente y del préstamo para el dashboard del admin.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProximaCuotaResponse {

    /** ID de la cuota. */
    private Long cuotaId;

    /** Nombre del cliente (razón social). */
    private String clienteNombre;

    /** Documento del cliente. */
    private String clienteDocumento;

    /** Número de cuota. */
    private Integer numeroCuota;

    /** Monto de la cuota. */
    private BigDecimal monto;

    /** Fecha de vencimiento. */
    private LocalDate fechaVencimiento;

    /** Estado de la cuota. */
    private String estado;

    /** Frecuencia del préstamo. */
    private String frecuencia;

    /** Total de cuotas del préstamo. */
    private Integer totalCuotas;
}
