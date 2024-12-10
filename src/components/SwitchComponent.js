import React from 'react';

const  SwitchComponent = ({ value, onToggle, optionA = "A", optionB = "B", className = "" }) => {
  return (
    <div
      className={`relative w-16 h-6 flex items-center bg-gray-600 rounded-full px-1 cursor-pointer ${value === optionB ? "justify-end" : "justify-start"} ${className}`}
      onClick={() => onToggle(value === optionA ? optionB : optionA)}
    >
      <div className="w-6 h-6 bg-blue-600 rounded-full transition-transform" />
      <span
        className={`absolute text-xs text-white transform -translate-x-1/2 top-[48%] -translate-y-1/2 ${value === optionB ? "left-[77%]" : "left-[25%]"}`}
      >
        {value === optionA ? optionA : optionB}
      </span>
    </div>
  );
};

export default SwitchComponent;
