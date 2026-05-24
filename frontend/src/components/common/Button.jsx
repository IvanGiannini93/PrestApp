/**
 * Componente de botón reutilizable con variantes.
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'} props.variant - Variante visual
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {string} props.className - Clases adicionales
 * @param {React.ReactNode} props.children - Contenido del botón
 */
function Button({ variant = 'primary', disabled = false, className = '', children, ...props }) {
  const baseClasses = 'px-4 py-2 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
