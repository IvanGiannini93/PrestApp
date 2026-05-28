import Table from '../common/Table';

/**
 * Lista de clientes en formato tabla.
 * @param {Object} props
 * @param {Array} props.clientes - Lista de clientes
 * @param {Function} props.onSelect - Callback al seleccionar un cliente
 */
function ClienteList({ clientes, onSelect }) {
  const columns = [
    { key: 'documento', label: 'Documento' },
    { key: 'razonSocial', label: 'Razón Social' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
  ];

  const renderCell = (row, key) => {
    return row[key];
  };

  return <Table columns={columns} data={clientes} onRowClick={onSelect} renderCell={renderCell} />;
}

export default ClienteList;
