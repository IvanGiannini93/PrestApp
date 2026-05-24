package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de respuesta con datos de una cuota.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuotaResponse {

    /** Identificador de la cuota. */
    private Long id;

    /** Número secuencial de la cuota. */
    private Integer numeroCuota;

    /** Monto a pagar. */
    private BigDecimal monto;

    /** Fecha de vencimiento. */
    private LocalDate fechaVencimiento;

    /** Fecha de pago (null si no fue pagada). */
    private LocalDate fechaPago;

    /** Estado de la cuota (PENDIENTE, PAGADA, EN_MORA). */
    private String estado;
}
