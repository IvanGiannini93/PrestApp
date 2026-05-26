import { useEffect, useState } from 'react';
import PrestamoForm from '../../components/admin/PrestamoForm';
import PrestamoList from '../../components/admin/PrestamoList';
import PrestamoDetail from '../../components/admin/PrestamoDetail';
import Pagination from '../../components/common/Pagination';
import { usePrestamos } from '../../hooks/usePrestamos';
import { registrarPago } from '../../api/cuotaApi';

/**
 * Página de gestión de préstamos (admin).
 */
function PrestamosPage() {
  const { prestamos, prestamoActual, loading, error, totalPages, fetchPrestamos, fetchPrestamo, addPrestamo } = usePrestamos();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [view, setView] = useState('list');

  useEffect(() => { fetchPrestamos(page); }, [fetchPrestamos, page]);

  const handleCrear = async (data) => {
    try {
      await addPrestamo(data);
      setShowForm(false);
      fetchPrestamos(page);
    } catch (err) { /* handled by hook */ }
  };

  const handleSelect = (prestamo) => {
    fetchPrestamo(prestamo.id);
    setView('detail');
  };

  const handlePagar = async (cuotaId) => {
    try {
      await registrarPago(cuotaId, { monto: 0 });
      fetchPrestamo(prestamoActual.id);
    } catch (err) { /* handled */ }
  };

  if (view === 'detail' && prestamoActual) {
    return <PrestamoDetail prestamo={prestamoActual} onPagar={handlePagar} onBack={() => setView('list')} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Préstamos</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          {showForm ? 'Cancelar' : '+ Nuevo Préstamo'}
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Crear Préstamo</h3>
          <PrestamoForm onSubmit={handleCrear} loading={loading} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <PrestamoList prestamos={prestamos} onSelect={handleSelect} />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default PrestamosPage;
