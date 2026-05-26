import { useEffect, useState } from 'react';
import PrestamoActivo from '../../components/cliente/PrestamoActivo';
import CuotasPendientes from '../../components/cliente/CuotasPendientes';
import { getMiPrestamo } from '../../api/cuotaApi';
import api from '../../api/axiosConfig';

/**
 * Página del préstamo activo del cliente.
 * Muestra la lista de préstamos y al hacer click en uno despliega sus cuotas.
 */
function MiPrestamoPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cuotasPrestamo, setCuotasPrestamo] = useState([]);
  const [loadingCuotas, setLoadingCuotas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMiPrestamo();
        setPrestamos(response.data.data);
      } catch (err) {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (prestamo) => {
    if (expandedId === prestamo.id) {
      setExpandedId(null);
      setCuotasPrestamo([]);
      return;
    }

    setExpandedId(prestamo.id);
    setLoadingCuotas(true);
    try {
      const response = await api.get(`/mi-prestamo/${prestamo.id}`);
      const detalle = response.data.data;
      const pendientes = (detalle.cuotas || []).filter(c => c.estado !== 'PAGADA');
      setCuotasPrestamo(pendientes);
    } catch (err) {
      setCuotasPrestamo([]);
    } finally {
      setLoadingCuotas(false);
    }
  };

  if (loading) return <p className="text-gray-500 p-4">Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Préstamos</h2>
      <PrestamoActivo
        prestamos={prestamos}
        onSelect={handleToggle}
        expandedId={expandedId}
        cuotas={cuotasPrestamo}
        loadingCuotas={loadingCuotas}
      />
    </div>
  );
}

export default MiPrestamoPage;
