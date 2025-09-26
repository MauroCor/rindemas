const InputPriceComponent = ({ onChange, value, currency, onCurrencyChange, appendButton = false, onAppendClick, appendContent = '📟' }) => {
    return (
        <div className="text-center mb-2">
            <div className="flex items-center justify-center rounded-lg">
                <div className="relative w-9 md:w-9">
                    <select
                        className="px-1 pr-3 rounded-l-lg focus:outline-none text-[10px] text-center w-full appearance-none"
                        value={currency}
                        onChange={onCurrencyChange}
                        style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderRight:'none', height:'2.5rem', WebkitAppearance:'none', MozAppearance:'none', appearance:'none', backgroundImage:'none'}}
                    >
                        <option value="ARS">$</option>
                        <option value="USD">USD</option>
                    </select>
                    <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]">▾</span>
                </div>
                
                <input
                    className={`${appendButton ? 'p-2 text-center rounded-none' : 'w-[11.7rem] p-2 text-center rounded-r-lg'}`}
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
                    style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderLeft:'1px solid #1F2937', height:'2.5rem', width: appendButton ? '9.9rem' : undefined}}
                />
                {appendButton && (
                    <button
                        type="button"
                        onClick={onAppendClick}
                        className="p-2 rounded-r-lg flex items-center justify-center"
                        style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderLeft:'none', height:'2.5rem', width:'1.7rem' }}
                        aria-label="Abrir calculadora de renta fija"
                        title="Abrir calculadora de renta fija"
                    >
                        {appendContent}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputPriceComponent;
