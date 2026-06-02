import Sidebar from './Sidebar';

/**
 * Layout principal con sidebar y contenido.
 * Sidebar fijo a la izquierda, contenido scrolleable a la derecha.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página
 */
function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
