import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';
import Layout from '../components/common/Layout';
import DashboardPage from '../pages/admin/DashboardPage';
import ClientesPage from '../pages/admin/ClientesPage';
import PrestamosPage from '../pages/admin/PrestamosPage';
import ReportesPage from '../pages/admin/ReportesPage';
import MiPrestamoPage from '../pages/cliente/MiPrestamoPage';
import MiHistorialPage from '../pages/cliente/MiHistorialPage';
import PerfilPage from '../pages/PerfilPage';
import CambiarPasswordPage from '../pages/CambiarPasswordPage';

/**
 * Router principal de la aplicación.
 * Define las rutas públicas y protegidas por rol.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><Layout><DashboardPage /></Layout></AdminRoute>} />
      <Route path="/admin/clientes" element={<AdminRoute><Layout><ClientesPage /></Layout></AdminRoute>} />
      <Route path="/admin/prestamos" element={<AdminRoute><Layout><PrestamosPage /></Layout></AdminRoute>} />
      <Route path="/admin/reportes" element={<AdminRoute><Layout><ReportesPage /></Layout></AdminRoute>} />
      <Route path="/admin/perfil" element={<AdminRoute><Layout><PerfilPage /></Layout></AdminRoute>} />
      <Route path="/admin/cambiar-password" element={<AdminRoute><Layout><CambiarPasswordPage /></Layout></AdminRoute>} />

      {/* Rutas Cliente */}
      <Route path="/cliente/mi-prestamo" element={<ClienteRoute><Layout><MiPrestamoPage /></Layout></ClienteRoute>} />
      <Route path="/cliente/historial" element={<ClienteRoute><Layout><MiHistorialPage /></Layout></ClienteRoute>} />
      <Route path="/cliente/perfil" element={<ClienteRoute><Layout><PerfilPage /></Layout></ClienteRoute>} />
      <Route path="/cliente/cambiar-password" element={<ClienteRoute><Layout><CambiarPasswordPage /></Layout></ClienteRoute>} />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
