package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO de respuesta del reporte de cobranza.
 * <p>
 * Contiene los totales y cantidades de cuotas categorizadas
 * como pagadas, pendientes y vencidas.
 * </p>
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteCobranzaResponse {

    /** Cantidad de cuotas pagadas. */
    private Integer cantidadPagadas;

    /** Monto total de cuotas pagadas. */
    private BigDecimal montoPagadas;

    /** Cantidad de cuotas pendientes (no vencidas). */
    private Integer cantidadPendientes;

    /** Monto total de cuotas pendientes. */
    private BigDecimal montoPendientes;

    /** Cantidad de cuotas vencidas (en mora). */
    private Integer cantidadVencidas;

    /** Monto total de cuotas vencidas. */
    private BigDecimal montoVencidas;

    /** Monto total general (pagadas + pendientes + vencidas). */
    private BigDecimal montoTotal;
}
