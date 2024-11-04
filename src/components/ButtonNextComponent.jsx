import React from 'react';

const ButtonNextComponent = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute right-64 text-white text-2xl rounded-full bg-blue-600 w-10 h-10 flex items-center justify-center">
        {">"}
    </button>
);

export default ButtonNextComponent;
