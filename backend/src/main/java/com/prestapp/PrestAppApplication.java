package com.prestapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Clase principal de la aplicación PrestApp.
 * <p>
 * Sistema de gestión de préstamos que permite a un prestamista administrar
 * clientes, crear préstamos, dar seguimiento a cuotas y generar reportes
 * de cobranza.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableScheduling
public class PrestAppApplication {

    /**
     * Punto de entrada de la aplicación.
     *
     * @param args argumentos de línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication.run(PrestAppApplication.class, args);
    }
}
