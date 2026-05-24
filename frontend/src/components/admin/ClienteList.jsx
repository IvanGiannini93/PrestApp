import Table from '../common/Table';
import { formatDate } from '../../utils/formatters';

/**
 * Lista de clientes en formato tabla.
 * @param {Object} props
 * @param {Array} props.clientes - Lista de clientes
 * @param {Function} props.onSelect - Callback al seleccionar un cliente
 */
function ClienteList({ clientes, onSelect }) {
  const columns = [
    { key: 'razonSocial', label: 'Razón Social' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Registrado' },
  ];

  const renderCell = (row, key) => {
    if (key === 'createdAt') return formatDate(row[key]);
    return row[key];
  };

  return <Table columns={columns} data={clientes} onRowClick={onSelect} renderCell={renderCell} />;
}

export default ClienteList;
