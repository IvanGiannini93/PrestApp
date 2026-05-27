package com.prestapp.application.usecase;

import com.prestapp.application.dto.request.LoginRequest;
import com.prestapp.application.dto.response.LoginResponse;
import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.repository.UsuarioRepository;
import com.prestapp.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Caso de uso de autenticación.
 * <p>
 * Gestiona el proceso de login incluyendo validación de credenciales,
 * control de intentos fallidos, bloqueo temporal de cuentas y
 * generación de tokens JWT.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AuthUseCase {

    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.max-failed-attempts}")
    private int maxFailedAttempts;

    @Value("${app.security.lock-duration-minutes}")
    private int lockDurationMinutes;

    /**
     * Autentica un usuario con sus credenciales.
     * <p>
     * Valida las credenciales, verifica el bloqueo de cuenta,
     * gestiona los intentos fallidos y genera un token JWT si
     * la autenticación es exitosa.
     * </p>
     *
     * @param request DTO con username y password
     * @return respuesta con token JWT y rol del usuario
     * @throws IllegalArgumentException si las credenciales son inválidas o la cuenta está bloqueada
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (usuario.isAccountLocked()) {
            throw new IllegalArgumentException("Cuenta bloqueada temporalmente. Intente nuevamente más tarde");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            handleFailedAttempt(usuario);
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        resetFailedAttempts(usuario);

        String token = jwtTokenProvider.generateToken(
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getClienteId()
        );

        return LoginResponse.builder()
                .token(token)
                .rol(usuario.getRol().name())
                .username(usuario.getUsername())
                .build();
    }

    /**
     * Maneja un intento de login fallido.
     * <p>
     * Incrementa el contador de intentos fallidos y bloquea la cuenta
     * si se alcanza el máximo de intentos permitidos.
     * </p>
     *
     * @param usuario el usuario que falló la autenticación
     */
    private void handleFailedAttempt(Usuario usuario) {
        int newAttempts = usuario.getIntentosFallidos() + 1;
        usuario.setIntentosFallidos(newAttempts);

        if (newAttempts >= maxFailedAttempts) {
            usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(lockDurationMinutes));
        }

        usuarioRepository.save(usuario);
    }

    /**
     * Reinicia el contador de intentos fallidos tras un login exitoso.
     *
     * @param usuario el usuario autenticado exitosamente
     */
    private void resetFailedAttempts(Usuario usuario) {
        if (usuario.getIntentosFallidos() > 0) {
            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
            usuarioRepository.save(usuario);
        }
    }

    /**
     * Cambia la contraseña del usuario autenticado.
     *
     * @param username nombre de usuario
     * @param request  DTO con contraseña actual y nueva
     * @throws IllegalArgumentException si la contraseña actual es incorrecta
     */
    @Transactional
    public void cambiarPassword(String username, com.prestapp.application.dto.request.CambiarPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }
}
