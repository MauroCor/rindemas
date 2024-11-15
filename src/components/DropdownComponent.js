const DropdownComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col text-center">
      <label className="text-xs text-left mb-1 ml-11 text-white">Cuotas</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-700 mx-10 py-2 rounded-lg text-white text-center"
      >
        <option value="1" className="text-center">1 cuota</option>
        {[3, 6, 9, 12, 18].map((cuota) => (
          <option key={cuota} value={cuota} className="text-center">
            {cuota} cuotas
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownComponent;
