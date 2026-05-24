/**
 * Componente de input reutilizable con label y error.
 * @param {Object} props
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.error - Mensaje de error
 * @param {string} props.type - Tipo de input
 */
function Input({ label, error, type = 'text', id, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
