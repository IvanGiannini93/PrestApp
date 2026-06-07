import api from './axiosConfig';

/**
 * API de gestión de clientes.
 */

/**
 * Obtiene la lista de clientes paginada.
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise} Página de clientes
 */
export const getClientes = (page = 0, size = 10) => api.get(`/clientes?page=${page}&size=${size}`);

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
