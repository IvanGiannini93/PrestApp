package com.prestapp.infrastructure.persistence;

import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.repository.UsuarioRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Implementación JPA del repositorio de usuarios.
 * <p>
 * Extiende {@link JpaRepository} para operaciones CRUD estándar
 * e implementa {@link UsuarioRepository} para cumplir con el contrato
 * definido en la capa de dominio.
 * </p>
 */
@Repository
public interface JpaUsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepository {

    /**
     * {@inheritDoc}
     */
    @Override
    boolean existsByUsername(String username);
}
