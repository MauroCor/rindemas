const InputComponent = ({ name, value, onChange, placeholder, className }) => {
    return (
        <div className="flex flex-col">
            <label className="text-xs text-left mb-1 ml-10 text-white">{name}</label>
            <div className="text-center mb-2">
                <input
                    type="text"
                    autocomplete='off'
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={20} 
                    className={`text-center bg-gray-700 w-60 rounded-lg text-white p-2 ${className}`}
                />
            </div>
        </div>
    );
};

export default InputComponent;
