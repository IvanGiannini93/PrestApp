package com.prestapp.infrastructure.persistence;

import com.prestapp.domain.model.Prestamo;
import com.prestapp.domain.model.enums.EstadoPrestamo;
import com.prestapp.domain.repository.PrestamoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Implementación JPA del repositorio de préstamos.
 * <p>
 * Extiende {@link JpaRepository} para operaciones CRUD estándar
 * e implementa {@link PrestamoRepository} para cumplir con el contrato
 * definido en la capa de dominio.
 * </p>
 */
@Repository
public interface JpaPrestamoRepository extends JpaRepository<Prestamo, Long>, PrestamoRepository {

    /**
     * {@inheritDoc}
     */
    @Override
    Page<Prestamo> findByEstado(EstadoPrestamo estado, Pageable pageable);

    /**
     * {@inheritDoc}
     */
    @Override
    List<Prestamo> findByClienteIdAndEstado(Long clienteId, EstadoPrestamo estado);

    /**
     * {@inheritDoc}
     */
    @Override
    List<Prestamo> findByClienteId(Long clienteId);

    /**
     * {@inheritDoc}
     */
    @Override
    @Query("SELECT p FROM Prestamo p WHERE p.estado = :estado")
    List<Prestamo> findAllByEstado(@Param("estado") EstadoPrestamo estado);
}
