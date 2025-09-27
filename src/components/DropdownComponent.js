const DropdownComponent = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Cuotas</label>
      <select
        value={value}
        onChange={onChange}
        className="p-2 rounded-lg text-center w-56 mx-auto"
        style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', height:'2.5rem' }}
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
