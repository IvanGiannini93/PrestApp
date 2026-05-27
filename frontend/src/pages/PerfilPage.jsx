import { useAuth } from '../hooks/useAuth';

/**
 * Página de perfil del usuario.
 * Muestra información de la cuenta.
 */
function PerfilPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Usuario</p>
            <p className="font-medium text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p className="font-medium text-gray-800">
              {user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;
