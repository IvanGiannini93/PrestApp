import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { getClientes } from '../../api/clienteApi';
import { formatCurrency } from '../../utils/formatters';

/**
 * Formulario de creación de préstamos con cálculo en vivo.
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback al enviar
 * @param {boolean} props.loading - Estado de carga
 */
function PrestamoForm({ onSubmit, loading }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    clienteId: '', monto: '', tasaInteres: '', plazo: '', frecuencia: 'SEMANAL', fechaInicio: ''
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getClientes().then(res => setClientes(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const { monto, tasaInteres, plazo, frecuencia } = form;
    if (monto && tasaInteres && plazo) {
      const total = parseFloat(monto) * (1 + parseFloat(tasaInteres) / 100);
      const numCuotas = parseInt(plazo);
      if (numCuotas > 0) {
        setPreview({ total, numCuotas, montoCuota: total / numCuotas });
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, clienteId: parseInt(form.clienteId), monto: parseFloat(form.monto),
      tasaInteres: parseFloat(form.tasaInteres), plazo: parseInt(form.plazo) });
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <select value={form.clienteId} onChange={handleChange('clienteId')} required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Seleccionar cliente...</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.razonSocial} - {c.responsable}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Monto ($)" id="monto" type="number" value={form.monto}
          onChange={handleChange('monto')} placeholder="10000" min="1000" max="10000000" required />
        <Input label="Tasa de Interés (%)" id="tasaInteres" type="number" step="0.1"
          value={form.tasaInteres} onChange={handleChange('tasaInteres')} placeholder="10" min="0.1" max="100" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Plazo (cuotas)" id="plazo" type="number" value={form.plazo}
          onChange={handleChange('plazo')} placeholder="10" min="1" max="365" required />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
          <select value={form.frecuencia} onChange={handleChange('frecuencia')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="DIARIA">Diaria</option>
            <option value="SEMANAL">Semanal</option>
            <option value="QUINCENAL">Quincenal</option>
            <option value="MENSUAL">Mensual</option>
          </select>
        </div>
      </div>
      <Input label="Fecha de Inicio" id="fechaInicio" type="date" value={form.fechaInicio}
        onChange={handleChange('fechaInicio')} required />

      {preview && (
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-800">Vista previa:</p>
          <p className="text-sm text-blue-700">Total a pagar: {formatCurrency(preview.total)}</p>
          <p className="text-sm text-blue-700">Cuotas: {preview.numCuotas} de {formatCurrency(preview.montoCuota)}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creando...' : 'Crear Préstamo'}
      </Button>
    </form>
  );
}

export default PrestamoForm;
