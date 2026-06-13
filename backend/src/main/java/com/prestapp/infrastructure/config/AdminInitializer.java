package com.prestapp.infrastructure.config;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.model.enums.Rol;
import com.prestapp.domain.repository.CuotaRepository;
import com.prestapp.domain.repository.PrestamoRepository;
import com.prestapp.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Inicializador que asegura la existencia del usuario admin
 * y recalcula estados de préstamos al arrancar.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PrestamoRepository prestamoRepository;
    private final CuotaRepository cuotaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initAdmin();
        recalcularEstadosPrestamos();
    }

    private void initAdmin() {
        usuarioRepository.findByUsername("admin").ifPresentOrElse(
                admin -> {
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

    /**
     * Recalcula el estado de todos los préstamos activos y en mora
     * para corregir inconsistencias previas.
     */
    private void recalcularEstadosPrestamos() {
        LocalDate hoy = LocalDate.now(java.time.ZoneId.of("America/Argentina/Buenos_Aires"));

        // Primero: marcar cuotas vencidas como EN_MORA
        List<Cuota> cuotasVencidas = cuotaRepository.findByFechaVencimientoBeforeAndEstado(hoy, EstadoCuota.PENDIENTE);
        if (!cuotasVencidas.isEmpty()) {
            for (Cuota cuota : cuotasVencidas) {
                cuota.setEstado(EstadoCuota.EN_MORA);
            }
            cuotaRepository.saveAll(cuotasVencidas);
            log.info("Se marcaron {} cuotas como EN_MORA al arrancar", cuotasVencidas.size());
        }

        // Segundo: recalcular estado de préstamos
        List<Prestamo> prestamos = prestamoRepository.findAllByEstado(EstadoPrestamo.EN_MORA);
        prestamos.addAll(prestamoRepository.findAllByEstado(EstadoPrestamo.ACTIVO));

        int corregidos = 0;
        for (Prestamo prestamo : prestamos) {
            List<Cuota> cuotas = cuotaRepository.findByPrestamoId(prestamo.getId());

            boolean todasPagadas = cuotas.stream()
                    .allMatch(c -> c.getEstado() == EstadoCuota.PAGADA);
            boolean hayEnMora = cuotas.stream()
                    .anyMatch(c -> c.getEstado() == EstadoCuota.EN_MORA);

            EstadoPrestamo estadoCorrecto;
            if (todasPagadas) {
                estadoCorrecto = EstadoPrestamo.COMPLETADO;
            } else if (hayEnMora) {
                estadoCorrecto = EstadoPrestamo.EN_MORA;
            } else {
                estadoCorrecto = EstadoPrestamo.ACTIVO;
            }

            if (prestamo.getEstado() != estadoCorrecto) {
                log.info("Corrigiendo préstamo #{}: {} -> {}", prestamo.getId(), prestamo.getEstado(), estadoCorrecto);
                prestamo.setEstado(estadoCorrecto);
                prestamoRepository.save(prestamo);
                corregidos++;
            }
        }

        if (corregidos > 0) {
            log.info("Se corrigieron {} préstamos con estado inconsistente", corregidos);
        }
    }
}
