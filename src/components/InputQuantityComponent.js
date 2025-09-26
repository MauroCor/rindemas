const InputQuantityComponent = ({ onChange, value, placeholder = "Ej: 15.005" }) => {
    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseNumber = (str) => {
        return str.replace(/\./g, '');
    };

    return (
        <div className="text-center mb-2">
            <input
                className="text-center w-56 p-2 rounded-lg"
                type="text"
                autoComplete="off"
                placeholder={placeholder}
                value={formatNumber(value)}
                onInput={(e) => {
                    const cleanValue = parseNumber(e.target.value).slice(0, 12);
                    e.target.value = formatNumber(cleanValue);
                    const syntheticEvent = { target: { value: cleanValue } };
                    onChange(syntheticEvent);
                }}
                onChange={(e) => {
                    const cleanValue = parseNumber(e.target.value);
                    const syntheticEvent = { target: { value: cleanValue } };
                    onChange(syntheticEvent);
                }}
                style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', height:'2.5rem'}}
            />
        </div>
    );
};

export default InputQuantityComponent;
