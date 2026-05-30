import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

/**
 * Dashboard principal del administrador.
 * Muestra resumen de cobranza, próximas cuotas a cobrar y atajos.
 */
function DashboardPage() {
  const [reporte, setReporte] = useState(null);
  const [proximasCuotas, setProximasCuotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reportes/cobranza').then(res => setReporte(res.data.data)).catch(() => {});
    api.get('/reportes/proximas-cuotas?limit=5').then(res => setProximasCuotas(res.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/admin/clientes')} variant="secondary">
            + Nuevo Cliente
          </Button>
          <Button onClick={() => navigate('/admin/prestamos')}>
            + Nuevo Préstamo
          </Button>
        </div>
      </div>

      {/* Resumen de cobranza */}
      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Cobrado</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(reporte.montoPagadas)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadPagadas} cuotas pagadas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pendiente</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reporte.montoPendientes)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadPendientes} cuotas por cobrar</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Vencido</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(reporte.montoVencidas)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadVencidas} cuotas en mora</p>
          </div>
        </div>
      )}

      {/* Próximas cuotas a cobrar */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Próximas cuotas a cobrar</h3>
        </div>
        {proximasCuotas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No hay cuotas próximas a vencer</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proximasCuotas.map((cuota) => (
                  <tr key={cuota.cuotaId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cuota.clienteNombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{cuota.clienteDocumento}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">#{cuota.numeroCuota} de {cuota.totalCuotas}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(cuota.monto)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(cuota.fechaVencimiento)}</td>
                    <td className="px-6 py-4"><StatusBadge status={cuota.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
