import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';
import DashboardPage from '../pages/admin/DashboardPage';
import ClientesPage from '../pages/admin/ClientesPage';
import PrestamosPage from '../pages/admin/PrestamosPage';
import ReportesPage from '../pages/admin/ReportesPage';
import MiPrestamoPage from '../pages/cliente/MiPrestamoPage';
import MiHistorialPage from '../pages/cliente/MiHistorialPage';

/**
 * Router principal de la aplicación.
 * Define las rutas públicas y protegidas por rol.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
      <Route path="/admin/clientes" element={<AdminRoute><ClientesPage /></AdminRoute>} />
      <Route path="/admin/prestamos" element={<AdminRoute><PrestamosPage /></AdminRoute>} />
      <Route path="/admin/reportes" element={<AdminRoute><ReportesPage /></AdminRoute>} />

      {/* Rutas Cliente */}
      <Route path="/cliente/mi-prestamo" element={<ClienteRoute><MiPrestamoPage /></ClienteRoute>} />
      <Route path="/cliente/historial" element={<ClienteRoute><MiHistorialPage /></ClienteRoute>} />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
