import { useState } from 'react';
import CuotaList from './CuotaList';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Detalle de un préstamo con sus cuotas.
 * @param {Object} props
 * @param {Object} props.prestamo - Datos del préstamo
 * @param {Function} props.onPagar - Callback al pagar una cuota
 * @param {Function} props.onCancelar - Callback al cancelar el préstamo
 * @param {Function} props.onBack - Callback para volver
 */
function PrestamoDetail({ prestamo, onPagar, onCancelar, onBack }) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!prestamo) return null;

  const canCancel = prestamo.estado !== 'COMPLETADO' && prestamo.estado !== 'CANCELADO';

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

      {/* Botón cancelar */}
      {canCancel && (
        <div className="mt-6">
          <Button variant="danger" onClick={() => setShowCancelModal(true)}>
            Cancelar Préstamo
          </Button>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancelar Préstamo">
        <p className="text-gray-600 mb-2">¿Estás seguro que querés cancelar este préstamo?</p>
        <p className="text-sm text-gray-500 mb-6">Las cuotas pendientes se marcarán como canceladas. Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Volver
          </Button>
          <Button variant="danger" onClick={() => { setShowCancelModal(false); onCancelar && onCancelar(prestamo.id); }}>
            Confirmar Cancelación
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default PrestamoDetail;
