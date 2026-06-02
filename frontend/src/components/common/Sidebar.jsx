import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Modal from './Modal';
import Button from './Button';
import logo from '../../resources/logos/logo.png';

/**
 * Sidebar de navegación lateral.
 * Estilo moderno con highlight tipo borde izquierdo.
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
    `flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all border-l-[3px] ${
      isActive
        ? 'border-l-primary-600 bg-primary-50/60 text-primary-700'
        : 'border-l-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
    }`;

  const accountLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-[3px] ${
      isActive
        ? 'border-l-primary-600 bg-primary-50/60 text-primary-700 font-medium'
        : 'border-l-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 flex flex-col items-center cursor-pointer" onClick={() => navigate(homeRoute)}>
        <div className="h-16 mb-2 flex items-center justify-center">
          <img
            src={logo}
            alt="PrestApp"
            className={`h-16 w-auto transition-opacity duration-200 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
          {user?.rol === 'ADMIN' ? 'Panel Administrador' : 'Portal Cliente'}
        </p>
      </div>

      {/* Separador sutil */}
      <div className="mx-5 border-t border-gray-100"></div>

      {/* Navegación principal */}
      <nav className="flex-1 py-4 space-y-0.5">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            <span className="text-base">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Separador */}
      <div className="mx-5 border-t border-gray-100"></div>

      {/* Opciones de cuenta */}
      <div className="py-3">
        <NavLink to={user?.rol === 'ADMIN' ? '/admin/perfil' : '/cliente/perfil'} className={accountLinkClass}>
          <span>👤</span>
          <span>Perfil</span>
        </NavLink>
        <NavLink to={user?.rol === 'ADMIN' ? '/admin/cambiar-password' : '/cliente/cambiar-password'} className={accountLinkClass}>
          <span>🔒</span>
          <span>Cambiar contraseña</span>
        </NavLink>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50/50 w-full text-left transition-all border-l-[3px] border-l-transparent"
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
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Sesión activa</p>
        <p className="text-sm font-medium text-gray-700 truncate mt-0.5">{user?.username}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
