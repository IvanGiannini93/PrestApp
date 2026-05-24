package com.prestapp.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO de solicitud para registro de pago de una cuota.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoRequest {

    /** Monto del pago (debe ser mayor a cero). */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal monto;
}
