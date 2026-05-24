import { useEffect, useState } from 'react';
import PrestamoActivo from '../../components/cliente/PrestamoActivo';
import CuotasPendientes from '../../components/cliente/CuotasPendientes';
import { getMiPrestamo, getMisCuotas } from '../../api/cuotaApi';

/**
 * Página del préstamo activo del cliente.
 */
function MiPrestamoPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prestRes, cuotasRes] = await Promise.all([getMiPrestamo(), getMisCuotas()]);
        setPrestamos(prestRes.data.data);
        setCuotas(cuotasRes.data.data);
      } catch (err) {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500 p-4">Cargando...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Préstamo</h2>
        <PrestamoActivo prestamos={prestamos} />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Cuotas Pendientes</h3>
        <CuotasPendientes cuotas={cuotas} />
      </div>
    </div>
  );
}

export default MiPrestamoPage;
