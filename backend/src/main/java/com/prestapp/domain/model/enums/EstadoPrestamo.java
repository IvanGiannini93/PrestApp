package com.prestapp.domain.model.enums;

/**
 * Estados posibles de un préstamo.
 * <p>
 * Representa el ciclo de vida de un préstamo desde su creación
 * hasta su finalización o entrada en mora.
 * </p>
 */
public enum EstadoPrestamo {

    /** Préstamo vigente con cuotas pendientes de pago. */
    ACTIVO,

    /** Préstamo con todas las cuotas pagadas. */
    COMPLETADO,

    /** Préstamo con al menos una cuota vencida sin pagar. */
    EN_MORA
}
