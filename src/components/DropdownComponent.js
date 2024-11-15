const DropdownComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col text-center">
      <label className="text-xs text-left mb-1 ml-11 text-white">Cuotas</label>
      <div className="relative mx-10">
        <select
          value={value}
          onChange={onChange}
          className="bg-gray-700 py-2 w-full rounded-lg text-white text-lg appearance-none text-center text-indent-[50%]"
          >
          <option value="1">1 cuota</option>
          {[3, 6, 9, 12, 18].map((cuota) => (
            <option key={cuota} value={cuota}>
              {cuota} cuotas
            </option>
          ))}
        </select>
      </div>
    </div>
  )
};  

export default DropdownComponent;
