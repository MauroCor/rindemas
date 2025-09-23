const DropdownSavingComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Tipo</label>
      <select
        value={value}
        onChange={onChange}
        className="mx-10 p-2 rounded-lg text-center"
        style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
      >
        <option value="fijo">Renta fija</option>
        <option value="flex">Renta pasiva</option>
        <option value="var">Renta variable</option>
      </select>
    </div>
  );
};

export default DropdownSavingComponent;
