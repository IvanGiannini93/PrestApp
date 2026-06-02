import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PrestamoActivo from '../../components/cliente/PrestamoActivo';
import CuotasPendientes from '../../components/cliente/CuotasPendientes';
import { getMiPrestamo } from '../../api/cuotaApi';
import api from '../../api/axiosConfig';

/**
 * Página del préstamo activo del cliente.
 */
function MiPrestamoPage() {
  const { user } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cuotasPrestamo, setCuotasPrestamo] = useState([]);
  const [loadingCuotas, setLoadingCuotas] = useState(false);

  const hoy = new Date();
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const fechaFormateada = hoy.toLocaleDateString('es-AR', opcionesFecha);

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
      {/* Header con saludo */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold">Hola, {user?.username} 👋</h2>
        <p className="text-primary-200 text-sm mt-1 capitalize">{fechaFormateada}</p>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Mis Préstamos</h3>
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
