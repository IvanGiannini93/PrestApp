package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO con datos de ganancias por mes para gráficos.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GananciaMensualResponse {

    /** Nombre del mes (ej: "Jun"). */
    private String mes;

    /** Cobro total bruto (capital + interés). */
    private BigDecimal bruto;

    /** Ganancia neta (solo interés). */
    private BigDecimal neto;
}
