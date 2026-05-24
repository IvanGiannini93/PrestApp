import api from './axiosConfig';

/**
 * API de gestión de cuotas.
 */

/**
 * Registra el pago de una cuota.
 * @param {number} id - ID de la cuota
 * @param {Object} data - Datos del pago (monto)
 * @returns {Promise} Cuota actualizada
 */
export const registrarPago = (id, data) => api.patch(`/cuotas/${id}/pagar`, data);

/**
 * Obtiene las cuotas pendientes del cliente logueado.
 * @returns {Promise} Lista de cuotas pendientes
 */
export const getMisCuotas = () => api.get('/mis-cuotas');

/**
 * Obtiene el préstamo activo del cliente logueado.
 * @returns {Promise} Préstamo activo
 */
export const getMiPrestamo = () => api.get('/mi-prestamo');

/**
 * Obtiene el historial de préstamos del cliente logueado.
 * @returns {Promise} Lista de préstamos completados
 */
export const getMiHistorial = () => api.get('/mi-historial');
