import { useEffect, useState } from 'react';
import HistorialPrestamos from '../../components/cliente/HistorialPrestamos';
import Tabs from '../../components/common/Tabs';
import api from '../../api/axiosConfig';

const TABS = [
  { key: 'activos', label: 'Activos' },
  { key: 'completados', label: 'Completados' },
  { key: 'cancelados', label: 'Cancelados' },
];

/**
 * Página de historial de préstamos del cliente con tabs.
 */
function MiHistorialPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activos');

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      try {
        let response;
        if (activeTab === 'activos') {
          response = await api.get('/mi-prestamo');
        } else if (activeTab === 'completados') {
          response = await api.get('/mi-historial');
        } else {
          // cancelados - usamos mi-historial con filtro (por ahora los cancelados vienen del mismo endpoint)
          response = await api.get('/mi-historial?estado=CANCELADO');
        }
        setPrestamos(response.data.data || []);
      } catch (err) {
        setPrestamos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [activeTab]);

  if (loading) return <p className="text-gray-500 p-4">Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Préstamos</h2>
      <div className="mb-4">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <HistorialPrestamos prestamos={prestamos} showStatus={true} />
    </div>
  );
}

export default MiHistorialPage;
