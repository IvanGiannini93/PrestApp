import { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../api/axiosConfig';

/**
 * Página para cambiar la contraseña del usuario.
 */
function CambiarPasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/cambiar-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Contraseña actualizada exitosamente');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {success}
            </div>
          )}

          <Input
            label="Contraseña actual"
            id="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange('currentPassword')}
            required
          />
          <Input
            label="Nueva contraseña"
            id="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange('newPassword')}
            required
          />
          <Input
            label="Confirmar nueva contraseña"
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CambiarPasswordPage;
