package com.prestapp.web.controller;

import com.prestapp.application.dto.request.LoginRequest;
import com.prestapp.application.dto.response.LoginResponse;
import com.prestapp.application.usecase.AuthUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador REST de autenticación.
 * <p>
 * Expone el endpoint de login para administradores y clientes.
 * Genera tokens JWT tras una autenticación exitosa.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;

    /**
     * Autentica un usuario y devuelve un token JWT.
     *
     * @param request DTO con credenciales (username y password)
     * @return respuesta con token JWT, rol y username
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authUseCase.login(request);

        return ResponseEntity.ok(Map.of(
                "data", loginResponse,
                "message", "Login exitoso"
        ));
    }
}
