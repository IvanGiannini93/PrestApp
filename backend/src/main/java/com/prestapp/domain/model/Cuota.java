package com.prestapp.domain.model;

import com.prestapp.domain.model.enums.EstadoCuota;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa una cuota individual de un préstamo.
 * <p>
 * Cada cuota tiene un monto fijo, una fecha de vencimiento y un estado
 * que indica si fue pagada, está pendiente o se encuentra en mora.
 * </p>
 */
@Entity
@Table(name = "cuotas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cuota {

    /** Identificador único de la cuota. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Préstamo al que pertenece la cuota. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;

    /** Número secuencial de la cuota dentro del préstamo. */
    @Column(name = "numero_cuota", nullable = false)
    private Integer numeroCuota;

    /** Monto a pagar en esta cuota. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    /** Fecha en la que vence el pago de esta cuota. */
    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    /** Fecha en la que se registró el pago (null si no fue pagada). */
    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    /** Estado actual de la cuota. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoCuota estado = EstadoCuota.PENDIENTE;

    /** Fecha de creación del registro. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Establece la fecha de creación antes de persistir.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Verifica si la cuota está vencida.
     *
     * @return true si la fecha de vencimiento pasó y no fue pagada
     */
    public boolean isVencida() {
        return estado == EstadoCuota.PENDIENTE
                && fechaVencimiento.isBefore(LocalDate.now());
    }
}
