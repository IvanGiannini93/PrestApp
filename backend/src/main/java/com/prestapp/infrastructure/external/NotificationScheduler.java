package com.prestapp.infrastructure.external;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.repository.CuotaRepository;
import com.prestapp.domain.repository.PrestamoRepository;
import com.prestapp.domain.service.MoraDetectorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler para tareas programadas del sistema.
 * <p>
 * Ejecuta dos jobs diarios:
 * <ul>
 *   <li>Detección de mora: marca cuotas vencidas como EN_MORA (00:01)</li>
 *   <li>Recordatorios: envía notificaciones de vencimiento próximo (08:00)</li>
 * </ul>
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final CuotaRepository cuotaRepository;
    private final PrestamoRepository prestamoRepository;
    private final MoraDetectorService moraDetectorService;
    private final EmailService emailService;

    /**
     * Job de detección de mora.
     * <p>
     * Se ejecuta diariamente a las 00:01. Busca cuotas pendientes
     * cuya fecha de vencimiento ya pasó y las marca como EN_MORA.
     * Actualiza el estado del préstamo correspondiente.
     * </p>
     */
    @Scheduled(cron = "0 1 0 * * *")
    @Transactional
    public void detectarMora() {
        log.info("Iniciando job de detección de mora...");
        LocalDate hoy = LocalDate.now();

        List<Cuota> cuotasVencidas = cuotaRepository.findByFechaVencimientoBeforeAndEstado(
                hoy, EstadoCuota.PENDIENTE);

        if (cuotasVencidas.isEmpty()) {
            log.info("No se encontraron cuotas vencidas");
            return;
        }

        int marcadas = moraDetectorService.detectarMora(cuotasVencidas, hoy);
        cuotaRepository.saveAll(cuotasVencidas);

        // Actualizar estado de préstamos afectados
        cuotasVencidas.stream()
                .map(Cuota::getPrestamo)
                .distinct()
                .forEach(prestamo -> {
                    moraDetectorService.actualizarEstadoPrestamo(prestamo);
                    prestamoRepository.save(prestamo);
                });

        log.info("Job de mora completado: {} cuotas marcadas como EN_MORA", marcadas);
    }

    /**
     * Job de recordatorios de vencimiento.
     * <p>
     * Se ejecuta diariamente a las 08:00. Busca cuotas pendientes
     * que vencen mañana y envía un email de recordatorio al cliente.
     * Registra las fallas de envío en los logs.
     * </p>
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional(readOnly = true)
    public void enviarRecordatorios() {
        log.info("Iniciando job de recordatorios de vencimiento...");
        LocalDate manana = LocalDate.now().plusDays(1);

        List<Cuota> cuotasProximas = cuotaRepository.findByFechaVencimientoAndEstado(
                manana, EstadoCuota.PENDIENTE);

        if (cuotasProximas.isEmpty()) {
            log.info("No hay cuotas con vencimiento mañana");
            return;
        }

        int enviados = 0;
        int fallidos = 0;

        for (Cuota cuota : cuotasProximas) {
            Prestamo prestamo = cuota.getPrestamo();
            String email = prestamo.getCliente().getEmail();

            if (email == null || email.isBlank()) {
                log.warn("Cliente {} sin email válido. Cuota #{} no notificada",
                        prestamo.getCliente().getId(), cuota.getId());
                fallidos++;
                continue;
            }

            String subject = "PrestApp - Recordatorio de pago";
            String body = buildReminderBody(cuota, prestamo);

            boolean sent = emailService.sendEmail(email, subject, body);
            if (sent) {
                enviados++;
            } else {
                log.error("Falla de envío - Cliente: {}, Cuota: {}, Canal: email",
                        prestamo.getCliente().getId(), cuota.getId());
                fallidos++;
            }
        }

        log.info("Job de recordatorios completado: {} enviados, {} fallidos", enviados, fallidos);
    }

    /**
     * Construye el cuerpo del email de recordatorio.
     *
     * @param cuota    cuota próxima a vencer
     * @param prestamo préstamo asociado
     * @return texto del email
     */
    private String buildReminderBody(Cuota cuota, Prestamo prestamo) {
        return String.format(
                "Estimado/a %s,\n\n" +
                "Le recordamos que tiene un pago próximo a vencer:\n\n" +
                "- Cuota #%d\n" +
                "- Monto: $%s\n" +
                "- Fecha de vencimiento: %s\n" +
                "- Saldo restante del préstamo: $%s\n\n" +
                "Por favor, realice su pago a tiempo para evitar recargos.\n\n" +
                "Saludos,\nEquipo PrestApp",
                prestamo.getCliente().getResponsable(),
                cuota.getNumeroCuota(),
                cuota.getMonto().toString(),
                cuota.getFechaVencimiento().toString(),
                prestamo.getSaldoRestante().toString()
        );
    }
}
