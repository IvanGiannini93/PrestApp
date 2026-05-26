package com.prestapp.domain.model.enums;

/**
 * Frecuencia de pago de un préstamo.
 * <p>
 * Define el intervalo entre cuotas consecutivas.
 * </p>
 */
public enum FrecuenciaPago {

    /** Pago cada día. */
    DIARIA(1),

    /** Pago cada 7 días. */
    SEMANAL(7),

    /** Pago cada 14 días. */
    QUINCENAL(14),

    /** Pago cada 30 días. */
    MENSUAL(30);

    private final int diasEntreCuotas;

    FrecuenciaPago(int diasEntreCuotas) {
        this.diasEntreCuotas = diasEntreCuotas;
    }

    /**
     * Obtiene la cantidad de días entre cuotas.
     *
     * @return número de días entre cuotas consecutivas
     */
    public int getDiasEntreCuotas() {
        return diasEntreCuotas;
    }
}
