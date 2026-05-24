package com.prestapp.domain.model.enums;

/**
 * Roles de usuario en el sistema.
 * <p>
 * Define los niveles de acceso disponibles:
 * ADMIN para el prestamista y CLIENTE para los prestatarios.
 * </p>
 */
public enum Rol {

    /** Rol de administrador con acceso completo al sistema. */
    ADMIN,

    /** Rol de cliente con acceso limitado a su portal. */
    CLIENTE
}
