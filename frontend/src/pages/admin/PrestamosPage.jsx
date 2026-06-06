import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PrestamoForm from '../../components/admin/PrestamoForm';
import PrestamoList from '../../components/admin/PrestamoList';
import PrestamoDetail from '../../components/admin/PrestamoDetail';
import Pagination from '../../components/common/Pagination';
import Tabs from '../../components/common/Tabs';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { usePrestamos } from '../../hooks/usePrestamos';
import { registrarPago } from '../../api/cuotaApi';
import api from '../../api/axiosConfig';

const TABS = [
  { key: 'ACTIVO', label: 'Activos' },
  { key: 'EN_MORA', label: 'En Mora' },
  { key: 'COMPLETADO', label: 'Completados' },
  { key: 'CANCELADO', label: 'Cancelados' },
  { key: 'TODOS', label: 'Todos' },
];

/**
 * Página de gestión de préstamos (admin) con filtro por estado.
 */
function PrestamosPage() {
  const { prestamos, prestamoActual, loading, error, totalPages, fetchPrestamos, fetchPrestamo, addPrestamo } = usePrestamos();
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get('nuevo') === 'true');
  const [page, setPage] = useState(0);
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('ACTIVO');
  const [cancelId, setCancelId] = useState(null);
  const [counters, setCounters] = useState({});

  useEffect(() => { fetchPrestamos(page, 10, activeTab); }, [fetchPrestamos, page, activeTab]);

  useEffect(() => {
    api.get('/reportes/contadores-prestamos')
      .then(res => {
        const data = res.data.data;
        const total = Object.values(data).reduce((sum, v) => sum + v, 0);
        setCounters({ ...data, TODOS: total });
      })
      .catch(() => {});
  }, [prestamos]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleCrear = async (data) => {
    try {
      await addPrestamo(data);
      setShowForm(false);
      fetchPrestamos(page, 10, activeTab);
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

  const handleCancelar = async (prestamoId) => {
    try {
      await api.patch(`/prestamos/${prestamoId}/cancelar`);
      setView('list');
      fetchPrestamos(page, 10, activeTab);
    } catch (err) { /* handled */ }
  };

  const handleCancelarFromList = (prestamoId) => {
    setCancelId(prestamoId);
  };

  const confirmarCancelacion = async () => {
    if (cancelId) {
      await handleCancelar(cancelId);
      setCancelId(null);
    }
  };

  if (view === 'detail' && prestamoActual) {
    return <PrestamoDetail prestamo={prestamoActual} onPagar={handlePagar} onCancelar={handleCancelar} onBack={() => setView('list')} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Préstamos</h2>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">{showForm ? 'Cancelar' : 'Nuevo Préstamo'}</span>
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Modal para nuevo préstamo */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Crear Préstamo</h3>
            <PrestamoForm onSubmit={handleCrear} loading={loading} />
          </div>
        </div>
      )}

      {/* Tabs de filtro */}
      <div className="mb-4">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} counters={counters} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <PrestamoList prestamos={prestamos} onSelect={handleSelect} onCancelar={handleCancelarFromList} />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal de confirmación de cancelación */}
      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancelar Préstamo">
        <p className="text-gray-600 mb-2">¿Estás seguro que querés cancelar este préstamo?</p>
        <p className="text-sm text-gray-500 mb-6">Las cuotas pendientes se marcarán como canceladas. Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setCancelId(null)}>Volver</Button>
          <Button variant="danger" onClick={confirmarCancelacion}>Confirmar Cancelación</Button>
        </div>
      </Modal>
    </div>
  );
}

export default PrestamosPage;
