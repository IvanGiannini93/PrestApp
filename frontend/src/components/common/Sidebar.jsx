import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Modal from './Modal';
import Button from './Button';
import logo from '../../resources/logos/logo.png';

/**
 * Sidebar de navegación lateral.
 * Muestra opciones según el rol del usuario.
 */
function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const homeRoute = user?.rol === 'ADMIN' ? '/admin/dashboard' : '/cliente/mi-prestamo';

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Home', icon: '🏠' },
    { to: '/admin/clientes', label: 'Clientes', icon: '👥' },
    { to: '/admin/prestamos', label: 'Préstamos', icon: '💰' },
    { to: '/admin/reportes', label: 'Reportes', icon: '📈' },
  ];

  const clienteLinks = [
    { to: '/cliente/mi-prestamo', label: 'Home', icon: '🏠' },
    { to: '/cliente/historial', label: 'Historial', icon: '📋' },
  ];

  const links = user?.rol === 'ADMIN' ? adminLinks : clienteLinks;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo - clickeable, redirige al home */}
      <div className="p-6 border-b border-gray-200 flex flex-col items-center cursor-pointer" onClick={() => navigate(homeRoute)}>
        <div className="h-20 mb-2 flex items-center justify-center">
          <img
            src={logo}
            alt="PrestApp"
            className={`h-20 w-auto transition-opacity duration-200 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
        <p className="text-xs text-gray-500">
          {user?.rol === 'ADMIN' ? 'Panel Administrador' : 'Portal Cliente'}
        </p>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Separador + opciones de cuenta */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        <NavLink to={user?.rol === 'ADMIN' ? '/admin/perfil' : '/cliente/perfil'} className={linkClass}>
          <span>👤</span>
          <span>Perfil</span>
        </NavLink>
        <NavLink to={user?.rol === 'ADMIN' ? '/admin/cambiar-password' : '/cliente/cambiar-password'} className={linkClass}>
          <span>🔒</span>
          <span>Cambiar contraseña</span>
        </NavLink>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Modal de confirmación de logout */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Cerrar sesión">
        <p className="text-gray-600 mb-6">¿Estás seguro que querés cerrar sesión?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </Modal>

      {/* Usuario actual */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">Sesión activa</p>
        <p className="text-sm font-medium text-gray-700 truncate">{user?.username}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
