import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatCurrency, formatDate } from '../../utils/formatters';
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
        <h2 className="text-2xl font-bold text-gray-800">Home</h2>
      </div>

      {/* Atajos estilo Mercado Pago */}
      <div className="flex justify-center gap-10 mb-8 py-4">
        <button
          onClick={() => navigate('/admin/clientes')}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Nuevo Cliente</span>
        </button>

        <button
          onClick={() => navigate('/admin/prestamos')}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Nuevo Préstamo</span>
        </button>

        <button
          onClick={() => navigate('/admin/reportes')}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Reportes</span>
        </button>
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
