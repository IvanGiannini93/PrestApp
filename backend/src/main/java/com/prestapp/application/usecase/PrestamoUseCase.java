package com.prestapp.application.usecase;

import com.prestapp.application.dto.request.PrestamoRequest;
import com.prestapp.application.dto.response.PrestamoResponse;
import com.prestapp.application.mapper.PrestamoMapper;
import com.prestapp.domain.model.Cliente;
import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.model.enums.FrecuenciaPago;
import com.prestapp.domain.repository.ClienteRepository;
import com.prestapp.domain.repository.CuotaRepository;
import com.prestapp.domain.repository.PrestamoRepository;
import com.prestapp.domain.service.CuotaCalculatorService;
import com.prestapp.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Caso de uso para gestión de préstamos.
 * <p>
 * Orquesta la creación de préstamos con cálculo automático de cuotas,
 * consulta de préstamos activos y obtención de detalles.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class PrestamoUseCase {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final CuotaRepository cuotaRepository;
    private final CuotaCalculatorService cuotaCalculatorService;
    private final PrestamoMapper prestamoMapper;

    /**
     * Crea un nuevo préstamo con cálculo automático de cuotas.
     * <p>
     * Valida que el cliente exista, crea el préstamo, calcula las cuotas
     * según los parámetros y persiste todo en una transacción.
     * </p>
     *
     * @param request DTO con parámetros del préstamo
     * @return DTO con el préstamo creado y sus cuotas
     * @throws ResourceNotFoundException si el cliente no existe
     */
    @Transactional
    public PrestamoResponse crear(PrestamoRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", request.getClienteId()));

        FrecuenciaPago frecuencia = FrecuenciaPago.valueOf(request.getFrecuencia());

        Prestamo prestamo = Prestamo.builder()
                .cliente(cliente)
                .monto(request.getMonto())
                .tasaInteres(request.getTasaInteres())
                .plazo(request.getPlazo())
                .frecuencia(frecuencia)
                .fechaInicio(request.getFechaInicio())
                .estado(EstadoPrestamo.ACTIVO)
                .build();

        // Calcular monto total para el saldo restante
        prestamo.setSaldoRestante(
                cuotaCalculatorService.calcularMontoTotal(request.getMonto(), request.getTasaInteres())
        );

        Prestamo saved = prestamoRepository.save(prestamo);

        // Generar cuotas
        List<Cuota> cuotas = cuotaCalculatorService.calcularCuotas(saved);
        List<Cuota> savedCuotas = cuotaRepository.saveAll(cuotas);
        saved.setCuotas(savedCuotas);

        return prestamoMapper.toResponse(saved, true);
    }

    /**
     * Lista préstamos activos con paginación.
     *
     * @param pageable configuración de paginación
     * @return página de préstamos activos
     */
    @Transactional(readOnly = true)
    public Page<PrestamoResponse> listarActivos(Pageable pageable) {
        return prestamoRepository.findByEstado(EstadoPrestamo.ACTIVO, pageable)
                .map(prestamoMapper::toResponse);
    }

    /**
     * Obtiene el detalle de un préstamo con sus cuotas.
     *
     * @param id identificador del préstamo
     * @return DTO con detalle completo del préstamo
     * @throws ResourceNotFoundException si el préstamo no existe
     */
    @Transactional(readOnly = true)
    public PrestamoResponse obtenerDetalle(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo", id));
        return prestamoMapper.toResponse(prestamo, true);
    }
}
