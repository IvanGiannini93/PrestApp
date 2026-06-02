import CuotaList from './CuotaList';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Detalle de un préstamo con sus cuotas.
 * @param {Object} props
 * @param {Object} props.prestamo - Datos del préstamo
 * @param {Function} props.onPagar - Callback al pagar una cuota
 * @param {Function} props.onBack - Callback para volver
 */
function PrestamoDetail({ prestamo, onPagar, onBack }) {
  if (!prestamo) return null;

  return (
    <div>
      <button onClick={onBack} className="text-primary-600 hover:underline mb-4">
        ← Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{prestamo.clienteNombre}</h3>
            <p className="text-gray-500">Préstamo #{prestamo.id}</p>
          </div>
          <StatusBadge status={prestamo.estado} />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Monto</p>
            <p className="font-semibold">{formatCurrency(prestamo.monto)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Saldo Restante</p>
            <p className="font-semibold">{formatCurrency(prestamo.saldoRestante)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tasa</p>
            <p className="font-semibold">{prestamo.tasaInteres}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Primer cobro</p>
            <p className="font-semibold">{formatDate(prestamo.fechaInicio)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Creado</p>
            <p className="font-semibold">{formatDate(prestamo.createdAt)}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-green-600">Pagadas: {prestamo.cuotasPagadas}</span>
          <span className="text-yellow-600">Pendientes: {prestamo.cuotasPendientes}</span>
          <span className="text-gray-600">Total: {prestamo.totalCuotas}</span>
        </div>
      </div>

      {prestamo.cuotas && <CuotaList cuotas={prestamo.cuotas} onPagar={onPagar} />}
    </div>
  );
}

export default PrestamoDetail;
