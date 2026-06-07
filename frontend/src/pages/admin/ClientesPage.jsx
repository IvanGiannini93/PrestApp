import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClienteForm from '../../components/admin/ClienteForm';
import ClienteList from '../../components/admin/ClienteList';
import Pagination from '../../components/common/Pagination';
import { useClientes } from '../../hooks/useClientes';

/**
 * Página de gestión de clientes (admin).
 */
function ClientesPage() {
  const { clientes, loading, error, totalPages, fetchClientes, addCliente } = useClientes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get('nuevo') === 'true');
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => { fetchClientes(page, 10); }, [fetchClientes, page]);

  const handleSubmit = async (data) => {
    try {
      await addCliente(data);
      setShowForm(false);
      setSuccessMsg('Cliente registrado exitosamente');
      fetchClientes(page, 10);
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
          <div className="w-12 h-12 rounded-full border-2 border-primary-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-500 transition-all">
            {showForm ? (
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">{showForm ? 'Cancelar' : 'Nuevo Cliente'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Modal para nuevo cliente */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Registrar Cliente</h3>
            <ClienteForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ClienteList clientes={clientes} />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default ClientesPage;
