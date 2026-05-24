/**
 * Componente de tabla genérica reutilizable.
 * @param {Object} props
 * @param {Array<{key: string, label: string}>} props.columns - Definición de columnas
 * @param {Array<Object>} props.data - Datos a mostrar
 * @param {Function} props.onRowClick - Callback al hacer click en una fila
 * @param {Function} props.renderCell - Función custom para renderizar celdas
 */
function Table({ columns, data, onRowClick, renderCell }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell ? renderCell(row, col.key) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
