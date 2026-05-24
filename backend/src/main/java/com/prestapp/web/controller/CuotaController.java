package com.prestapp.web.controller;

import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.CuotaResponse;
import com.prestapp.application.usecase.CuotaUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestión de cuotas.
 * <p>
 * Expone el endpoint para registrar pagos de cuotas.
 * Acceso restringido a usuarios con rol ADMIN.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/cuotas")
@RequiredArgsConstructor
public class CuotaController {

    private final CuotaUseCase cuotaUseCase;

    /**
     * Registra el pago de una cuota.
     *
     * @param id ID de la cuota a pagar
     * @return cuota actualizada con estado PAGADA
     */
    @PatchMapping("/{id}/pagar")
    public ResponseEntity<ApiResponse<CuotaResponse>> registrarPago(@PathVariable Long id) {
        CuotaResponse response = cuotaUseCase.registrarPago(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Pago registrado exitosamente"));
    }
}
