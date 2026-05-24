package com.prestapp.web.controller;

import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.ReporteCobranzaResponse;
import com.prestapp.application.usecase.ReporteUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para reportes.
 * <p>
 * Expone el endpoint de reporte de cobranza.
 * Acceso restringido a usuarios con rol ADMIN.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteUseCase reporteUseCase;

    /**
     * Genera el reporte de cobranza con totales por categoría.
     *
     * @return reporte con cuotas pagadas, pendientes y vencidas
     */
    @GetMapping("/cobranza")
    public ResponseEntity<ApiResponse<ReporteCobranzaResponse>> reporteCobranza() {
        ReporteCobranzaResponse response = reporteUseCase.generarReporte();
        return ResponseEntity.ok(ApiResponse.success(response, "Reporte de cobranza generado exitosamente"));
    }
}
