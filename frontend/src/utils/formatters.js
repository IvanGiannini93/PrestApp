/**
 * Utilidades de formateo para la aplicación.
 */

/**
 * Formatea un número como moneda (ARS).
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado como moneda
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea una fecha ISO a formato legible.
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada (dd/mm/yyyy)
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatea un porcentaje.
 * @param {number} value - Valor del porcentaje
 * @returns {string} Porcentaje formateado
 */
export function formatPercent(value) {
  return `${value}%`;
}
