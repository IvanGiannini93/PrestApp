import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Lista de cuotas pendientes del cliente con indicadores visuales.
 * @param {Object} props
 * @param {Array} props.cuotas - Lista de cuotas pendientes
 */
function CuotasPendientes({ cuotas }) {
  if (!cuotas || cuotas.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No tenés cuotas pendientes</p>
      </div>
    );
  }

  const getEstadoVisual = (cuota) => {
    const hoy = new Date();
    const vencimiento = new Date(cuota.fechaVencimiento);
    const diffDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (cuota.estado === 'EN_MORA' || diffDias < 0) {
      return { bg: 'bg-red-50 border-red-200', text: 'text-red-800', label: 'Vencida' };
    }
    if (diffDias <= 3) {
      return { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', label: 'Próxima a vencer' };
    }
    return { bg: 'bg-white border-gray-200', text: 'text-gray-800', label: 'Pendiente' };
  };

  const sortedCuotas = [...cuotas].sort((a, b) =>
    new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
  );

  return (
    <div className="space-y-3">
      {sortedCuotas.map((cuota) => {
        const visual = getEstadoVisual(cuota);
        return (
          <div key={cuota.id} className={`border rounded-lg p-4 ${visual.bg}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${visual.text}`}>Cuota #{cuota.numeroCuota}</p>
                <p className="text-sm text-gray-500">Vence: {formatDate(cuota.fechaVencimiento)}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${visual.text}`}>{formatCurrency(cuota.monto)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${visual.bg} ${visual.text} border`}>
                  {visual.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CuotasPendientes;
