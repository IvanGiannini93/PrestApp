package com.prestapp.application.usecase;

import com.prestapp.application.dto.response.CuotaResponse;
import com.prestapp.application.mapper.CuotaMapper;
import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.repository.CuotaRepository;
import com.prestapp.domain.repository.PrestamoRepository;
import com.prestapp.web.exception.BusinessException;
import com.prestapp.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Caso de uso para gestión de cuotas y registro de pagos.
 * <p>
 * Maneja el registro de pagos contra cuotas, actualización del saldo
 * del préstamo y transición de estado a COMPLETADO cuando todas las
 * cuotas están pagadas.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class CuotaUseCase {

    private final CuotaRepository cuotaRepository;
    private final PrestamoRepository prestamoRepository;
    private final CuotaMapper cuotaMapper;

    /**
     * Registra el pago de una cuota.
     * <p>
     * Valida que la cuota no esté ya pagada, la marca como pagada,
     * actualiza el saldo restante del préstamo y verifica si todas
     * las cuotas están pagadas para completar el préstamo.
     * </p>
     *
     * @param cuotaId ID de la cuota a pagar
     * @return DTO con la cuota actualizada
     * @throws ResourceNotFoundException si la cuota no existe
     * @throws BusinessException si la cuota ya está pagada
     */
    @Transactional
    public CuotaResponse registrarPago(Long cuotaId) {
        Cuota cuota = cuotaRepository.findById(cuotaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuota", cuotaId));

        if (cuota.getEstado() == EstadoCuota.PAGADA) {
            throw new BusinessException("La cuota #" + cuota.getNumeroCuota() + " ya fue pagada");
        }

        if (cuota.getEstado() == EstadoCuota.CANCELADA) {
            throw new BusinessException("La cuota #" + cuota.getNumeroCuota() + " está cancelada y no se puede pagar");
        }

        // Marcar cuota como pagada
        cuota.setEstado(EstadoCuota.PAGADA);
        cuota.setFechaPago(LocalDate.now());
        cuotaRepository.save(cuota);

        // Actualizar saldo del préstamo
        Prestamo prestamo = cuota.getPrestamo();
        prestamo.setSaldoRestante(prestamo.getSaldoRestante().subtract(cuota.getMonto()));
        
        // Verificar si todas las cuotas están pagadas
        boolean todasPagadas = cuotaRepository.findByPrestamoId(prestamo.getId()).stream()
                .allMatch(c -> c.getEstado() == EstadoCuota.PAGADA);

        if (todasPagadas) {
            prestamo.setEstado(EstadoPrestamo.COMPLETADO);
        }

        prestamoRepository.save(prestamo);

        return cuotaMapper.toResponse(cuota);
    }
}
