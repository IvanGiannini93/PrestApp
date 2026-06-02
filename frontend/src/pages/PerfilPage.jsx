import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { formatDate } from '../utils/formatters';

/**
 * Página de perfil del usuario.
 * Muestra información completa de la cuenta.
 */
function PerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/perfil')
      .then(res => setPerfil(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando perfil...</p>;
  if (!perfil) return <p className="text-gray-500">No se pudo cargar el perfil</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{perfil.razonSocial || perfil.username}</p>
              {perfil.responsable && (
                <p className="text-sm text-gray-500">{perfil.responsable}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Usuario</span>
              <span className="text-sm font-medium text-gray-800">{perfil.username}</span>
            </div>

            {perfil.documento && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Documento</span>
                <span className="text-sm font-medium text-gray-800">{perfil.documento}</span>
              </div>
            )}

            {perfil.email && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-800">{perfil.email}</span>
              </div>
            )}

            {perfil.telefono && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Teléfono</span>
                <span className="text-sm font-medium text-gray-800">{perfil.telefono}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Miembro desde</span>
              <span className="text-sm font-medium text-gray-800">{formatDate(perfil.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;
