package com.prestapp.web.controller;

import com.prestapp.application.dto.request.CambiarPasswordRequest;
import com.prestapp.application.dto.request.LoginRequest;
import com.prestapp.application.dto.request.RecuperarPasswordRequest;
import com.prestapp.application.dto.request.ResetPasswordRequest;
import com.prestapp.application.dto.response.ApiResponse;
import com.prestapp.application.dto.response.LoginResponse;
import com.prestapp.application.usecase.AuthUseCase;
import com.prestapp.infrastructure.security.JwtAuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador REST de autenticación.
 * <p>
 * Expone endpoints de login y cambio de contraseña.
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

    /**
     * Cambia la contraseña del usuario autenticado.
     *
     * @param request DTO con contraseña actual y nueva
     * @param user usuario autenticado
     * @return confirmación del cambio
     */
    @PatchMapping("/cambiar-password")
    public ResponseEntity<ApiResponse<Void>> cambiarPassword(
            @Valid @RequestBody CambiarPasswordRequest request,
            @AuthenticationPrincipal JwtAuthenticatedUser user) {
        authUseCase.cambiarPassword(user.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "Contraseña actualizada exitosamente"));
    }

    /**
     * Obtiene el perfil del usuario autenticado.
     *
     * @param user usuario autenticado
     * @return datos del perfil
     */
    @GetMapping("/perfil")
    public ResponseEntity<ApiResponse<Map<String, Object>>> perfil(
            @AuthenticationPrincipal JwtAuthenticatedUser user) {
        Map<String, Object> perfil = authUseCase.obtenerPerfil(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success(perfil, "Perfil obtenido"));
    }

    /**
     * Solicita la recuperación de contraseña.
     * Envía un código de 6 dígitos al email del usuario.
     *
     * @param request DTO con el username
     * @return confirmación (siempre exitosa por seguridad)
     */
    @PostMapping("/recuperar-password")
    public ResponseEntity<ApiResponse<Void>> recuperarPassword(
            @Valid @RequestBody RecuperarPasswordRequest request) {
        try {
            authUseCase.solicitarRecuperacion(request.getUsername());
        } catch (Exception e) {
            // No revelar si el usuario existe o no
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Si el usuario existe, recibirá un email con el código de recuperación"));
    }

    /**
     * Resetea la contraseña usando el código de recuperación.
     *
     * @param request DTO con token y nueva contraseña
     * @return confirmación del reset
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authUseCase.resetearPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success(null, "Contraseña restablecida exitosamente"));
    }
}
