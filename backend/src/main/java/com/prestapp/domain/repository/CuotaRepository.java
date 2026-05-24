package com.prestapp.domain.repository;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.enums.EstadoCuota;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad {@link Cuota}.
 * <p>
 * Define las operaciones de persistencia necesarias para la gestión
 * de cuotas del sistema.
 * </p>
 */
public interface CuotaRepository {

    /**
     * Busca una cuota por su ID.
     *
     * @param id identificador de la cuota
     * @return Optional con la cuota encontrada o vacía si no existe
     */
    Optional<Cuota> findById(Long id);

    /**
     * Persiste una cuota en la base de datos.
     *
     * @param cuota entidad a guardar
     * @return cuota persistida con ID generado
     */
    Cuota save(Cuota cuota);

    /**
     * Persiste una lista de cuotas en la base de datos.
     *
     * @param cuotas lista de entidades a guardar
     * @return lista de cuotas persistidas
     */
    List<Cuota> saveAll(List<Cuota> cuotas);

    /**
     * Obtiene las cuotas de un préstamo filtradas por estado.
     *
     * @param prestamoId ID del préstamo
     * @param estado estado de la cuota
     * @return lista de cuotas con el estado indicado
     */
    List<Cuota> findByPrestamoIdAndEstado(Long prestamoId, EstadoCuota estado);

    /**
     * Obtiene todas las cuotas de un préstamo.
     *
     * @param prestamoId ID del préstamo
     * @return lista de cuotas del préstamo
     */
    List<Cuota> findByPrestamoId(Long prestamoId);

    /**
     * Obtiene cuotas pendientes con fecha de vencimiento en una fecha específica.
     *
     * @param fechaVencimiento fecha de vencimiento a buscar
     * @param estado estado de la cuota
     * @return lista de cuotas que vencen en esa fecha
     */
    List<Cuota> findByFechaVencimientoAndEstado(LocalDate fechaVencimiento, EstadoCuota estado);

    /**
     * Obtiene cuotas pendientes cuya fecha de vencimiento ya pasó.
     *
     * @param fecha fecha de referencia
     * @param estado estado actual de las cuotas
     * @return lista de cuotas vencidas
     */
    List<Cuota> findByFechaVencimientoBeforeAndEstado(LocalDate fecha, EstadoCuota estado);

    /**
     * Obtiene todas las cuotas de los préstamos activos.
     *
     * @return lista de todas las cuotas de préstamos activos
     */
    List<Cuota> findAllByPrestamoEstadoActivo();
}
