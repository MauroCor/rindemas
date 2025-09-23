const InputComponent = ({ name, value, onChange, placeholder, className }) => {
    return (
        <div className="flex flex-col">
            <label className="text-sm text-left mb-1 ml-10" style={{color:'#FFFFFF'}}>{name}</label>
            <div className="text-center mb-2">
                <input
                    type="text"
                    autoComplete='off'
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={20} 
                    className={`text-center w-60 rounded-lg p-2 ${className}`}
                    style={{background:'#2D3748', color:'#F3F4F6', outline:'none', border:'1px solid #1F2937'}}
                />
            </div>
        </div>
    );
};

export default InputComponent;
