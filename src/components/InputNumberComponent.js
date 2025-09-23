const InputNumberComponent = ({ onChange, value, placeholder="Ej: $350.000" }) => {

    return (
        <div className="text-center mb-2">
            <input className='text-center w-60 p-2 rounded-lg'
                type="number"
                name="drop1234"
                autoComplete='off'
                placeholder={placeholder}
                value={value}
                onInput={(e) => {
                    const value = e.target.value.slice(0, 9);
                    e.target.value = value.replace(/\D/g, '');
                    onChange(e); 
                }}
                onChange={onChange}
                style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}} />
        </div>
    );
};

export default InputNumberComponent;