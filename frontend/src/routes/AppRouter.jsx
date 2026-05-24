import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';

/**
 * Router principal de la aplicación.
 * Define las rutas públicas y protegidas por rol.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Admin */}
      <Route path="/admin/dashboard" element={
        <AdminRoute><p className="p-4">Dashboard (tarea 19)</p></AdminRoute>
      } />
      <Route path="/admin/clientes" element={
        <AdminRoute><p className="p-4">Clientes (tarea 17)</p></AdminRoute>
      } />
      <Route path="/admin/prestamos" element={
        <AdminRoute><p className="p-4">Préstamos (tarea 18)</p></AdminRoute>
      } />
      <Route path="/admin/reportes" element={
        <AdminRoute><p className="p-4">Reportes (tarea 19)</p></AdminRoute>
      } />

      {/* Rutas Cliente */}
      <Route path="/cliente/mi-prestamo" element={
        <ClienteRoute><p className="p-4">Mi Préstamo (tarea 20)</p></ClienteRoute>
      } />
      <Route path="/cliente/historial" element={
        <ClienteRoute><p className="p-4">Mi Historial (tarea 20)</p></ClienteRoute>
      } />

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
