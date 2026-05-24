package com.prestapp.infrastructure.persistence;

import com.prestapp.domain.model.Cliente;
import com.prestapp.domain.repository.ClienteRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Implementación JPA del repositorio de clientes.
 * <p>
 * Extiende {@link JpaRepository} para obtener operaciones CRUD estándar
 * e implementa {@link ClienteRepository} para cumplir con el contrato
 * definido en la capa de dominio.
 * </p>
 */
@Repository
public interface JpaClienteRepository extends JpaRepository<Cliente, Long>, ClienteRepository {

    /**
     * {@inheritDoc}
     */
    @Override
    boolean existsByRazonSocialAndResponsable(String razonSocial, String responsable);
}
