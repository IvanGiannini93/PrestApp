import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatters';

const COLORS_DONUT = ['#10b981', '#f59e0b', '#ef4444'];

/**
 * Página de reportes con gráficos de cobranza.
 */
function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, cobrosRes] = await Promise.all([
          api.get('/reportes/cobranza'),
          api.get('/reportes/cobros-semanal'),
        ]);
        setReporte(repRes.data.data);
        setCobros(cobrosRes.data.data || []);
      } catch (err) {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500 p-4">Cargando reportes...</p>;

  // Datos para el donut
  const donutData = reporte ? [
    { name: 'Cobrado', value: parseFloat(reporte.montoPagadas) || 0 },
    { name: 'Pendiente', value: parseFloat(reporte.montoPendientes) || 0 },
    { name: 'Vencido', value: parseFloat(reporte.montoVencidas) || 0 },
  ].filter(d => d.value > 0) : [];

  const totalCobranza = donutData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h2>

      {/* Fila 1: Donut + Cards resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donut de cobranza */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Cobranza</h3>
          {donutData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS_DONUT[index % COLORS_DONUT.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Total en el centro conceptual */}
          {totalCobranza > 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Total: {formatCurrency(totalCobranza)}
            </p>
          )}
        </div>

        {/* Cards resumen */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Cobrado</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(reporte?.montoPagadas || 0)}</p>
            <p className="text-xs text-gray-400">{reporte?.cantidadPagadas || 0} cuotas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pendiente</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reporte?.montoPendientes || 0)}</p>
            <p className="text-xs text-gray-400">{reporte?.cantidadPendientes || 0} cuotas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Vencido</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(reporte?.montoVencidas || 0)}</p>
            <p className="text-xs text-gray-400">{reporte?.cantidadVencidas || 0} cuotas</p>
          </div>
        </div>
      </div>

      {/* Fila 2: Barras de cobro semanal + Línea acumulada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barras: cobrado vs esperado por semana */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cobro Semanal</h3>
          {cobros.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cobros}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="cobrado" name="Cobrado" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="esperado" name="Esperado" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Línea: cobro acumulado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cobro Acumulado</h3>
          {cobros.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cobros}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="acumulado"
                  name="Acumulado"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportesPage;
