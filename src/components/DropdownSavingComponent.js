const DropdownSavingComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-left mb-1 ml-11 text-white">Tipo</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-700 mx-10 p-2 rounded-lg text-center text-white"
      >
        <option value="fijo">Renta fija</option>
        <option value="flex">Renta pasiva</option>
        <option disabled className="text-gray-400" value="var">Renta variable</option>
      </select>
    </div>
  );
};

export default DropdownSavingComponent;
