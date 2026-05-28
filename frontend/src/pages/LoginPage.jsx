import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../api/authApi';
import logoBanner from '../resources/logos/logo.jpg';

/**
 * Página de login.
 * Formulario de autenticación para administradores y clientes.
 * Si ya está logueado, redirige al dashboard correspondiente.
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Si ya está logueado, redirigir al dashboard
  if (isAuthenticated && user) {
    if (user.rol === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/cliente/mi-prestamo" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      const { token, rol, username: user } = response.data.data;
      authLogin(token, { username: user, rol });

      if (rol === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/cliente/mi-prestamo', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img src={logoBanner} alt="PrestApp" className="w-44 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Gestión de Préstamos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              <p>{error}</p>
              <a href="/recuperar-password" className="text-red-800 underline text-xs mt-1 inline-block">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ingrese su usuario"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ingrese su contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
