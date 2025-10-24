import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/numbers';
import RecordDetailModal from './RecordDetailModal';
import BalanceDetailModal from './BalanceDetailModal';

const FinancialDropComponent = ({ title, data, isIncome, onDelete, onPatch, initialOpen = false, readOnly = false, notes = [], monthDate }) => {
    const dropdownId = `${title}-${monthDate || 'default'}`;
    
    const getStoredState = () => {
        try {
            const stored = localStorage.getItem(`dropdown-${dropdownId}`);
            return stored ? JSON.parse(stored) : initialOpen;
        } catch {
            return initialOpen;
        }
    };
    
    const [showDetails, setShowDetails] = useState(getStoredState);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [recordType, setRecordType] = useState('');
    
    const toggleDropdown = () => {
        const newState = !showDetails;
        setShowDetails(newState);
        try {
            localStorage.setItem(`dropdown-${dropdownId}`, JSON.stringify(newState));
        } catch {
        }
    };

    useEffect(() => {
        const newState = getStoredState();
        setShowDetails(newState);
    }, [title, monthDate]);
    
    const handleRecordClick = (record, type) => {
        if (type === 'saving') {
            setSelectedRecord({ ...record, monthDate });
            setShowModal(true);
        } else {
            const cardFields = type === 'card' 
                ? { price: record.price, pricePerInstallment: record.pricePerInstallment }
                : {};
            setSelectedRecord({ ...record, ...cardFields, monthDate });
            setRecordType(type);
            setShowBalanceModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedRecord(null);
    };

    const handleBalanceModalClose = () => {
        setShowBalanceModal(false);
        setSelectedRecord(null);
        setRecordType('');
    };

    const handleRecordUpdate = (updatedRecord) => {
        // Forzar refresh respetando el modo de proyección actual
        window.dispatchEvent(new CustomEvent('app:data-updated', { detail: { sectionName: 'Ahorros' } }));
    };

    const handleBalanceRecordUpdate = (updatedRecord) => {
        // Forzar refresh para balance
        window.dispatchEvent(new CustomEvent('app:data-updated', { detail: { sectionName: 'Balance' } }));
    };

    const handleRecordConfirm = (confirmedRecord) => {
        // Confirmar desde detalle: solo refrescar datos y cerrar modal, sin abrir confirm dialog
        try {
            window.dispatchEvent(new CustomEvent('app:data-updated', { detail: { sectionName: 'Ahorros' } }));
        } catch (_) {}
        setShowModal(false);
        setSelectedRecord(null);
    };

    const contentType = Array.isArray(data?.cardSpend)
        ? 'card'
        : Array.isArray(data?.saving)
            ? 'saving'
            : 'fixed';

    return (
        <>
            <div className="max-w-md mx-auto my-2 px-2 py-4 rounded-lg shadow-lg" style={{background:'#1F2937', color:'#F3F4F6'}}>
                <div
                    onClick={toggleDropdown}
                    className="flex justify-between items-center cursor-pointer p-2 rounded-2xl"
                    style={{background:'#374151'}} onMouseDown={(e) => e.preventDefault()}>
                    <label className='' style={{ width: '70px', display: 'inline-block', textAlign: 'center' }}>{title}</label>
                    <div className='right-4 text-xs' style={{color:'#9CA3AF'}}>{showDetails ? '▲' : '▼'}</div>
                    <label className={`text-lg ${isIncome ? 'text-teal-400' : 'text-red-500'}`}
                        style={{ width: '70px', display: 'inline-block', textAlign: 'center', color: isIncome ? '#10B981' : '#e67875', textShadow: '0 0 8px rgba(16, 185, 129, 0.3)' }}>{formatPrice(data.total, 'ARS')}</label>
                </div>
                {showDetails && (
                    <div className="mt-4" onMouseDown={(e) => e.preventDefault()}>
                        {contentType === 'fixed' && Array.isArray(data?.items) && data.items.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex justify-between items-center border-b cursor-pointer hover:bg-gray-700" 
                                style={{borderColor:'#374151', color:'#E5E7EB'}}
                                onClick={() => !readOnly && handleRecordClick(item, isIncome ? 'income' : 'expense')}
                            >
                                <span className="w-[40%] text-center text-sm whitespace-normal">{item.name}</span>
                                <span className="w-[35%] text-left text-sm whitespace-normal" style={{color:'#9CA3AF'}}>{item.ccy !== 'ARS' ? formatPrice(item.amount, item.ccy) : ''}</span>
                                <span className="w-[33%] text-left text-sm" style={{color: item.name === 'Ingresos' ? '#10B981' : (item.name === 'Egresos' || (item.name === 'Tarjeta' && readOnly)) ? '#e67875' : '#F3F4F6', textShadow: item.name === 'Ingresos' ? '0 0 6px rgba(16, 185, 129, 0.4)' : (item.name === 'Egresos' || (item.name === 'Tarjeta' && readOnly)) ? '0 0 6px #DC262640' : 'none'}}>{formatPrice(item.price, 'ARS')}</span>
                                {!readOnly && onDelete && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                        className="w-[5%] text-red-400 text-sm hover:text-red-500"
                                    >
                                        &#10005;
                                    </button>
                                )}
                            </div>
                        ))}
                        {contentType === 'card' && Array.isArray(data?.cardSpend) && data.cardSpend.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex -ml-1 justify-between items-center border-b cursor-pointer hover:bg-gray-700" 
                                style={{borderColor:'#374151', color:'#E5E7EB'}}
                                onClick={() => !readOnly && handleRecordClick(item, 'card')}
                            >
                                <span className="w-[44%] text-center text-sm whitespace-normal">{item.name}</span>
                                <span className="w-[30%] text-center text-sm">{formatPrice(item.pricePerInstallment ?? item.price, 'ARS')}</span>
                                <span className="w-[13%] text-right text-xs" style={{color:'#9CA3AF'}}>{item.installment}</span>
                                {!readOnly && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                    className="text-red-400 text-sm ml-2 hover:text-red-500"
                                >
                                    &#10005;
                                </button>
                                )}
                            </div>
                        ))}
                        {contentType === 'saving' && Array.isArray(data?.saving) && (
                            <>
                                <div className="flex justify-between items-center border-b mb-1" style={{borderColor:'#4B5563'}}>
                                    <span className="text-left text-[8px] font-bold uppercase" style={{color:'#9CA3AF'}}>TIPO</span>
                                    <span className="w-[95%] text-center text-[8px] font-bold uppercase" style={{color:'#9CA3AF'}}>NOMBRE</span>
                                    <span className="w-[45%] text-center text-[8px] font-bold uppercase" style={{color:'#9CA3AF'}}>MONTO</span>
                                    <span className="w-[40%] text-right text-[8px] font-bold uppercase" style={{color:'#9CA3AF'}}>%</span>
                                    <span className="w-[35%] text-right text-[8px] font-bold uppercase" style={{color:'#9CA3AF'}}></span>
                                </div>
                                {data.saving.map((item, index) => {
                                    const hasReinvestmentNote = notes.some(note => note.reference === item.name);
                                    const isProjection = item.projection === true;
                                    return (
                            <div 
                                key={index} 
                                className={`flex justify-between items-center border-b cursor-pointer hover:bg-gray-700 ${hasReinvestmentNote ? 'opacity-50 relative' : ''} ${isProjection ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-400' : ''}`} 
                                style={{borderColor:'#374151', color:'#E5E7EB'}}
                                onClick={() => !readOnly && handleRecordClick(item, 'saving')}
                            >
                                {hasReinvestmentNote && (
                                    <div className="absolute top-1/2 left-0 h-px bg-gray-400 z-10" style={{width: 'calc(100% - 10%)'}}></div>
                                )}
                                <span className={`text-left text-[8px] font-extrabold font-sans ${item.type === 'fijo' ? 'text-teal-400' : item.type === 'flex' ? 'text-blue-400' : item.type === 'plan' ? 'text-fuchsia-400' : 'text-yellow-400'} ${hasReinvestmentNote ? 'relative z-20' : ''}`}>
                                    {item.type === 'fijo' ? 'RF' : item.type === 'flex' ? 'RP' : item.type === 'plan' ? 'PA' : 'RV'}
                                </span>
                                <span className={`w-[100%] text-center text-sm whitespace-normal ${hasReinvestmentNote ? 'relative z-20' : ''} ${isProjection ? 'text-purple-200' : ''}`}>
                                    <span className={hasReinvestmentNote ? 'line-through' : ''}>{item.name}</span>
                                </span>
                                <span className={`w-[50%] text-center text-sm ${hasReinvestmentNote ? 'relative z-20' : ''} ${isProjection ? 'text-purple-200' : ''}`} style={{color: item.liquid && !isProjection ? '#10B981' : undefined, textShadow: item.liquid && !isProjection ? '0 0 6px rgba(16, 185, 129, 0.4)' : 'none'}}>
                                    {formatPrice(
                                        item.type === 'var' || item.type === 'plan' || item.liquid ? item.obtained : 
                                        item.type === 'flex' ? item.obtained : 
                                        item.invested, 
                                        item.type === 'var' ? 'USD' : item.ccy
                                    )}
                                </span>
                                <span className={`w-[40%] text-right text-[10px] font-sans ${hasReinvestmentNote ? 'relative z-20' : ''} ${isProjection ? 'text-purple-200' : ''}`}>{`${Math.round(item.tna)}%`}</span>
                                {!readOnly && item.type === 'fijo' && onDelete && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="w-[30%] text-right text-red-400 text-sm hover:text-red-500 h-5 flex items-center justify-end"
                                    > &#10005;
                                    </button>
                                )}
                                {!readOnly && (item.type === 'flex' || item.type === 'var' || item.type === 'plan') && onPatch && (
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onPatch(item.id, item); 
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="w-[30%] text-right text-sm h-5 flex items-center justify-end"
                                    > <span className='text-[8px] leading-none'>&#9209;</span>
                                    </button>
                                )}
                            </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <RecordDetailModal
                isOpen={showModal}
                onClose={handleModalClose}
                record={selectedRecord}
                onUpdate={handleRecordUpdate}
                onConfirm={handleRecordConfirm}
            />
            
            <BalanceDetailModal
                isOpen={showBalanceModal}
                onClose={handleBalanceModalClose}
                record={selectedRecord}
                onUpdate={handleBalanceRecordUpdate}
                recordType={recordType}
            />
        </>
    );
};

export default FinancialDropComponent;
