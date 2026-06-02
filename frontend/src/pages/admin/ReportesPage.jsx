import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatters';

const COLORS_DONUT = ['#10b981', '#f59e0b', '#ef4444'];

const RANGOS = [
  { key: 4, label: '1 mes' },
  { key: 8, label: '2 meses' },
  { key: 12, label: '3 meses' },
];

/**
 * Tooltip personalizado para las barras.
 */
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-lg font-bold text-green-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

/**
 * Página de reportes con gráficos de cobranza.
 */
function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semanas, setSemanas] = useState(4);

  useEffect(() => {
    api.get('/reportes/cobranza').then(res => setReporte(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    api.get(`/reportes/cobros-semanal?weeks=${semanas}`)
      .then(res => setCobros(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [semanas]);

  if (loading) return <p className="text-gray-500 p-4">Cargando reportes...</p>;

  // Datos para el donut
  const donutData = reporte ? [
    { name: 'Cobrado', value: parseFloat(reporte.montoPagadas) || 0 },
    { name: 'Pendiente', value: parseFloat(reporte.montoPendientes) || 0 },
    { name: 'Vencido', value: parseFloat(reporte.montoVencidas) || 0 },
  ].filter(d => d.value > 0) : [];

  const totalCobranza = donutData.reduce((sum, d) => sum + d.value, 0);
  const hayCobros = cobros.some(c => parseFloat(c.cobrado) > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h2>

      {/* Fila 1: Donut + Cards resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donut de cobranza */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Distribución de Cobranza</h3>
          {donutData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS_DONUT[index % COLORS_DONUT.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Leyenda */}
          {donutData.length > 0 && (
            <div className="flex justify-center gap-5 mt-3">
              {donutData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_DONUT[index] }}></div>
                  <span className="text-xs text-gray-600">{entry.name}: {formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cards resumen */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Cobrado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(reporte?.montoPagadas || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{reporte?.cantidadPagadas || 0} cuotas cobradas</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reporte?.montoPendientes || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <span className="text-lg">⏳</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{reporte?.cantidadPendientes || 0} cuotas por cobrar</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Vencido</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(reporte?.montoVencidas || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-lg">⚠</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{reporte?.cantidadVencidas || 0} cuotas vencidas</p>
          </div>
        </div>
      </div>

      {/* Fila 2: Barras con selector de rango */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-700">Cobros por semana</h3>
            <p className="text-xs text-gray-400">Monto total cobrado cada semana</p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {RANGOS.map((r) => (
              <button
                key={r.key}
                onClick={() => setSemanas(r.key)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  semanas === r.key
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {!hayCobros ? (
          <p className="text-gray-400 text-center py-12">Todavía no hay cobros registrados</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cobros} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="semana"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v > 0 ? `$${(v/1000).toFixed(0)}k` : '$0'}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="cobrado" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ReportesPage;
