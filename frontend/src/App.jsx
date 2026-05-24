import { BrowserRouter } from 'react-router-dom';

/**
 * Componente raíz de la aplicación PrestApp.
 * Envuelve la aplicación con el router y proveedores de contexto.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-primary-600 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">PrestApp</h1>
        </header>
        <main className="container mx-auto p-4">
          <p className="text-gray-600">Aplicación en construcción...</p>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
