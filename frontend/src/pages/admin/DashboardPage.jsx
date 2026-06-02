import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axiosConfig';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/common/StatusBadge';

/**
 * Dashboard principal del administrador.
 */
function DashboardPage() {
  const { user } = useAuth();
  const [reporte, setReporte] = useState(null);
  const [proximasCuotas, setProximasCuotas] = useState([]);
  const navigate = useNavigate();

  const hoy = new Date();
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const fechaFormateada = hoy.toLocaleDateString('es-AR', opcionesFecha);

  useEffect(() => {
    api.get('/reportes/cobranza').then(res => setReporte(res.data.data)).catch(() => {});
    api.get('/reportes/proximas-cuotas?limit=5').then(res => setProximasCuotas(res.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Header con saludo */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold">Hola, {user?.displayName || user?.username} 👋</h2>
        <p className="text-primary-200 text-sm mt-1 capitalize">{fechaFormateada}</p>
      </div>

      {/* Atajos con estilo outline */}
      <div className="flex justify-center gap-8 mb-6">
        <button onClick={() => navigate('/admin/clientes')} className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full border-2 border-primary-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-500 transition-all">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Nuevo Cliente</span>
        </button>

        <button onClick={() => navigate('/admin/prestamos')} className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full border-2 border-primary-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-500 transition-all">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Nuevo Préstamo</span>
        </button>

        <button onClick={() => navigate('/admin/reportes')} className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full border-2 border-primary-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-500 transition-all">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Reportes</span>
        </button>
      </div>

      {/* Métricas rápidas */}
      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Cobrado</p>
            <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(reporte.montoPagadas)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadPagadas} cuotas</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pendiente</p>
            <p className="text-xl font-bold text-yellow-600 mt-1">{formatCurrency(reporte.montoPendientes)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadPendientes} cuotas</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Vencido</p>
            <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(reporte.montoVencidas)}</p>
            <p className="text-xs text-gray-400 mt-1">{reporte.cantidadVencidas} cuotas</p>
          </div>
        </div>
      )}

      {/* Próximas cuotas */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Próximas cuotas a cobrar</h3>
        </div>
        {proximasCuotas.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No hay cuotas próximas a vencer</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cuota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {proximasCuotas.map((cuota) => (
                  <tr key={cuota.cuotaId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800">{cuota.clienteNombre}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">#{cuota.numeroCuota} de {cuota.totalCuotas}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">{formatCurrency(cuota.monto)}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">{formatDate(cuota.fechaVencimiento)}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={cuota.estado} /></td>
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
