package com.prestapp.application.usecase;

import com.prestapp.application.dto.request.ClienteRequest;
import com.prestapp.application.dto.response.ClienteResponse;
import com.prestapp.application.mapper.ClienteMapper;
import com.prestapp.domain.model.Cliente;
import com.prestapp.domain.repository.ClienteRepository;
import com.prestapp.web.exception.DuplicateResourceException;
import com.prestapp.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Caso de uso para gestión de clientes.
 * <p>
 * Orquesta las operaciones de registro, consulta y validación
 * de clientes del sistema.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class ClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    /**
     * Registra un nuevo cliente en el sistema.
     * <p>
     * Valida que no exista un cliente con la misma combinación
     * de razón social y responsable antes de persistir.
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
}
