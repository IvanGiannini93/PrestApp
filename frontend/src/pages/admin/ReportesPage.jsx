import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatters';

const COLORS_DONUT = ['#10b981', '#f59e0b', '#ef4444'];

/**
 * Página de reportes con gráficos de cobranza.
 */
function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, ganRes] = await Promise.all([
          api.get('/reportes/cobranza'),
          api.get('/reportes/ganancias-mensuales'),
        ]);
        setReporte(repRes.data.data);
        setGanancias(ganRes.data.data || []);
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

  // Ganancia del mes actual
  const mesActual = ganancias.length > 0 ? ganancias[ganancias.length - 1] : null;
  // Ganancia neta total (suma de todos los meses)
  const gananciaTotalNeta = ganancias.reduce((sum, g) => sum + (parseFloat(g.neto) || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h2>

      {/* Fila 1: Donut + Cards resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donut de cobranza */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
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

      {/* Fila 2: Ganancias mensuales */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-700">Ingresos mensuales</h3>
            <p className="text-sm text-gray-600">Cobro total (gris) vs ganancia neta (verde) por mes</p>
          </div>
          {mesActual && parseFloat(mesActual.neto) > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Ganancia este mes</p>
              <p className="text-lg font-bold text-primary-600">{formatCurrency(mesActual.neto)}</p>
              {gananciaTotalNeta > 0 && (
                <p className="text-xs text-gray-400 mt-1">Total acumulado: {formatCurrency(gananciaTotalNeta)}</p>
              )}
            </div>
          )}
        </div>

        {ganancias.every(g => parseFloat(g.bruto) === 0) ? (
          <p className="text-gray-400 text-center py-12">Todavía no hay cobros registrados</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ganancias} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 14, fill: '#374151' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 13, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v > 0 ? `$${(v/1000).toFixed(0)}k` : '$0'}
              />
              <Tooltip
                formatter={(value, name) => [formatCurrency(value), name === 'bruto' ? 'Cobro total' : 'Ganancia neta']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', color: '#1f2937' }}
                labelStyle={{ color: '#1f2937', fontWeight: 600 }}
                itemStyle={{ color: '#374151' }}
              />
              <Legend
                formatter={(value) => value === 'bruto' ? 'Cobro total' : 'Ganancia neta'}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: '14px', color: '#1f2937' }}
              />
              <Bar dataKey="bruto" fill="#9ca3af" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="neto" fill="#217a4b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ReportesPage;
