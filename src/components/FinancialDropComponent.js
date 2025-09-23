import React, { useState } from 'react';
import { formatPrice } from '../utils/numbers';

const FinancialDropComponent = ({ title, data, isIncome, onDelete, onPatch, initialOpen = false }) => {
    const [showDetails, setShowDetails] = useState(initialOpen);
    const toggleDropdown = () => setShowDetails(!showDetails);
    const contentType = Array.isArray(data?.cardSpend)
        ? 'card'
        : Array.isArray(data?.saving)
            ? 'saving'
            : 'fixed';

    return (
        <div className="max-w-md mx-auto my-2 px-2 py-4 rounded-lg shadow-lg" style={{background:'#1F2937', color:'#F3F4F6'}}>
            <div
                onClick={toggleDropdown}
                className="flex justify-between items-center cursor-pointer p-2 rounded-2xl"
                style={{background:'#374151'}} onMouseDown={(e) => e.preventDefault()}>
                <label className='' style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{title}</label>
                <div className='right-4 text-xs' style={{color:'#9CA3AF'}}>{showDetails ? '▲' : '▼'}</div>
                <label className={`text-lg ${isIncome ? 'text-teal-400' : 'text-red-400'}`}
                    style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{formatPrice(data.total, 'ARS')}</label>
            </div>
            {showDetails && (
                <div className="mt-4" onMouseDown={(e) => e.preventDefault()}>
                    {contentType === 'fixed' && Array.isArray(data?.items) && data.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b" style={{borderColor:'#374151', color:'#E5E7EB'}}>
                            <span className="w-[40%] text-center text-sm whitespace-normal">{item.name}</span>
                            <span className="w-[35%] text-left text-sm whitespace-normal" style={{color:'#9CA3AF'}}>{item.ccy != 'ARS' ? formatPrice(item.amount, item.ccy) : ''}</span>
                            <span className="w-[33%] text-left text-sm">{formatPrice(item.price, 'ARS')}</span>
                            {item.name !== 'Tarjeta' && (
                                <button
                                    onClick={() => onDelete(item)}
                                    className="w-[5%] text-red-400 text-lg hover:text-red-500"
                                >
                                    &#10005;
                                </button>
                            )}
                            {item.name == 'Tarjeta' && (
                                <button
                                    className="w-[5%] text-gray-600 text-lg cursor-default"
                                >
                                    &#10005;
                                </button>
                            )}
                        </div>
                    ))}
                    {contentType === 'card' && Array.isArray(data?.cardSpend) && data.cardSpend.map((item, index) => (
                        <div key={index} className="flex -ml-1 justify-between items-center border-b" style={{borderColor:'#374151', color:'#E5E7EB'}}>
                            <span className="w-[44%] text-left text-sm whitespace-normal">{item.name}</span>
                            <span className="w-[30%] text-center text-sm">{formatPrice(item.price, 'ARS')}</span>
                            <span className="w-[13%] text-right text-xs" style={{color:'#9CA3AF'}}>{item.installment}</span>
                            <button
                                onClick={() => onDelete(item)}
                                className="text-red-400 text-lg ml-2 hover:text-red-500"
                            >
                                &#10005;
                            </button>
                        </div>
                    ))}
                    {contentType === 'saving' && Array.isArray(data?.saving) && data.saving.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b" style={{borderColor:'#374151', color:'#E5E7EB'}}>
                            <span className={`text-left text-[8px] font-extrabold font-sans ${item.type === 'fijo' ? 'text-teal-400' : item.type === 'flex' ? 'text-blue-400' : 'text-yellow-400'}`}>
                                {item.type === 'fijo' ? 'RF' : item.type === 'flex' ? 'RP' : 'RV'}
                            </span>
                            <span className={`w-[100%] text-center text-sm whitespace-normal ${item.liquid ? 'font-bold' : ''}`}>
                                {item.name}
                                {item.type === 'var' && <sup className="text-[10px] ml-1">{parseFloat(item.qty)}</sup>}
                            </span>
                            <span className={`w-[50%] text-center text-sm ${item.liquid ? 'font-bold' : ''}`} style={{color: item.liquid ? '#14B8A6' : undefined}}>
                                {formatPrice(item.type === 'var' || item.liquid ? item.obtained : item.invested, item.type === 'var' ? 'USD' : item.ccy)}
                            </span>
                            <span className="w-[40%] text-right text-[10px] font-extrabold font-sans">{`${Math.round(item.tna)}%`}</span>
                            {item.type === 'fijo' && (
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="w-[30%] text-right text-red-400 text-lg hover:text-red-500"
                                > &#10005;
                                </button>
                            )}
                            {(item.type === 'flex' || item.type === 'var') && (
                                <button
                                    onClick={() => onPatch(item.id, item)}
                                    className="w-[30%] text-right pb-1"
                                > <span className='text-[12px]'>&#9209; </span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FinancialDropComponent;
