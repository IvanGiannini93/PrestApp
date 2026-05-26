import StatusBadge from '../common/StatusBadge';
import CuotasPendientes from './CuotasPendientes';
import { formatCurrency, formatPercent } from '../../utils/formatters';

/**
 * Vista de préstamos activos del cliente con acordeón de cuotas.
 * Al hacer click en un préstamo se despliegan sus cuotas pendientes.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos activos
 * @param {Function} props.onSelect - Callback al hacer click en un préstamo
 * @param {number|null} props.expandedId - ID del préstamo expandido
 * @param {Array} props.cuotas - Cuotas del préstamo expandido
 * @param {boolean} props.loadingCuotas - Si está cargando cuotas
 */
function PrestamoActivo({ prestamos, onSelect, expandedId, cuotas, loadingCuotas }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No tenés préstamos activos</p>
      </div>
    );
  }

  const frecuenciaLabels = {
    DIARIA: 'Diaria',
    SEMANAL: 'Semanal',
    QUINCENAL: 'Quincenal',
    MENSUAL: 'Mensual',
  };

  return (
    <div className="space-y-4">
      {prestamos.map((prestamo) => {
        const isExpanded = expandedId === prestamo.id;

        return (
          <div key={prestamo.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header del préstamo - clickeable */}
            <div
              onClick={() => onSelect && onSelect(prestamo)}
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Préstamo #{prestamo.id}</p>
                    <p className="text-sm text-gray-500">{frecuenciaLabels[prestamo.frecuencia] || prestamo.frecuencia}</p>
                  </div>
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
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(prestamo.cuotasPagadas / prestamo.totalCuotas) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {prestamo.cuotasPagadas}/{prestamo.totalCuotas} cuotas pagadas
                </p>
              </div>
            </div>

            {/* Cuotas desplegables */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Cuotas Pendientes</h4>
                {loadingCuotas ? (
                  <p className="text-sm text-gray-500">Cargando cuotas...</p>
                ) : (
                  <CuotasPendientes cuotas={cuotas} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PrestamoActivo;
