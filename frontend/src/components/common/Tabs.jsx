/**
 * Componente de tabs/solapas con estilo pill.
 * @param {Object} props
 * @param {Array<{key: string, label: string}>} props.tabs - Definición de tabs
 * @param {string} props.activeTab - Key de la tab activa
 * @param {Function} props.onChange - Callback al cambiar de tab
 */
function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
