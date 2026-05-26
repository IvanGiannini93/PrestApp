package com.prestapp.infrastructure.config;

import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.model.enums.Rol;
import com.prestapp.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Inicializador que asegura la existencia del usuario admin.
 * <p>
 * Si el usuario admin no existe, lo crea con la contraseña por defecto.
 * Si ya existe, actualiza su contraseña con el hash BCrypt correcto.
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        usuarioRepository.findByUsername("admin").ifPresentOrElse(
                admin -> {
                    // Actualizar password con hash correcto generado por el encoder actual
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    usuarioRepository.save(admin);
                    log.info("Password del admin actualizada correctamente");
                },
                () -> {
                    Usuario admin = Usuario.builder()
                            .username("admin")
                            .password(passwordEncoder.encode("admin123"))
                            .rol(Rol.ADMIN)
                            .build();
                    usuarioRepository.save(admin);
                    log.info("Usuario admin creado exitosamente");
                }
        );
    }
}
