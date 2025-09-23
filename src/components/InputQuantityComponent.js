const InputQuantityComponent = ({ onChange, value, placeholder = "Ej: 15.005" }) => (
    <div className="text-center mb-2">
        <input
            className="text-center w-60 p-2 rounded-lg"
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            onInput={(e) => {
                e.target.value = e.target.value
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*?)\..*/g, '$1')
                    .slice(0, 12);
                onChange(e);
            }}
            style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
        />
    </div>
);

export default InputQuantityComponent;
