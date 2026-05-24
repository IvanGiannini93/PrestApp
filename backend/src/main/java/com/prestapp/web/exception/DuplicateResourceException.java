package com.prestapp.web.exception;

/**
 * Excepción lanzada cuando se intenta crear un recurso duplicado.
 * <p>
 * Se traduce a una respuesta HTTP 409 (Conflict).
 * </p>
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * Crea una excepción con mensaje descriptivo.
     *
     * @param message descripción del conflicto de duplicación
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}
