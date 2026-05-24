package com.prestapp.application.usecase;

import com.prestapp.application.dto.response.ReporteCobranzaResponse;
import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.repository.CuotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Caso de uso para generación de reportes de cobranza.
 * <p>
 * Categoriza las cuotas de préstamos activos en pagadas, pendientes
 * y vencidas, calculando totales por categoría.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class ReporteUseCase {

    private final CuotaRepository cuotaRepository;

    /**
     * Genera el reporte de cobranza con totales por categoría.
     * <p>
     * Clasifica las cuotas usando la fecha actual como referencia:
     * - Pagadas: cuotas con estado PAGADA
     * - Vencidas: cuotas con fecha de vencimiento pasada y sin pago
     * - Pendientes: cuotas sin pago y con fecha de vencimiento futura
     * </p>
     *
     * @return DTO con el reporte de cobranza
     */
    @Transactional(readOnly = true)
    public ReporteCobranzaResponse generarReporte() {
        List<Cuota> todasLasCuotas = cuotaRepository.findAllByPrestamoEstadoActivo();
        LocalDate hoy = LocalDate.now();

        List<Cuota> pagadas = todasLasCuotas.stream()
                .filter(c -> c.getEstado() == EstadoCuota.PAGADA)
                .toList();

        List<Cuota> vencidas = todasLasCuotas.stream()
                .filter(c -> c.getEstado() != EstadoCuota.PAGADA
                        && c.getFechaVencimiento().isBefore(hoy))
                .toList();

        List<Cuota> pendientes = todasLasCuotas.stream()
                .filter(c -> c.getEstado() != EstadoCuota.PAGADA
                        && !c.getFechaVencimiento().isBefore(hoy))
                .toList();

        BigDecimal montoPagadas = sumarMontos(pagadas);
        BigDecimal montoVencidas = sumarMontos(vencidas);
        BigDecimal montoPendientes = sumarMontos(pendientes);

        return ReporteCobranzaResponse.builder()
                .cantidadPagadas(pagadas.size())
                .montoPagadas(montoPagadas)
                .cantidadVencidas(vencidas.size())
                .montoVencidas(montoVencidas)
                .cantidadPendientes(pendientes.size())
                .montoPendientes(montoPendientes)
                .montoTotal(montoPagadas.add(montoVencidas).add(montoPendientes))
                .build();
    }

    /**
     * Suma los montos de una lista de cuotas.
     *
     * @param cuotas lista de cuotas
     * @return suma total de montos
     */
    private BigDecimal sumarMontos(List<Cuota> cuotas) {
        return cuotas.stream()
                .map(Cuota::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
