package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO con datos de cobros por semana para gráficos.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CobroSemanalResponse {

    /** Etiqueta de la semana (ej: "Sem 1 Jun"). */
    private String semana;

    /** Monto cobrado en esa semana. */
    private BigDecimal cobrado;

    /** Monto esperado (cuotas que vencían esa semana). */
    private BigDecimal esperado;

    /** Cobro acumulado hasta esa semana. */
    private BigDecimal acumulado;
}
