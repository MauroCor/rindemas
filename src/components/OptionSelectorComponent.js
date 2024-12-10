import React from 'react';

const Option = ({ value, label, selected, onChange }) => (
  <label className="relative w-24 h-8 rounded-full cursor-pointer mx-2 flex items-center justify-center">
    <input
      type="radio"
      name="btn"
      value={value}
      checked={selected === value}
      onChange={() => onChange(value)}
      className="absolute inset-0 opacity-0 cursor-pointer"
    />
    <div
      className={`w-full h-full rounded-full transition-all flex items-center justify-center ${
        selected === value ? 'bg-blue-600' : 'bg-gray-700'
      }`}
    >
      <span className={`text-sm font-medium transition-all ${selected === value ? 'text-gray-200' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  </label>
);

const OptionSelectorComponent = ({ selectedOption, setSelectedOption }) => (
  <div className="wrapper flex items-center w-[320px] h-9 bg-gray-900 border-2 border-black rounded-full shadow-[4px_4px_0px_0px] shadow-black mx-auto mb-4">
    <Option value="Ingreso" label="Ingreso" selected={selectedOption} onChange={setSelectedOption} />
    <Option value="Egreso" label="Egreso" selected={selectedOption} onChange={setSelectedOption} />
    <Option value="Tarjeta" label="Tarjeta" selected={selectedOption} onChange={setSelectedOption} />
    <Option value="Ahorro" label="Ahorro" selected={selectedOption} onChange={setSelectedOption} />
  </div>
);

export default OptionSelectorComponent;
