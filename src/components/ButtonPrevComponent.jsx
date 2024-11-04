import React from 'react';

const ButtonPrevComponent = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute left-64 text-white text-2xl rounded-full bg-blue-600 w-10 h-10 flex items-center justify-center">
        {"<"}
    </button>
);

export default ButtonPrevComponent;
