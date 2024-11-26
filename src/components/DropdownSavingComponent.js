const DropdownSavingComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-left mb-1 ml-11 text-white">Plazo</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-700 mx-10 p-2 rounded-lg text-white"
        style={{
          paddingLeft: "90px",
        }}
      >
        <option value="fijo">Fijo</option>
        <option value="flex">Flex</option>
      </select>
    </div>
  );
};

export default DropdownSavingComponent;
