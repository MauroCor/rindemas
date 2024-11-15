const DropdownComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-left mb-1 ml-11 text-white">Cuotas</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-700 mx-10 py-2 text-center rounded-lg text-white"
      >
        <option value="1">1 cuota</option>
        {[3, 6, 9, 12, 18].map((cuota) => (
          <option key={cuota} value={cuota}>
            {cuota} cuotas
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownComponent;
