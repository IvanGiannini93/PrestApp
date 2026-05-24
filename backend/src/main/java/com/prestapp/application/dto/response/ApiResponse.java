package com.prestapp.application.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Respuesta genérica de la API.
 * <p>
 * Estructura consistente para todas las respuestas del sistema,
 * incluyendo datos, mensaje descriptivo y lista de errores.
 * </p>
 *
 * @param <T> tipo de dato contenido en la respuesta
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    /** Datos de la respuesta (null en caso de error). */
    private T data;

    /** Mensaje descriptivo de la operación. */
    private String message;

    /** Lista de errores de validación o detalle (null si no hay errores). */
    private List<String> errors;

    /**
     * Crea una respuesta exitosa con datos y mensaje.
     *
     * @param data    datos de la respuesta
     * @param message mensaje descriptivo
     * @param <T>     tipo de dato
     * @return respuesta exitosa
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .build();
    }

    /**
     * Crea una respuesta de error con mensaje y lista de errores.
     *
     * @param message mensaje de error general
     * @param errors  lista de errores específicos
     * @param <T>     tipo de dato
     * @return respuesta de error
     */
    public static <T> ApiResponse<T> error(String message, List<String> errors) {
        return ApiResponse.<T>builder()
                .message(message)
                .errors(errors)
                .build();
    }

    /**
     * Crea una respuesta de error con un solo mensaje.
     *
     * @param message mensaje de error
     * @param <T>     tipo de dato
     * @return respuesta de error
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .message(message)
                .build();
    }
}
