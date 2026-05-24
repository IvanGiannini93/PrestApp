package com.prestapp.web.exception;

/**
 * Excepción lanzada cuando un recurso solicitado no existe.
 * <p>
 * Se traduce a una respuesta HTTP 404 (Not Found).
 * </p>
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Crea una excepción con mensaje descriptivo.
     *
     * @param message descripción del recurso no encontrado
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Crea una excepción para un recurso específico por ID.
     *
     * @param resourceName nombre del recurso (ej: "Cliente")
     * @param id           identificador buscado
     */
    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " con ID " + id + " no encontrado");
    }
}
