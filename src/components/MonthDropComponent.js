import React, { useEffect, useState } from 'react';
import { adjustMonths } from '../utils/numbers';

const MonthDropComponent = ({ value, onChange, type }) => {
    const [initialValueSet, setInitialValueSet] = useState(false);

    useEffect(() => {
        if (type === "Desde" && !initialValueSet) {
            const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            onChange(formattedDate);
            setInitialValueSet(true);
        } else if (type === "DesdeTarj" && !initialValueSet) {
            const formattedDate = adjustMonths(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`, 1);
            onChange(formattedDate);
            setInitialValueSet(true);
        }
    }, [type, initialValueSet, onChange]);

    useEffect(() => {
        setInitialValueSet(false);
    }, [type]);

    return (
        <div className="text-center mb-2 relative">
            <input
                type="month"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                lang="es"
                className="text-center bg-gray-700 w-60 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-white"
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{colorScheme: 'dark'}}
            />
            {type === "Hasta" && value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-500 font-bold text-xl"
                >
                    x
                </button>
            )}
            {type === "Hasta" && !value && (
                <div className='text-center'>
                    <span className="text-xs text-center text-gray-300">
                        Por defecto se creará por 1 año.
                    </span>
                </div>
            )}
        </div>
    );
};

export default MonthDropComponent;
