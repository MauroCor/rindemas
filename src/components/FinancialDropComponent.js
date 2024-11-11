import React, { useState } from 'react';
import { formatNumber } from '../utils/numbers';

const FinancialDropComponent = ({ title, data, isIncome, initialOpen = false }) => {
    const [showDetails, setShowDetails] = useState(initialOpen);
    const toggleDropdown = () => setShowDetails(!showDetails);

    return (
        <div className="max-w-md mx-auto my-4 p-4 bg-gray-800 rounded-lg shadow-lg">
            <div
                onClick={toggleDropdown}
                className="flex justify-between items-center cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded-2xl">
                <label style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{title}</label>
                <div className='right-4 text-xs text-gray-950'>{showDetails ? '▲' : '▼'}</div>
                <div>
                    <label className={`text-xl ${isIncome ? 'text-green-500' : 'text-red-500'}`}
                    style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{formatNumber(data.total)}</label>
                </div>
            </div>
            {showDetails && (
                <div className="mt-4">
                    {data.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b border-gray-600">
                            <span className="text-gray-300">{item.name}</span>
                            <span className="text-gray-300">{formatNumber(item.price)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FinancialDropComponent;
