const InputNumberComponent = ({ onChange, value, placeholder="Ej: $350.000" }) => {
    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseNumber = (str) => {
        return str.replace(/\./g, '');
    };

    return (
        <div className="text-center mb-2">
            <input className='text-center w-56 p-2 rounded-lg'
                type="text"
                name="drop1234"
                autoComplete='off'
                placeholder={placeholder}
                value={formatNumber(value)}
                onInput={(e) => {
                    const cleanValue = parseNumber(e.target.value).slice(0, 9);
                    e.target.value = formatNumber(cleanValue);
                    const syntheticEvent = { target: { value: cleanValue } };
                    onChange(syntheticEvent); 
                }}
                onChange={(e) => {
                    const cleanValue = parseNumber(e.target.value);
                    const syntheticEvent = { target: { value: cleanValue } };
                    onChange(syntheticEvent);
                }}
                style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', height:'2.5rem'}} />
        </div>
    );
};

export default InputNumberComponent;