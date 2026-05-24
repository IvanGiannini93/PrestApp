import Table from '../common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Historial de préstamos completados del cliente.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos completados
 */
function HistorialPrestamos({ prestamos }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No tenés préstamos anteriores</p>
      </div>
    );
  }

  const columns = [
    { key: 'id', label: '#' },
    { key: 'monto', label: 'Monto' },
    { key: 'tasaInteres', label: 'Tasa' },
    { key: 'plazo', label: 'Plazo' },
    { key: 'createdAt', label: 'Fecha' },
  ];

  const renderCell = (row, key) => {
    if (key === 'monto') return formatCurrency(row[key]);
    if (key === 'tasaInteres') return `${row[key]}%`;
    if (key === 'plazo') return `${row[key]} semanas`;
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
