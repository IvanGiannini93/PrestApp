package com.prestapp.web.controller;

import com.prestapp.application.dto.request.ClienteRequest;
import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.ClienteResponse;
import com.prestapp.application.usecase.ClienteUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestión de clientes.
 * <p>
 * Expone endpoints para registrar, listar y consultar clientes.
 * Acceso restringido a usuarios con rol ADMIN.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteUseCase clienteUseCase;

    /**
     * Registra un nuevo cliente.
     *
     * @param request DTO con datos del cliente
     * @return cliente registrado con HTTP 201
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ClienteResponse>> registrar(
            @Valid @RequestBody ClienteRequest request) {
        ClienteResponse response = clienteUseCase.registrar(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Cliente registrado exitosamente"));
    }

    /**
     * Lista clientes con paginación.
     *
     * @param page número de página (default 0)
     * @param size tamaño de página (default 10)
     * @return página de clientes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ClienteResponse>>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ClienteResponse> clientes = clienteUseCase.listarPaginado(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(clientes, "Clientes obtenidos exitosamente"));
    }

    /**
     * Obtiene un cliente por su ID.
     *
     * @param id identificador del cliente
     * @return datos del cliente
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponse>> obtenerPorId(@PathVariable Long id) {
        ClienteResponse response = clienteUseCase.obtenerPorId(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Cliente obtenido exitosamente"));
    }
}
