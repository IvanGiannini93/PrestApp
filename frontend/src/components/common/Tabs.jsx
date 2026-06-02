/**
 * Componente de tabs/solapas con estilo pill y contadores opcionales.
 * @param {Object} props
 * @param {Array<{key: string, label: string}>} props.tabs - Definición de tabs
 * @param {string} props.activeTab - Key de la tab activa
 * @param {Function} props.onChange - Callback al cambiar de tab
 * @param {Object} props.counters - Mapa de key -> cantidad (opcional)
 */
function Tabs({ tabs, activeTab, onChange, counters }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
      {tabs.map((tab) => {
        const count = counters ? counters[tab.key] : null;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {count !== null && count !== undefined && (
              <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-primary-500' : 'text-gray-400'}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
