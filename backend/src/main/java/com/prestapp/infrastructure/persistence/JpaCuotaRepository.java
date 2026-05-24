package com.prestapp.infrastructure.persistence;

import com.prestapp.domain.model.Cuota;
import com.prestapp.domain.model.enums.EstadoCuota;
import com.prestapp.domain.repository.CuotaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Implementación JPA del repositorio de cuotas.
 * <p>
 * Extiende {@link JpaRepository} para operaciones CRUD estándar
 * e implementa {@link CuotaRepository} para cumplir con el contrato
 * definido en la capa de dominio.
 * </p>
 */
@Repository
public interface JpaCuotaRepository extends JpaRepository<Cuota, Long>, CuotaRepository {

    /**
     * {@inheritDoc}
     */
    @Override
    List<Cuota> findByPrestamoIdAndEstado(Long prestamoId, EstadoCuota estado);

    /**
     * {@inheritDoc}
     */
    @Override
    List<Cuota> findByPrestamoId(Long prestamoId);

    /**
     * {@inheritDoc}
     */
    @Override
    List<Cuota> findByFechaVencimientoAndEstado(LocalDate fechaVencimiento, EstadoCuota estado);

    /**
     * {@inheritDoc}
     */
    @Override
    List<Cuota> findByFechaVencimientoBeforeAndEstado(LocalDate fecha, EstadoCuota estado);

    /**
     * {@inheritDoc}
     * <p>
     * Obtiene todas las cuotas cuyos préstamos tienen estado ACTIVO.
     * </p>
     */
    @Override
    @Query("SELECT c FROM Cuota c WHERE c.prestamo.estado = com.prestapp.domain.model.enums.EstadoPrestamo.ACTIVO")
    List<Cuota> findAllByPrestamoEstadoActivo();
}
