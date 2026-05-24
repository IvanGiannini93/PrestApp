import { formatCurrency } from '../../utils/formatters';

/**
 * Componente de reporte de cobranza con resumen por categoría.
 * @param {Object} props
 * @param {Object} props.reporte - Datos del reporte
 */
function ReporteCobranza({ reporte }) {
  if (!reporte) return <p className="text-gray-500 text-center py-8">Cargando reporte...</p>;

  const cards = [
    { label: 'Pagadas', cantidad: reporte.cantidadPagadas, monto: reporte.montoPagadas, color: 'green' },
    { label: 'Pendientes', cantidad: reporte.cantidadPendientes, monto: reporte.montoPendientes, color: 'yellow' },
    { label: 'Vencidas', cantidad: reporte.cantidadVencidas, monto: reporte.montoVencidas, color: 'red' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className={`bg-${card.color}-50 border border-${card.color}-200 rounded-lg p-4`}>
            <p className={`text-sm font-medium text-${card.color}-800`}>{card.label}</p>
            <p className={`text-2xl font-bold text-${card.color}-900 mt-1`}>{formatCurrency(card.monto)}</p>
            <p className={`text-sm text-${card.color}-700 mt-1`}>{card.cantidad} cuotas</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-600">Total General</p>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(reporte.montoTotal)}</p>
      </div>
    </div>
  );
}

export default ReporteCobranza;
