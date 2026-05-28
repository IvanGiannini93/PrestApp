package com.prestapp.domain.model;

import com.prestapp.domain.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa un usuario del sistema.
 * <p>
 * Los usuarios pueden tener rol ADMIN (prestamista) o CLIENTE (prestatario).
 * Cada usuario CLIENTE está asociado a un registro de {@link Cliente}.
 * </p>
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    /** Identificador único del usuario. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre de usuario para autenticación. */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** Contraseña encriptada con BCrypt. */
    @Column(nullable = false)
    private String password;

    /** Rol del usuario en el sistema. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    /** ID del cliente asociado (solo para rol CLIENTE). */
    @Column(name = "cliente_id")
    private Long clienteId;

    /** Cantidad de intentos de login fallidos consecutivos. */
    @Column(name = "intentos_fallidos", nullable = false)
    @Builder.Default
    private Integer intentosFallidos = 0;

    /** Fecha y hora hasta la cual la cuenta está bloqueada. */
    @Column(name = "bloqueado_hasta")
    private LocalDateTime bloqueadoHasta;

    /** Token para recuperación de contraseña. */
    @Column(name = "reset_token")
    private String resetToken;

    /** Fecha de expiración del token de recuperación. */
    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

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
     * Verifica si la cuenta está actualmente bloqueada.
     *
     * @return true si la cuenta está bloqueada, false en caso contrario
     */
    public boolean isAccountLocked() {
        return bloqueadoHasta != null && LocalDateTime.now().isBefore(bloqueadoHasta);
    }
}
