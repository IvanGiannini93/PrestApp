/**
 * Utilidades de validación para formularios.
 */

/**
 * Valida que un campo no esté vacío.
 * @param {string} value - Valor a validar
 * @param {string} fieldName - Nombre del campo para el mensaje de error
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    return `${fieldName} es obligatorio`;
  }
  return null;
}

/**
 * Valida que un email tenga formato correcto.
 * @param {string} email - Email a validar
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    return 'Email inválido';
  }
  return null;
}

/**
 * Valida que un número esté dentro de un rango.
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} fieldName - Nombre del campo
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateRange(value, min, max, fieldName) {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return null;
}

/**
 * Valida un número de teléfono.
 * @param {string} phone - Teléfono a validar
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validatePhone(phone) {
  const regex = /^[+]?[\d\s()-]{7,20}$/;
  if (!phone || !regex.test(phone)) {
    return 'Teléfono inválido';
  }
  return null;
}
