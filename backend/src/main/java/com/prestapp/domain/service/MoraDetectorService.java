package com.prestapp.domain.service;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Servicio de dominio para la detección de cuotas en mora.
 * <p>
 * Evalúa cuotas pendientes cuya fecha de vencimiento ha pasado
 * y las marca como en mora. También actualiza el estado del préstamo
 * si tiene cuotas vencidas.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
public class MoraDetectorService {

    /**
     * Detecta y marca las cuotas vencidas de una lista de cuotas.
     * <p>
     * Una cuota se considera en mora cuando su fecha de vencimiento
     * es anterior a la fecha de referencia y su estado es PENDIENTE.
     * </p>
     *
     * @param cuotas         lista de cuotas a evaluar
     * @param fechaReferencia fecha contra la cual comparar los vencimientos
     * @return número de cuotas marcadas como en mora
     */
    public int detectarMora(List<Cuota> cuotas, LocalDate fechaReferencia) {
        int cuotasEnMora = 0;

        for (Cuota cuota : cuotas) {
            if (esVencida(cuota, fechaReferencia)) {
                cuota.setEstado(EstadoCuota.EN_MORA);
                cuotasEnMora++;
            }
        }

        return cuotasEnMora;
    }

    /**
     * Actualiza el estado de un préstamo basándose en sus cuotas.
     * <p>
     * Si el préstamo tiene al menos una cuota en mora, su estado
     * se actualiza a EN_MORA. Si todas las cuotas están pagadas,
     * se marca como COMPLETADO.
     * </p>
     *
     * @param prestamo el préstamo a evaluar
     */
    public void actualizarEstadoPrestamo(Prestamo prestamo) {
        List<Cuota> cuotas = prestamo.getCuotas();

        if (cuotas == null || cuotas.isEmpty()) {
            return;
        }

        boolean todasPagadas = cuotas.stream()
                .allMatch(c -> c.getEstado() == EstadoCuota.PAGADA);

        if (todasPagadas) {
            prestamo.setEstado(EstadoPrestamo.COMPLETADO);
            return;
        }

        boolean tieneEnMora = cuotas.stream()
                .anyMatch(c -> c.getEstado() == EstadoCuota.EN_MORA);

        if (tieneEnMora) {
            prestamo.setEstado(EstadoPrestamo.EN_MORA);
        } else {
            prestamo.setEstado(EstadoPrestamo.ACTIVO);
        }
    }

    /**
     * Verifica si una cuota está vencida respecto a una fecha de referencia.
     *
     * @param cuota           la cuota a evaluar
     * @param fechaReferencia la fecha contra la cual comparar
     * @return true si la cuota está pendiente y su vencimiento ya pasó
     */
    private boolean esVencida(Cuota cuota, LocalDate fechaReferencia) {
        return cuota.getEstado() == EstadoCuota.PENDIENTE
                && cuota.getFechaVencimiento().isBefore(fechaReferencia);
    }
}
