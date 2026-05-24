package com.prestapp.domain.model;

import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.model.enums.FrecuenciaPago;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa un préstamo otorgado a un cliente.
 * <p>
 * Un préstamo define las condiciones financieras (monto, interés, plazo,
 * frecuencia) y contiene las cuotas generadas automáticamente al momento
 * de su creación.
 * </p>
 */
@Entity
@Table(name = "prestamos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prestamo {

    /** Identificador único del préstamo. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Cliente al que pertenece el préstamo. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /** Monto del capital prestado. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    /** Tasa de interés aplicada al préstamo. */
    @Column(name = "tasa_interes", nullable = false, precision = 5, scale = 2)
    private BigDecimal tasaInteres;

    /** Plazo del préstamo en semanas. */
    @Column(nullable = false)
    private Integer plazo;

    /** Frecuencia de pago de las cuotas. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FrecuenciaPago frecuencia;

    /** Fecha de inicio del préstamo. */
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    /** Saldo restante por cobrar. */
    @Column(name = "saldo_restante", nullable = false, precision = 12, scale = 2)
    private BigDecimal saldoRestante;

    /** Estado actual del préstamo. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoPrestamo estado = EstadoPrestamo.ACTIVO;

    /** Cuotas del préstamo. */
    @OneToMany(mappedBy = "prestamo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Cuota> cuotas = new ArrayList<>();

    /** Fecha de creación del registro. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Fecha de última actualización del registro. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Establece las fechas de auditoría antes de persistir.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Actualiza la fecha de modificación antes de actualizar.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
