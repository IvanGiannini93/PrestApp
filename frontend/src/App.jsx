import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

/**
 * Componente raíz de la aplicación PrestApp.
 * Envuelve la aplicación con el router y proveedores de contexto.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
