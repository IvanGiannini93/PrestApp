import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

/**
 * Lista paginada de préstamos activos.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos
 * @param {Function} props.onSelect - Callback al seleccionar
 */
function PrestamoList({ prestamos, onSelect }) {
  const columns = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'monto', label: 'Monto' },
    { key: 'saldoRestante', label: 'Saldo Restante' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'cuotasPendientes', label: 'Cuotas Pend.' },
    { key: 'estado', label: 'Estado' },
  ];

  const renderCell = (row, key) => {
    if (key === 'monto' || key === 'saldoRestante') return formatCurrency(row[key]);
    if (key === 'estado') return <StatusBadge status={row[key]} />;
    if (key === 'frecuencia') return row[key] === 'SEMANAL' ? 'Semanal' : 'Quincenal';
    return row[key];
  };

  return <Table columns={columns} data={prestamos} onRowClick={onSelect} renderCell={renderCell} />;
}

export default PrestamoList;
