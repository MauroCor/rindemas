const MonthDropComponent = ({ value, onChange }) => {
    return (
        <div className="text-center mb-2">
            <select
                value={value}
                onChange={onChange}
                className="bg-gray-700 w-60 text-center h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
            </select>
        </div>
    );
};

export default MonthDropComponent;
