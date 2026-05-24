import api from './axiosConfig';

/**
 * API de autenticación.
 * Maneja login para administradores y clientes.
 */

/**
 * Realiza el login con las credenciales proporcionadas.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Respuesta con token JWT y rol
 */
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};
