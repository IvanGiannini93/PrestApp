import { useEffect, useState } from 'react';
import HistorialPrestamos from '../../components/cliente/HistorialPrestamos';
import { getMiHistorial } from '../../api/cuotaApi';

/**
 * Página de historial de préstamos del cliente.
 */
function MiHistorialPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await getMiHistorial();
        setPrestamos(response.data.data);
      } catch (err) {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  if (loading) return <p className="text-gray-500 p-4">Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Préstamos</h2>
      <HistorialPrestamos prestamos={prestamos} />
    </div>
  );
}

export default MiHistorialPage;
