import { Routes, Route, Navigate } from 'react-router-dom';

/**
 * Router principal de la aplicación.
 * Define las rutas públicas y protegidas por rol.
 */
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<p>Login Page (pendiente)</p>} />
      <Route path="/admin/*" element={<p>Admin Panel (pendiente)</p>} />
      <Route path="/cliente/*" element={<p>Portal Cliente (pendiente)</p>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
