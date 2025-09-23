const DropdownComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Cuotas</label>
      <select
        value={value}
        onChange={onChange}
        className="mx-10 p-2 rounded-lg text-center"
        style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
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
