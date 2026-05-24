import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';

/**
 * Vista del préstamo activo del cliente.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos activos
 * @param {Function} props.onSelect - Callback al seleccionar un préstamo
 */
function PrestamoActivo({ prestamos, onSelect }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No tenés préstamos activos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prestamos.map((prestamo) => (
        <div key={prestamo.id} onClick={() => onSelect && onSelect(prestamo)}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold text-gray-800">Préstamo #{prestamo.id}</p>
              <p className="text-sm text-gray-500">{prestamo.frecuencia === 'SEMANAL' ? 'Semanal' : 'Quincenal'}</p>
            </div>
            <StatusBadge status={prestamo.estado} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Monto Total</p>
              <p className="font-semibold">{formatCurrency(prestamo.monto)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Saldo Restante</p>
              <p className="font-semibold text-primary-600">{formatCurrency(prestamo.saldoRestante)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tasa</p>
              <p className="font-semibold">{formatPercent(prestamo.tasaInteres)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cuotas Pendientes</p>
              <p className="font-semibold">{prestamo.cuotasPendientes} de {prestamo.totalCuotas}</p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${(prestamo.cuotasPagadas / prestamo.totalCuotas) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {prestamo.cuotasPagadas}/{prestamo.totalCuotas} cuotas pagadas
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PrestamoActivo;
