import React from 'react';

const ButtonCurrentMonthComponent = ({ onClick }) => (
    <button
        onClick={onClick}
        className="bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-500">
        Mes actual
    </button>
);

export default ButtonCurrentMonthComponent;
