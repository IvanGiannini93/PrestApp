import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Historial de préstamos del cliente.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos
 * @param {boolean} props.showStatus - Si muestra la columna de estado
 */
function HistorialPrestamos({ prestamos, showStatus = false }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No hay préstamos en esta categoría</p>
      </div>
    );
  }

  const columns = [
    { key: 'id', label: '#' },
    { key: 'monto', label: 'Monto' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'totalCuotas', label: 'Cuotas' },
    ...(showStatus ? [{ key: 'estado', label: 'Estado' }] : []),
    { key: 'createdAt', label: 'Fecha' },
  ];

  const frecuenciaLabels = { DIARIA: 'Diaria', SEMANAL: 'Semanal', QUINCENAL: 'Quincenal', MENSUAL: 'Mensual' };

  const renderCell = (row, key) => {
    if (key === 'monto') return formatCurrency(row[key]);
    if (key === 'frecuencia') return frecuenciaLabels[row[key]] || row[key];
    if (key === 'totalCuotas') return row[key] || row.plazo;
    if (key === 'estado') return <StatusBadge status={row[key]} />;
    if (key === 'createdAt') return formatDate(row[key]);
    return row[key];
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Table columns={columns} data={prestamos} renderCell={renderCell} />
    </div>
  );
}

export default HistorialPrestamos;
