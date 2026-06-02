/**
 * Componente de badge de estado con colores semánticos.
 * @param {Object} props
 * @param {string} props.status - Estado a mostrar
 */
function StatusBadge({ status }) {
  const styles = {
    PAGADA: 'bg-green-100 text-green-800',
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_MORA: 'bg-red-100 text-red-800',
    ACTIVO: 'bg-blue-100 text-blue-800',
    COMPLETADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-gray-100 text-gray-800',
    CANCELADA: 'bg-gray-100 text-gray-800',
  };

  const labels = {
    PAGADA: 'Pagada',
    PENDIENTE: 'Pendiente',
    EN_MORA: 'En Mora',
    ACTIVO: 'Activo',
    COMPLETADO: 'Completado',
    CANCELADO: 'Cancelado',
    CANCELADA: 'Cancelada',
  };

  const style = styles[status] || 'bg-gray-100 text-gray-800';
  const label = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
