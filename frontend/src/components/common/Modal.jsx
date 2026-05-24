/**
 * Componente de modal para confirmaciones y diálogos.
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback al cerrar
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido
 */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
