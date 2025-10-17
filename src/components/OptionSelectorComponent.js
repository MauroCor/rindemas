
const Tab = ({ value, label, selected, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(value)}
    className={`px-3 py-1 rounded-full text-sm transition-colors ${
      selected === value
        ? 'text-white border'
        : 'bg-[#111827] text-gray-300 border border-[#1F2937] hover:bg-[#0f2030]'
    }`}
    style={selected === value ? { background: '#16A085', borderColor: '#16A085' } : {}}
  >
    {label}
  </button>
);

const OptionSelectorComponent = ({ selectedOption, setSelectedOption }) => (
  <div className="flex items-center justify-center gap-2 p-1 rounded-full mx-auto mb-4"
       style={{ background:'#0B1220', border:'1px solid #1F2937' }}>
    <Tab value="Ingreso" label="Ingreso" selected={selectedOption} onChange={setSelectedOption} />
    <Tab value="Egreso" label="Egreso" selected={selectedOption} onChange={setSelectedOption} />
    <Tab value="Tarjeta" label="Tarjeta" selected={selectedOption} onChange={setSelectedOption} />
    <Tab value="Ahorro" label="Ahorro" selected={selectedOption} onChange={setSelectedOption} />
  </div>
);

export default OptionSelectorComponent;
