package com.prestapp.domain.model.enums;

/**
 * Estados posibles de una cuota.
 * <p>
 * Representa el estado de pago de una cuota individual
 * dentro de un préstamo.
 * </p>
 */
public enum EstadoCuota {

    /** Cuota aún no pagada y dentro del plazo de vencimiento. */
    PENDIENTE,

    /** Cuota pagada satisfactoriamente. */
    PAGADA,

    /** Cuota no pagada cuya fecha de vencimiento ya pasó. */
    EN_MORA,

    /** Cuota cancelada (préstamo cancelado). */
    CANCELADA
}
