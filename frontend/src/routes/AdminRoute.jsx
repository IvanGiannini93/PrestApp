import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente de ruta protegida para administradores.
 * Redirige al login si no está autenticado o no tiene rol ADMIN.
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos protegidos
 */
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
