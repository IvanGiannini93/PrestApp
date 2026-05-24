import { useEffect, useState } from 'react';
import ReporteCobranza from '../../components/admin/ReporteCobranza';
import api from '../../api/axiosConfig';

/**
 * Página de reportes de cobranza (admin).
 */
function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await api.get('/reportes/cobranza');
        setReporte(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar reporte');
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reporte de Cobranza</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
      {loading ? <p className="text-gray-500">Cargando...</p> : <ReporteCobranza reporte={reporte} />}
    </div>
  );
}

export default ReportesPage;
