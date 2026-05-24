import api from './axiosConfig';

/**
 * API de gestión de clientes.
 */

/**
 * Obtiene la lista de todos los clientes.
 * @returns {Promise} Lista de clientes
 */
export const getClientes = () => api.get('/clientes');

/**
 * Obtiene un cliente por su ID.
 * @param {number} id - ID del cliente
 * @returns {Promise} Datos del cliente
 */
export const getCliente = (id) => api.get(`/clientes/${id}`);

/**
 * Registra un nuevo cliente.
 * @param {Object} data - Datos del cliente
 * @returns {Promise} Cliente creado
 */
export const createCliente = (data) => api.post('/clientes', data);
