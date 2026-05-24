package com.prestapp.web.controller;

import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.CuotaResponse;
import com.prestapp.application.dto.response.PrestamoResponse;
import com.prestapp.application.mapper.CuotaMapper;
import com.prestapp.application.mapper.PrestamoMapper;
import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.repository.CuotaRepository;
import com.prestapp.domain.repository.PrestamoRepository;
import com.prestapp.infrastructure.security.JwtAuthenticatedUser;
import com.prestapp.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST del portal del cliente.
 * <p>
 * Expone endpoints para que el cliente consulte sus préstamos activos,
 * cuotas pendientes e historial. Todos los datos se filtran por el
 * clienteId extraído del token JWT.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PortalClienteController {

    private final PrestamoRepository prestamoRepository;
    private final CuotaRepository cuotaRepository;
    private final PrestamoMapper prestamoMapper;
    private final CuotaMapper cuotaMapper;

    /**
     * Obtiene los préstamos activos del cliente logueado.
     *
     * @param user usuario autenticado (extraído del JWT)
     * @return lista de préstamos activos del cliente
     */
    @GetMapping("/mi-prestamo")
    public ResponseEntity<ApiResponse<List<PrestamoResponse>>> misPrestamosActivos(
            @AuthenticationPrincipal JwtAuthenticatedUser user) {

        List<Prestamo> prestamos = prestamoRepository.findByClienteIdAndEstado(
                user.getClienteId(), EstadoPrestamo.ACTIVO);

        List<PrestamoResponse> response = prestamos.stream()
                .map(p -> prestamoMapper.toResponse(p, false))
                .toList();

        return ResponseEntity.ok(ApiResponse.success(response, "Préstamos activos obtenidos"));
    }

    /**
     * Obtiene el detalle de un préstamo del cliente logueado.
     *
     * @param id   ID del préstamo
     * @param user usuario autenticado
     * @return detalle del préstamo con cuotas
     * @throws ResourceNotFoundException si el préstamo no existe o no pertenece al cliente
     */
    @GetMapping("/mi-prestamo/{id}")
    public ResponseEntity<ApiResponse<PrestamoResponse>> miPrestamoDetalle(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtAuthenticatedUser user) {

        Prestamo prestamo = prestamoRepository.findById(id)
                .filter(p -> p.getCliente().getId().equals(user.getClienteId()))
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo", id));

        PrestamoResponse response = prestamoMapper.toResponse(prestamo, true);
        return ResponseEntity.ok(ApiResponse.success(response, "Detalle del préstamo obtenido"));
    }

    /**
     * Obtiene las cuotas pendientes del cliente logueado.
     *
     * @param user usuario autenticado
     * @return lista de cuotas pendientes ordenadas por fecha de vencimiento
     */
    @GetMapping("/mis-cuotas")
    public ResponseEntity<ApiResponse<List<CuotaResponse>>> misCuotasPendientes(
            @AuthenticationPrincipal JwtAuthenticatedUser user) {

        List<Prestamo> prestamosActivos = prestamoRepository.findByClienteIdAndEstado(
                user.getClienteId(), EstadoPrestamo.ACTIVO);

        List<CuotaResponse> cuotasPendientes = prestamosActivos.stream()
                .flatMap(p -> cuotaRepository.findByPrestamoId(p.getId()).stream())
                .filter(c -> c.getEstado() != EstadoCuota.PAGADA)
                .sorted((a, b) -> a.getFechaVencimiento().compareTo(b.getFechaVencimiento()))
                .map(cuotaMapper::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(cuotasPendientes, "Cuotas pendientes obtenidas"));
    }

    /**
     * Obtiene el historial de préstamos completados del cliente logueado.
     *
     * @param user usuario autenticado
     * @return lista de préstamos completados ordenados por fecha descendente
     */
    @GetMapping("/mi-historial")
    public ResponseEntity<ApiResponse<List<PrestamoResponse>>> miHistorial(
            @AuthenticationPrincipal JwtAuthenticatedUser user) {

        List<Prestamo> completados = prestamoRepository.findByClienteIdAndEstado(
                user.getClienteId(), EstadoPrestamo.COMPLETADO);

        List<PrestamoResponse> response = completados.stream()
                .map(prestamoMapper::toResponse)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(ApiResponse.success(response, "Historial de préstamos obtenido"));
    }
}
