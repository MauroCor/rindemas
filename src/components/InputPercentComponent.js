const InputPercentComponent = ({ onChange, value, placeholder="Ej: 30.5%" }) => {

    return (
        <div className="text-center mb-2">
            <input className='text-center bg-gray-700 w-60 p-2 rounded-lg text-white'
                type="decimal"
                name="drop1234"
                autoComplete='off'
                placeholder={placeholder}
                value={value}
                onInput={(e) => {
                    const value = e.target.value.slice(0, 4);
                    e.target.value = value.replace(/[^0-9,]/g, '').replace(/(,.*)(,)/, '$1');
                    onChange(e); 
                }}
                onChange={onChange} />
        </div>
    );
};

export default InputPercentComponent;