package com.prestapp.application.usecase;

import com.prestapp.application.dto.request.LoginRequest;
import com.prestapp.application.dto.response.LoginResponse;
import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.repository.ClienteRepository;
import com.prestapp.domain.repository.UsuarioRepository;
import com.prestapp.infrastructure.external.EmailService;
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
    private final ClienteRepository clienteRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

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
                .displayName(obtenerDisplayName(usuario))
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

    /**
     * Solicita la recuperación de contraseña.
     * <p>
     * Genera un token de 6 dígitos, lo almacena en el usuario con una
     * expiración de 15 minutos y envía un email con el código.
     * </p>
     *
     * @param username nombre de usuario que solicita la recuperación
     * @throws IllegalArgumentException si el usuario no existe
     */
    @Transactional
    public void solicitarRecuperacion(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Si el usuario existe, recibirá un email con instrucciones"));

        // Generar token de 6 dígitos
        String token = String.format("%06d", new java.util.Random().nextInt(999999));
        usuario.setResetToken(token);
        usuario.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        // Enviar email (si tiene email asociado)
        String email = obtenerEmailUsuario(usuario);
        if (email != null) {
            emailService.sendEmail(email,
                    "PrestApp - Recuperación de contraseña",
                    "Tu código de recuperación es: " + token + "\n\nEste código expira en 15 minutos."
            );
        }
    }

    /**
     * Resetea la contraseña usando el token de recuperación.
     *
     * @param token       token de recuperación
     * @param newPassword nueva contraseña
     * @throws IllegalArgumentException si el token es inválido o expiró
     */
    @Transactional
    public void resetearPassword(String token, String newPassword) {
        Usuario usuario = usuarioRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Código de recuperación inválido"));

        if (usuario.getResetTokenExpiry() == null || usuario.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El código de recuperación ha expirado");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);
    }

    /**
     * Obtiene el email del usuario (directo si es el username, o del cliente asociado).
     */
    private String obtenerEmailUsuario(Usuario usuario) {
        // Si el username parece un email, usarlo directamente
        if (usuario.getUsername().contains("@")) {
            return usuario.getUsername();
        }
        // Para admin u otros, no tenemos email directo
        return null;
    }

    /**
     * Obtiene los datos del perfil del usuario.
     * Si es cliente, incluye datos del cliente (razón social, documento, teléfono, email).
     *
     * @param username nombre de usuario
     * @return mapa con datos del perfil
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> obtenerPerfil(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        java.util.Map<String, Object> perfil = new java.util.LinkedHashMap<>();
        perfil.put("username", usuario.getUsername());
        perfil.put("createdAt", usuario.getCreatedAt());

        if (usuario.getClienteId() != null) {
            clienteRepository.findById(usuario.getClienteId()).ifPresent(cliente -> {
                perfil.put("documento", cliente.getDocumento());
                perfil.put("razonSocial", cliente.getRazonSocial());
                perfil.put("responsable", cliente.getResponsable());
                perfil.put("telefono", cliente.getTelefono());
                perfil.put("email", cliente.getEmail());
            });
        }

        return perfil;
    }

    /**
     * Obtiene el nombre para mostrar del usuario.
     * Para clientes devuelve el nombre del responsable, para admin devuelve "Admin".
     */
    private String obtenerDisplayName(Usuario usuario) {
        if (usuario.getClienteId() != null) {
            return clienteRepository.findById(usuario.getClienteId())
                    .map(c -> c.getResponsable())
                    .orElse(usuario.getUsername());
        }
        return "Admin";
    }
}
