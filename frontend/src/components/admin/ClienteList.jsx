import Table from '../common/Table';

/**
 * Lista de clientes en formato tabla.
 */
function ClienteList({ clientes, onSelect }) {
  const columns = [
    { key: 'nombreCompleto', label: 'Nombre' },
    { key: 'documento', label: 'Documento' },
    { key: 'razonSocial', label: 'Comercio' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
  ];

  const renderCell = (row, key) => {
    if (key === 'razonSocial') return row[key] || '-';
    return row[key];
  };

  return <Table columns={columns} data={clientes} onRowClick={onSelect} renderCell={renderCell} />;
}

export default ClienteList;
