const InputQuantityComponent = ({ onChange, value, placeholder = "Ej: 15.005" }) => (
    <div className="text-center mb-2">
        <input
            className="text-center bg-gray-700 w-60 p-2 rounded-lg text-white"
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            onInput={(e) => {
                e.target.value = e.target.value
                    .replace(/[^0-9.]/g, '') // Permitir solo números y un punto
                    .replace(/(\..*?)\..*/g, '$1') // Evitar múltiples puntos
                    .slice(0, 12); // Limitar a 9 caracteres
                onChange(e);
            }}
        />
    </div>
);

export default InputQuantityComponent;
