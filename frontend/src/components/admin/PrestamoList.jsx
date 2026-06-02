import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

/**
 * Lista de préstamos con acciones inline.
 * @param {Object} props
 * @param {Array} props.prestamos - Lista de préstamos
 * @param {Function} props.onSelect - Callback al ver detalle
 * @param {Function} props.onCancelar - Callback al cancelar
 */
function PrestamoList({ prestamos, onSelect, onCancelar }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay préstamos en esta categoría
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuotas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {prestamos.map((prestamo) => {
            const canCancel = prestamo.estado !== 'COMPLETADO' && prestamo.estado !== 'CANCELADO';
            return (
              <tr key={prestamo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{prestamo.clienteNombre}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(prestamo.monto)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {prestamo.cuotasPagadas}/{prestamo.totalCuotas}
                </td>
                <td className="px-6 py-4"><StatusBadge status={prestamo.estado} /></td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onSelect(prestamo)}
                      className="flex flex-col items-center gap-1 group"
                      title="Ver detalle"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">Detalle</span>
                    </button>

                    {canCancel && onCancelar && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onCancelar(prestamo.id); }}
                        className="flex flex-col items-center gap-1 group"
                        title="Cancelar préstamo"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-500">Cancelar</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PrestamoList;
