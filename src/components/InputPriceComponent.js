const InputPriceComponent = ({ onChange }) => {

    return (
        <div className="text-center mb-2">
            <input className='bg-gray-700 w-60 p-2 rounded-lg text-white'
                type="number"
                name="drop"
                placeholder="Ej: $350.000"
                onInput={(e) => {
                    const value = e.target.value.slice(0, 9);
                    e.target.value = value.replace(/\D/g, '');
                    onChange(e); 
                }}
                onChange={onChange} />
        </div>
    );
};

export default InputPriceComponent;