
const  SwitchComponent = ({ value, onToggle, optionA = "A", optionB = "B", className = "" }) => {
  return (
    <div
      className={`relative w-16 h-6 flex items-center rounded-full px-1 cursor-pointer ${value ? "justify-end" : "justify-start"} ${className}`}
      onClick={() => onToggle(value ? false : true)}
      style={{ background:'#2D3748', border:'1px solid #1F2937' }}
    >
      <div className="w-6 h-6 rounded-full transition-transform" style={{ background:'#16A085' }} />
      <span
        className={`absolute text-xs transform -translate-x-1/2 top-[55%] -translate-y-1/2 ${value ? "left-[75%]" : "left-[25%]"}`}
        style={{ color:'#F3F4F6' }}
      >
        {value ? optionB : optionA}
      </span>
    </div>
  );
};

export default SwitchComponent;
