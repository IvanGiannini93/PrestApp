package com.prestapp.infrastructure.external;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Servicio de envío de emails.
 * <p>
 * Envía notificaciones por correo electrónico a los clientes,
 * como recordatorios de vencimiento de cuotas.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Envía un email simple.
     *
     * @param to      dirección de destino
     * @param subject asunto del email
     * @param body    cuerpo del mensaje
     * @return true si el envío fue exitoso, false si falló
     */
    public boolean sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("PrestApp <ivan.giannini.work@gmail.com>");

            mailSender.send(message);
            log.info("Email enviado exitosamente a: {}", to);
            return true;
        } catch (Exception e) {
            log.error("Error al enviar email a {}: {}", to, e.getMessage());
            return false;
        }
    }
}
