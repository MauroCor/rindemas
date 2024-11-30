const InputPriceComponent = ({ onChange, value, currency, onCurrencyChange }) => {
    return (
        <div className="text-center mb-2">
            <div className="flex items-center justify-center rounded-lg">
                <select
                    className="bg-gray-600 text-white p-[0.62rem] rounded-l-lg border-r border-gray-500 focus:outline-none"
                    value={currency}
                    onChange={onCurrencyChange}
                >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                </select>
                
                <input
                    className="bg-gray-700 w-[10.4rem] p-2 text-center text-white rounded-r-lg"
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
                />
            </div>
        </div>
    );
};

export default InputPriceComponent;
