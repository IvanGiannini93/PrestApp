package com.prestapp.domain.repository;

import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad {@link Prestamo}.
 * <p>
 * Define las operaciones de persistencia necesarias para la gestión
 * de préstamos del sistema.
 * </p>
 */
public interface PrestamoRepository {

    /**
     * Obtiene préstamos paginados filtrados por estado.
     *
     * @param estado estado del préstamo a filtrar
     * @param pageable configuración de paginación
     * @return página de préstamos
     */
    Page<Prestamo> findByEstado(EstadoPrestamo estado, Pageable pageable);

    /**
     * Busca un préstamo por su ID.
     *
     * @param id identificador del préstamo
     * @return Optional con el préstamo encontrado o vacío si no existe
     */
    Optional<Prestamo> findById(Long id);

    /**
     * Persiste un préstamo en la base de datos.
     *
     * @param prestamo entidad a guardar
     * @return préstamo persistido con ID generado
     */
    Prestamo save(Prestamo prestamo);

    /**
     * Obtiene los préstamos de un cliente filtrados por estado.
     *
     * @param clienteId ID del cliente
     * @param estado estado del préstamo
     * @return lista de préstamos del cliente con el estado indicado
     */
    List<Prestamo> findByClienteIdAndEstado(Long clienteId, EstadoPrestamo estado);

    /**
     * Obtiene todos los préstamos de un cliente.
     *
     * @param clienteId ID del cliente
     * @return lista de préstamos del cliente
     */
    List<Prestamo> findByClienteId(Long clienteId);

    /**
     * Obtiene todos los préstamos con un estado específico.
     *
     * @param estado estado del préstamo
     * @return lista de préstamos con ese estado
     */
    List<Prestamo> findAllByEstado(EstadoPrestamo estado);
}
