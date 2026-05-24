package com.prestapp.application.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de solicitud para creación de préstamos.
 * <p>
 * Contiene los parámetros necesarios para crear un préstamo
 * con validaciones de rangos permitidos.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrestamoRequest {

    /** ID del cliente al que se otorga el préstamo. */
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    /** Monto del capital (entre 1,000 y 10,000,000). */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "1000", message = "El monto mínimo es 1,000")
    @DecimalMax(value = "10000000", message = "El monto máximo es 10,000,000")
    private BigDecimal monto;

    /** Tasa de interés anual (entre 0.1% y 100%). */
    @NotNull(message = "La tasa de interés es obligatoria")
    @DecimalMin(value = "0.1", message = "La tasa de interés mínima es 0.1%")
    @DecimalMax(value = "100", message = "La tasa de interés máxima es 100%")
    private BigDecimal tasaInteres;

    /** Plazo en semanas (entre 1 y 52). */
    @NotNull(message = "El plazo es obligatorio")
    @Min(value = 1, message = "El plazo mínimo es 1 semana")
    @Max(value = 52, message = "El plazo máximo es 52 semanas")
    private Integer plazo;

    /** Frecuencia de pago: SEMANAL o QUINCENAL. */
    @NotBlank(message = "La frecuencia de pago es obligatoria")
    @Pattern(regexp = "SEMANAL|QUINCENAL", message = "La frecuencia debe ser SEMANAL o QUINCENAL")
    private String frecuencia;

    /** Fecha de inicio del préstamo. */
    @NotNull(message = "La fecha de inicio es obligatoria")
    @FutureOrPresent(message = "La fecha de inicio no puede ser en el pasado")
    private LocalDate fechaInicio;
}
