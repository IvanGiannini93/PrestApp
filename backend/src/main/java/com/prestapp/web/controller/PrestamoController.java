package com.prestapp.web.controller;

import com.prestapp.application.dto.request.PrestamoRequest;
import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.PrestamoResponse;
import com.prestapp.application.usecase.PrestamoUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestión de préstamos.
 * <p>
 * Expone endpoints para crear, listar y consultar préstamos.
 * Acceso restringido a usuarios con rol ADMIN.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/prestamos")
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoUseCase prestamoUseCase;

    /**
     * Crea un nuevo préstamo con cálculo automático de cuotas.
     *
     * @param request DTO con parámetros del préstamo
     * @return préstamo creado con cuotas generadas
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PrestamoResponse>> crear(
            @Valid @RequestBody PrestamoRequest request) {
        PrestamoResponse response = prestamoUseCase.crear(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Préstamo creado exitosamente"));
    }

    /**
     * Lista préstamos con paginación, filtrados por estado.
     *
     * @param page   número de página (default 0)
     * @param size   tamaño de página (default 20)
     * @param estado estado a filtrar (default ACTIVO). Usar "TODOS" para todos.
     * @return página de préstamos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PrestamoResponse>>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "ACTIVO") String estado) {
        Page<PrestamoResponse> prestamos = prestamoUseCase.listarPorEstado(estado, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(prestamos, "Préstamos obtenidos exitosamente"));
    }

    /**
     * Obtiene el detalle de un préstamo con sus cuotas.
     *
     * @param id identificador del préstamo
     * @return detalle completo del préstamo
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrestamoResponse>> detalle(@PathVariable Long id) {
        PrestamoResponse response = prestamoUseCase.obtenerDetalle(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Préstamo obtenido exitosamente"));
    }

    /**
     * Cancela un préstamo activo.
     *
     * @param id identificador del préstamo
     * @return préstamo cancelado
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponse<PrestamoResponse>> cancelar(@PathVariable Long id) {
        PrestamoResponse response = prestamoUseCase.cancelar(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Préstamo cancelado exitosamente"));
    }
}
