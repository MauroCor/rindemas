import React, { useState } from 'react';
import { formatNumber } from '../utils/numbers';

const FinancialDropComponent = ({ title, data, isIncome, onDelete, onPatch, initialOpen = false }) => {
    const [showDetails, setShowDetails] = useState(initialOpen);
    const toggleDropdown = () => setShowDetails(!showDetails);

    return (
        <div className="max-w-md mx-auto my-2 px-2 py-4 bg-gray-800 rounded-lg shadow-lg">
            <div
                onClick={toggleDropdown}
                className="flex justify-between items-center cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded-2xl" onMouseDown={(e) => e.preventDefault()}>
                <label className='text-white' style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{title}</label>
                <div className='right-4 text-xs text-gray-950'>{showDetails ? '▲' : '▼'}</div>
                <label className={`text-lg ${isIncome ? 'text-green-500' : 'text-red-500'}`}
                    style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{formatNumber(data.total)}</label>
            </div>
            {/* Fijos */}
            {showDetails && !initialOpen && (
                <div className="mt-4" onMouseDown={(e) => e.preventDefault()}>
                    {data.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-600 text-gray-300">
                            <span className="w-[55%] text-left text-sm whitespace-normal">{item.name}</span>
                            <span className="w-[20%] text-center text-sm">{formatNumber(item.price)}</span>
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
            {showDetails && initialOpen && !isIncome && (
                <div className="mt-4" onMouseDown={(e) => e.preventDefault()}>
                    {data.cardSpend.map((item, index) => (
                        <div key={index} className="flex -ml-1 justify-between items-center border-b border-gray-600 text-gray-300">
                            <span className="w-[44%] text-left text-sm whitespace-normal">{item.name}</span>
                            <span className="w-[30%] text-center text-sm">{formatNumber(item.price)}</span>
                            <span className="w-[13%] text-right text-gray-400 text-xs">{item.installment}</span>
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
            {/* Ahorros */}
            {showDetails && initialOpen && isIncome && (
                <div className="mt-4" onMouseDown={(e) => e.preventDefault()}>
                    {data.saving.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-600 text-gray-300">
                            <span className={`text-left text-[8px] font-extrabold font-sans ${item.type === 'fijo' ? 'text-green-500' : item.type === 'flex' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                {item.type === 'fijo' ? 'RF' : item.type === 'flex' ? 'RP' : 'RV'}
                            </span>

                            <span className={`w-[100%] text-center text-sm whitespace-normal ${item.liquid ? 'font-bold' : ''}`}>
                                {item.name}
                                {item.type === 'var' && <sup className="text-[10px] ml-1">{item.qty}</sup>}
                            </span>

                            <span className={`w-[50%] text-center text-sm ${item.liquid ? 'font-bold text-yellow-100' : ''}`}>
                                {formatNumber(item.type === 'var' || item.liquid ? item.obtained : item.invested)}
                            </span>

                            <span className="w-[40%] text-right text-[10px] font-extrabold font-sans">{`${Math.round(item.tna)}%`}</span>

                            {item.type === 'fijo' && (
                                <>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="w-[30%] text-right text-red-500 text-lg hover:text-red-700"
                                    > &#10005;
                                    </button>
                                </>
                            )}
                            {(item.type === 'flex' || item.type === 'var') && (
                                <>
                                    <button
                                        onClick={() => onPatch(item.id, item)}
                                        className="w-[30%] text-right pb-1"
                                    > <span className='text-[12px]'>&#9209; </span>
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FinancialDropComponent;
