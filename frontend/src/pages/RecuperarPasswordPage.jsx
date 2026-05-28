import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../api/axiosConfig';
import logoBanner from '../resources/logos/logo.png';

/**
 * Página de recuperación de contraseña.
 * Paso 1: solicitar código. Paso 2: ingresar código y nueva contraseña.
 */
function RecuperarPasswordPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/recuperar-password', { username });
      setSuccess('Si el usuario existe, recibirás un código por email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleResetear = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess('Contraseña restablecida exitosamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img src={logoBanner} alt="PrestApp" className="w-32 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-gray-800">Recuperar Contraseña</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <p className="text-sm text-gray-500">Ingresá tu usuario y te enviaremos un código de recuperación por email.</p>
            <Input
              label="Usuario"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario o email"
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar Código'}
            </Button>
            <button type="button" onClick={() => navigate('/login')}
              className="w-full text-sm text-primary-600 hover:underline">
              Volver al login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetear} className="space-y-4">
            <p className="text-sm text-gray-500">Ingresá el código de 6 dígitos que recibiste y tu nueva contraseña.</p>
            <Input
              label="Código de recuperación"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456"
              required
            />
            <Input
              label="Nueva contraseña"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirmar contraseña"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>
            <button type="button" onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:underline">
              Volver a solicitar código
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecuperarPasswordPage;
