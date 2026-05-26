package com.prestapp.application.usecase;

import com.prestapp.application.dto.request.ClienteRequest;
import com.prestapp.application.dto.response.ClienteResponse;
import com.prestapp.application.mapper.ClienteMapper;
import com.prestapp.domain.model.Cliente;
import com.prestapp.domain.model.Usuario;
import com.prestapp.domain.model.enums.Rol;
import com.prestapp.domain.repository.ClienteRepository;
import com.prestapp.domain.repository.UsuarioRepository;
import com.prestapp.web.exception.DuplicateResourceException;
import com.prestapp.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Caso de uso para gestión de clientes.
 * <p>
 * Orquesta las operaciones de registro, consulta y validación
 * de clientes del sistema. Al registrar un cliente, crea automáticamente
 * un usuario con rol CLIENTE para que pueda acceder al portal.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClienteMapper clienteMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo cliente en el sistema.
     * <p>
     * Valida que no exista un cliente con la misma combinación
     * de razón social y responsable antes de persistir.
     * Crea automáticamente un usuario con rol CLIENTE asociado.
     * Las credenciales generadas son: username = email, password = teléfono del cliente.
     * </p>
     *
     * @param request DTO con datos del cliente
     * @return DTO con datos del cliente registrado
     * @throws DuplicateResourceException si ya existe un cliente con esa combinación
     */
    @Transactional
    public ClienteResponse registrar(ClienteRequest request) {
        if (clienteRepository.existsByRazonSocialAndResponsable(
                request.getRazonSocial(), request.getResponsable())) {
            throw new DuplicateResourceException(
                    "Ya existe un cliente con la razón social '" + request.getRazonSocial() +
                    "' y responsable '" + request.getResponsable() + "'"
            );
        }

        Cliente cliente = clienteMapper.toEntity(request);
        Cliente saved = clienteRepository.save(cliente);

        // Crear usuario para el cliente
        crearUsuarioCliente(saved);

        return clienteMapper.toResponse(saved);
    }

    /**
     * Obtiene la lista de todos los clientes registrados.
     *
     * @return lista de DTOs de clientes
     */
    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clienteRepository.findAll().stream()
                .map(clienteMapper::toResponse)
                .toList();
    }

    /**
     * Obtiene un cliente por su ID.
     *
     * @param id identificador del cliente
     * @return DTO con datos del cliente
     * @throws ResourceNotFoundException si el cliente no existe
     */
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        return clienteMapper.toResponse(cliente);
    }

    /**
     * Crea un usuario con rol CLIENTE asociado al cliente registrado.
     * <p>
     * Credenciales generadas:
     * - Username: email del cliente
     * - Password: número de teléfono del cliente
     * </p>
     *
     * @param cliente el cliente recién registrado
     */
    private void crearUsuarioCliente(Cliente cliente) {
        String username = cliente.getEmail();
        String password = cliente.getTelefono().replaceAll("[^0-9]", "");

        if (usuarioRepository.existsByUsername(username)) {
            log.warn("Ya existe un usuario con username '{}', no se crea duplicado", username);
            return;
        }

        Usuario usuario = Usuario.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .rol(Rol.CLIENTE)
                .clienteId(cliente.getId())
                .build();

        usuarioRepository.save(usuario);
        log.info("Usuario creado para cliente '{}': username={}, password=teléfono",
                cliente.getRazonSocial(), username);
    }
}
