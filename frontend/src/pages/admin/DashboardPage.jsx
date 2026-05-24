import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatters';

/**
 * Dashboard principal del administrador.
 * Muestra un resumen general del sistema.
 */
function DashboardPage() {
  const [reporte, setReporte] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reportes/cobranza').then(res => setReporte(res.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md"
            onClick={() => navigate('/admin/reportes')}>
            <p className="text-sm text-gray-500">Cuotas Pagadas</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(reporte.montoPagadas)}</p>
            <p className="text-sm text-gray-400">{reporte.cantidadPagadas} cuotas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md"
            onClick={() => navigate('/admin/reportes')}>
            <p className="text-sm text-gray-500">Cuotas Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reporte.montoPendientes)}</p>
            <p className="text-sm text-gray-400">{reporte.cantidadPendientes} cuotas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md"
            onClick={() => navigate('/admin/reportes')}>
            <p className="text-sm text-gray-500">Cuotas Vencidas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(reporte.montoVencidas)}</p>
            <p className="text-sm text-gray-400">{reporte.cantidadVencidas} cuotas</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/admin/clientes')}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md text-left">
          <h3 className="font-semibold text-gray-800">Gestionar Clientes</h3>
          <p className="text-sm text-gray-500 mt-1">Alta y consulta de clientes</p>
        </button>
        <button onClick={() => navigate('/admin/prestamos')}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md text-left">
          <h3 className="font-semibold text-gray-800">Gestionar Préstamos</h3>
          <p className="text-sm text-gray-500 mt-1">Crear préstamos y registrar pagos</p>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
