import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import logoSrc from './resources/logos/logo.png';

/**
 * Componente raíz de la aplicación PrestApp.
 * Envuelve la aplicación con el router y proveedores de contexto.
 * Precarga el logo para evitar pixelado en navegación SPA.
 */
function App() {
  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
