import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Lista de cuotas con botón de pago.
 * @param {Object} props
 * @param {Array} props.cuotas - Lista de cuotas
 * @param {Function} props.onPagar - Callback al pagar
 */
function CuotaList({ cuotas, onPagar }) {
  if (!cuotas || cuotas.length === 0) {
    return <p className="text-gray-500 text-center py-4">No hay cuotas</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cuotas.map((cuota) => (
            <tr key={cuota.id}>
              <td className="px-4 py-3 text-sm">{cuota.numeroCuota}</td>
              <td className="px-4 py-3 text-sm font-medium">{formatCurrency(cuota.monto)}</td>
              <td className="px-4 py-3 text-sm">{formatDate(cuota.fechaVencimiento)}</td>
              <td className="px-4 py-3 text-sm">{cuota.fechaPago ? formatDate(cuota.fechaPago) : '-'}</td>
              <td className="px-4 py-3"><StatusBadge status={cuota.estado} /></td>
              <td className="px-4 py-3">
                {cuota.estado !== 'PAGADA' && onPagar && (
                  <Button variant="primary" onClick={() => onPagar(cuota.id)} className="text-xs px-2 py-1">
                    Pagar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CuotaList;
