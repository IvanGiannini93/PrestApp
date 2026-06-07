package com.prestapp.domain.repository;

import com.prestapp.domain.model.Cliente;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad {@link Cliente}.
 * <p>
 * Define las operaciones de persistencia necesarias para la gestión
 * de clientes del sistema.
 * </p>
 */
public interface ClienteRepository {

    /**
     * Obtiene todos los clientes registrados.
     *
     * @return lista de clientes
     */
    List<Cliente> findAll();

    /**
     * Obtiene clientes con paginación.
     *
     * @param pageable configuración de paginación
     * @return página de clientes
     */
    org.springframework.data.domain.Page<Cliente> findAll(org.springframework.data.domain.Pageable pageable);

    /**
     * Busca un cliente por su ID.
     *
     * @param id identificador del cliente
     * @return Optional con el cliente encontrado o vacío si no existe
     */
    Optional<Cliente> findById(Long id);

    /**
     * Persiste un cliente en la base de datos.
     *
     * @param cliente entidad a guardar
     * @return cliente persistido con ID generado
     */
    Cliente save(Cliente cliente);

    /**
     * Verifica si existe un cliente con la combinación de razón social y responsable.
     *
     * @param razonSocial razón social del comercio
     * @param responsable nombre del responsable
     * @return true si existe un duplicado, false en caso contrario
     */
    boolean existsByRazonSocialAndResponsable(String razonSocial, String responsable);

    /**
     * Verifica si existe un cliente con el documento dado.
     *
     * @param documento número de documento
     * @return true si existe, false en caso contrario
     */
    boolean existsByDocumento(String documento);

    /**
     * Verifica si existe un cliente con el email dado.
     *
     * @param email correo electrónico
     * @return true si existe, false en caso contrario
     */
    boolean existsByEmail(String email);
}
