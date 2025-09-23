const InputPriceComponent = ({ onChange, value, currency, onCurrencyChange }) => {
    return (
        <div className="text-center mb-2">
            <div className="flex items-center justify-center rounded-lg">
                <select
                    className="p-2 rounded-l-lg focus:outline-none"
                    value={currency}
                    onChange={onCurrencyChange}
                    style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderRight:'none', height:'2.5rem'}}
                >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                </select>
                
                <input
                    className="w-[10.4rem] p-2 text-center rounded-r-lg"
                    type="number"
                    name="drop1234"
                    autoComplete="off"
                    placeholder={`${currency === 'ARS' ? 'Ej: $350.000' : 'Ej: u$s 350'}`}
                    value={value}
                    onInput={(e) => {
                        const value = e.target.value.slice(0, 9);
                        e.target.value = value.replace(/\D/g, '');
                        onChange(e); 
                    }}
                    onChange={onChange}
                    style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderLeft:'1px solid #1F2937', height:'2.5rem'}}
                />
            </div>
        </div>
    );
};

export default InputPriceComponent;
