import api from './axiosConfig';

/**
 * API de gestión de préstamos.
 */

/**
 * Obtiene la lista de préstamos activos (paginada).
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise} Lista paginada de préstamos
 */
export const getPrestamos = (page = 0, size = 20) =>
  api.get(`/prestamos?page=${page}&size=${size}`);

/**
 * Obtiene el detalle de un préstamo con sus cuotas.
 * @param {number} id - ID del préstamo
 * @returns {Promise} Detalle del préstamo
 */
export const getPrestamo = (id) => api.get(`/prestamos/${id}`);

/**
 * Crea un nuevo préstamo.
 * @param {Object} data - Datos del préstamo
 * @returns {Promise} Préstamo creado con cuotas generadas
 */
export const createPrestamo = (data) => api.post('/prestamos', data);
