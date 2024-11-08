import React, { useEffect } from 'react';

const MonthDropComponent = ({ value, onChange, type }) => {
    useEffect(() => {
        if (type === "Desde" && !value && typeof onChange === "function") {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            onChange(formattedDate);
        }
    }, [type, value, onChange]);

    return (
        <div className="text-center mb-2">
            <input
                type="month"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                lang="es"
                className="bg-gray-700 w-60 pl-3 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white rounded-lg"
            />
        </div>
    );
};

export default MonthDropComponent;
