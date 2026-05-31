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
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors shadow-sm">
            {showForm ? (
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-600 font-medium">{showForm ? 'Cancelar' : 'Nuevo Cliente'}</span>
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
