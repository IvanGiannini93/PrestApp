package com.prestapp.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa un cliente (prestatario) del sistema.
 * <p>
 * Un cliente tiene información comercial y puede tener múltiples
 * préstamos asociados a lo largo del tiempo.
 * </p>
 */
@Entity
@Table(name = "clientes",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_clientes_razon_responsable",
                columnNames = {"razon_social", "responsable"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    /** Identificador único del cliente. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Razón social o nombre del comercio. */
    @Column(name = "razon_social", nullable = false, length = 150)
    private String razonSocial;

    /** Nombre de la persona responsable del comercio. */
    @Column(nullable = false, length = 100)
    private String responsable;

    /** Número de teléfono de contacto. */
    @Column(nullable = false, length = 20)
    private String telefono;

    /** Correo electrónico de contacto. */
    @Column(nullable = false, length = 100)
    private String email;

    /** Préstamos asociados al cliente. */
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Prestamo> prestamos = new ArrayList<>();

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
