package com.prestapp.web.exception;

/**
 * Excepción lanzada cuando se viola una regla de negocio.
 * <p>
 * Se traduce a una respuesta HTTP 400 (Bad Request).
 * Ejemplos: intentar pagar una cuota ya pagada, crear un préstamo
 * con parámetros inválidos.
 * </p>
 */
public class BusinessException extends RuntimeException {

    /**
     * Crea una excepción con mensaje descriptivo.
     *
     * @param message descripción de la regla de negocio violada
     */
    public BusinessException(String message) {
        super(message);
    }
}
