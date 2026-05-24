import Button from './Button';

/**
 * Componente de paginación.
 * @param {Object} props
 * @param {number} props.currentPage - Página actual (0-indexed)
 * @param {number} props.totalPages - Total de páginas
 * @param {Function} props.onPageChange - Callback al cambiar de página
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-700">
        Página {currentPage + 1} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
