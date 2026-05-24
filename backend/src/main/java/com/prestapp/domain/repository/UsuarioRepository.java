package com.prestapp.domain.repository;

import com.prestapp.domain.model.Usuario;

import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad {@link Usuario}.
 * <p>
 * Define las operaciones de persistencia necesarias para la gestión
 * de usuarios. La implementación concreta reside en la capa de infraestructura.
 * </p>
 */
public interface UsuarioRepository {

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param username nombre de usuario a buscar
     * @return Optional con el usuario encontrado o vacío si no existe
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Persiste un usuario en la base de datos.
     *
     * @param usuario entidad a guardar
     * @return usuario persistido con ID generado
     */
    Usuario save(Usuario usuario);

    /**
     * Verifica si existe un usuario con el nombre de usuario dado.
     *
     * @param username nombre de usuario a verificar
     * @return true si existe, false en caso contrario
     */
    boolean existsByUsername(String username);
}
