import { useEffect, useState } from 'react';
import ClienteForm from '../../components/admin/ClienteForm';
import ClienteList from '../../components/admin/ClienteList';
import { useClientes } from '../../hooks/useClientes';

/**
 * Página de gestión de clientes (admin).
 */
function ClientesPage() {
  const { clientes, loading, error, fetchClientes, addCliente } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const handleSubmit = async (data) => {
    try {
      await addCliente(data);
      setShowForm(false);
      setSuccessMsg('Cliente registrado exitosamente');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      // error handled by hook
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Cliente'}
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Registrar Cliente</h3>
          <ClienteForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <ClienteList clientes={clientes} />
      </div>
    </div>
  );
}

export default ClientesPage;
