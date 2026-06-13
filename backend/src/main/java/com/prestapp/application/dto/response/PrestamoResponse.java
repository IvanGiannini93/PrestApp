package com.prestapp.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de respuesta con datos de un préstamo.
 * <p>
 * Incluye información del préstamo y opcionalmente sus cuotas.
 * </p>
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrestamoResponse {

    /** Identificador del préstamo. */
    private Long id;

    /** ID del cliente. */
    private Long clienteId;

    /** Nombre del cliente (razón social). */
    private String clienteNombre;

    /** Documento del cliente. */
    private String clienteDocumento;

    /** Monto del capital. */
    private BigDecimal monto;

    /** Tasa de interés. */
    private BigDecimal tasaInteres;

    /** Plazo en semanas. */
    private Integer plazo;

    /** Frecuencia de pago. */
    private String frecuencia;

    /** Fecha de inicio. */
    private LocalDate fechaInicio;

    /** Saldo restante por cobrar. */
    private BigDecimal saldoRestante;

    /** Estado del préstamo. */
    private String estado;

    /** Número total de cuotas. */
    private Integer totalCuotas;

    /** Número de cuotas pagadas. */
    private Integer cuotasPagadas;

    /** Número de cuotas pendientes. */
    private Integer cuotasPendientes;

    /** Lista de cuotas (incluida en detalle). */
    private List<CuotaResponse> cuotas;

    /** Fecha de creación. */
    private LocalDateTime createdAt;
}
