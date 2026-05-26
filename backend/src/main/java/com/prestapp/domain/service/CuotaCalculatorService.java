package com.prestapp.domain.service;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.FrecuenciaPago;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de dominio para el cálculo de cuotas de un préstamo.
 * <p>
 * Genera las cuotas de un préstamo basándose en el monto, tasa de interés,
 * plazo y frecuencia de pago. Distribuye el monto total equitativamente
 * entre las cuotas, asignando el residuo de redondeo a la última cuota
 * para garantizar la integridad del monto total.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
public class CuotaCalculatorService {

    /**
     * Calcula y genera las cuotas para un préstamo dado.
     * <p>
     * El cálculo sigue la siguiente lógica:
     * <ol>
     *   <li>Calcula el monto total: capital × (1 + tasaInteres / 100)</li>
     *   <li>Determina el número de cuotas: plazo / frecuenciaEnSemanas</li>
     *   <li>Distribuye el monto equitativamente, redondeando a 2 decimales</li>
     *   <li>Asigna el residuo de redondeo a la última cuota</li>
     *   <li>Genera fechas de vencimiento según la frecuencia</li>
     * </ol>
     * </p>
     *
     * @param prestamo el préstamo para el cual generar cuotas
     * @return lista de cuotas generadas con montos y fechas calculados
     * @throws IllegalArgumentException si los parámetros producen menos de una cuota
     */
    public List<Cuota> calcularCuotas(Prestamo prestamo) {
        BigDecimal montoTotal = calcularMontoTotal(prestamo.getMonto(), prestamo.getTasaInteres());
        int numeroCuotas = prestamo.getPlazo();

        if (numeroCuotas < 1) {
            throw new IllegalArgumentException(
                    "El plazo debe ser al menos 1 cuota. Plazo: " + prestamo.getPlazo()
            );
        }

        BigDecimal montoCuota = calcularMontoCuota(montoTotal, numeroCuotas);
        BigDecimal montoUltimaCuota = calcularMontoUltimaCuota(montoTotal, montoCuota, numeroCuotas);

        List<Cuota> cuotas = new ArrayList<>();

        for (int i = 1; i <= numeroCuotas; i++) {
            BigDecimal montoActual = (i == numeroCuotas) ? montoUltimaCuota : montoCuota;
            LocalDate fechaVencimiento = calcularFechaVencimiento(
                    prestamo.getFechaInicio(), prestamo.getFrecuencia(), i
            );

            Cuota cuota = Cuota.builder()
                    .prestamo(prestamo)
                    .numeroCuota(i)
                    .monto(montoActual)
                    .fechaVencimiento(fechaVencimiento)
                    .estado(EstadoCuota.PENDIENTE)
                    .build();

            cuotas.add(cuota);
        }

        return cuotas;
    }

    /**
     * Calcula el monto total del préstamo (capital + interés).
     *
     * @param monto      monto del capital
     * @param tasaInteres tasa de interés en porcentaje
     * @return monto total a pagar
     */
    public BigDecimal calcularMontoTotal(BigDecimal monto, BigDecimal tasaInteres) {
        BigDecimal factor = BigDecimal.ONE.add(tasaInteres.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP));
        return monto.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcula el número de cuotas (ahora es directamente el plazo).
     *
     * @param plazo número de cuotas
     * @param frecuencia frecuencia de pago (no afecta el cálculo)
     * @return número de cuotas
     * @deprecated El plazo ahora representa directamente el número de cuotas
     */
    public int calcularNumeroCuotas(int plazo, FrecuenciaPago frecuencia) {
        return plazo;
    }

    /**
     * Calcula el monto de cada cuota (excepto la última).
     *
     * @param montoTotal   monto total a distribuir
     * @param numeroCuotas número de cuotas
     * @return monto por cuota redondeado a 2 decimales
     */
    private BigDecimal calcularMontoCuota(BigDecimal montoTotal, int numeroCuotas) {
        return montoTotal.divide(BigDecimal.valueOf(numeroCuotas), 2, RoundingMode.FLOOR);
    }

    /**
     * Calcula el monto de la última cuota absorbiendo el residuo de redondeo.
     * <p>
     * Garantiza que la suma de todas las cuotas sea exactamente igual al monto total.
     * </p>
     *
     * @param montoTotal   monto total del préstamo
     * @param montoCuota   monto de las cuotas regulares
     * @param numeroCuotas número total de cuotas
     * @return monto de la última cuota
     */
    private BigDecimal calcularMontoUltimaCuota(BigDecimal montoTotal, BigDecimal montoCuota, int numeroCuotas) {
        BigDecimal sumaCuotasRegulares = montoCuota.multiply(BigDecimal.valueOf(numeroCuotas - 1));
        return montoTotal.subtract(sumaCuotasRegulares);
    }

    /**
     * Calcula la fecha de vencimiento de una cuota específica.
     *
     * @param fechaInicio fecha de inicio del préstamo
     * @param frecuencia  frecuencia de pago
     * @param numeroCuota número de la cuota (1-based)
     * @return fecha de vencimiento de la cuota
     */
    private LocalDate calcularFechaVencimiento(LocalDate fechaInicio, FrecuenciaPago frecuencia, int numeroCuota) {
        int diasOffset = frecuencia.getDiasEntreCuotas() * numeroCuota;
        return fechaInicio.plusDays(diasOffset);
    }
}
