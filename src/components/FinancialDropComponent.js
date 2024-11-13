import React, { useState } from 'react';
import { formatNumber } from '../utils/numbers';

const FinancialDropComponent = ({ title, data, isIncome, onDelete, initialOpen = false }) => {
    const [showDetails, setShowDetails] = useState(initialOpen);
    const toggleDropdown = () => setShowDetails(!showDetails);

    return (
        <div className="max-w-md mx-auto my-4 p-4 bg-gray-800 rounded-lg shadow-lg">
            <div
                onClick={toggleDropdown}
                className="flex justify-between items-center cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded-2xl">
                <label className='text-white' style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{title}</label>
                <div className='right-4 text-xs text-gray-950'>{showDetails ? '▲' : '▼'}</div>
                <div>
                    <label className={`text-xl ${isIncome ? 'text-green-500' : 'text-red-500'}`}
                        style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{formatNumber(data.total)}</label>
                </div>
            </div>
            {/* Fijos */}
            {showDetails && !initialOpen && (
                <div className="mt-4">
                    {data.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b border-gray-600 text-gray-300">
                            <span>{item.name}</span>
                            <span>{formatNumber(item.price)}</span>
                            {item.name !== 'Tarjeta' && (
                                <button
                                    onClick={() => onDelete(item)}
                                    className="text-red-500 text-lg ml-2 hover:text-red-700"
                                >
                                    &#10005;
                                </button>
                            )}
                            {item.name == 'Tarjeta' && (
                                <button
                                    className="text-gray-700 text-lg ml-2 cursor-default"
                                >
                                    &#10005;
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {/* Tarjetas */}
            {showDetails && initialOpen && (
                <div className="mt-4">
                    {data.cardSpend.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-600 text-gray-300">
                            <span className="w-[40%] text-left text-sm whitespace-normal">{item.name}</span>
                            <span className="w-[20%] text-center text-sm">{formatNumber(item.price)}</span>
                            <span className="w-[5%] text-right text-gray-400 text-sm">{item.installment}</span>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-red-500 text-lg ml-2 hover:text-red-700"
                            >
                                &#10005;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FinancialDropComponent;
