import Sidebar from './Sidebar';

/**
 * Layout principal con sidebar y contenido.
 * Se usa para todas las páginas autenticadas.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página
 */
function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
