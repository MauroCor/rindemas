import React from 'react';

const ButtonNextComponent = ({ onClick }) => (
    <button
        onClick={onClick}
        className="text-xl rounded-full bg-blue-600 w-9 h-9 hover:bg-blue-500">
        {">"}
    </button>
);

export default ButtonNextComponent;
