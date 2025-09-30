import React, { useState, useEffect } from 'react';
import { getFixedCosts } from '../services/fixedCost';
import { getIncomes } from '../services/income';
import { getSavings } from '../services/saving';
import { getTicker } from '../services/ticker';

const DropComponent = ({ plhdr, onChange, type, value, cripto, onSearchResult }) => {
    const [options, setOptions] = useState([]);
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                switch (type) {
                    case 'income':
                        data = await getIncomes();
                        break;
                    case 'fixedCost':
                        data = await getFixedCosts();
                        break;
                    case 'savingFlex':
                        data = await getSavings();
                        break;
                    case 'savingVar':
                        data = await getSavings();
                        break;
                    default:
                        throw new Error("Opción no válida");
                }

                let names = [
                    ...new Set(
                        data.flatMap(item => {
                            switch (type) {
                                case 'income':
                                    return item.income?.map(incomeItem => incomeItem.name) || [];
                                case 'fixedCost':
                                    return item.fixedCost?.map(fixedCostItem => fixedCostItem.name) || [];
                                case 'savingFlex':
                                    return item.saving
                                        ?.filter(savingItem => savingItem.type === 'flex')
                                        .map(savingItem => savingItem.name) || [];
                                case 'savingVar':
                                    return item.saving
                                        ?.filter(savingItem => savingItem.type === 'var')
                                        .map(savingItem => savingItem.name) || [];
                                default:
                                    return [];
                            }
                        })
                    )
                ];

                names = names.filter(name => name !== "Tarjeta");
                setOptions(names);
            } catch (error) {
                // Error fetching data
            }
        };

        fetchData();
    }, [type]);

    const toggleSearch = async () => {
        if (type !== 'savingVar') return;
        setIsLoading(true);
        try {
            const response = await getTicker(`?tkr=${value}&cripto=${cripto}`);
            if (JSON.stringify(response) !== '{}') {
                setSearchResult(response);
                try {
                    if (typeof onSearchResult === 'function') {
                        onSearchResult(response);
                    }
                } catch (_) {}
            } else {
                setSearchResult(null);
                try { if (typeof onSearchResult === 'function') onSearchResult(null); } catch (_) {}
            }
        } catch (error) {
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center rounded-lg mb-2 relative">
            <div className="flex items-center justify-center">
                <input
                    className={`text-center p-2 ${type === 'savingVar' ? 'rounded-l-lg w-44' : 'rounded-lg w-56'}`}
                    style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', height:'2.5rem' }}
                    type="text"
                    name="drop"
                    list="drop"
                    value={value}
                    autoComplete='off'
                    placeholder={plhdr}
                    maxLength={16}
                    onChange={onChange} />
                <datalist id="drop">
                    {options.map((opt, index) => (
                        <option key={index} value={opt} />
                    ))}
                </datalist>
                {type === 'savingVar' && (
                    <button
                        onClick={toggleSearch}
                        className="p-2 rounded-r-lg"
                        style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderLeft:'none', height:'2.5rem' }}
                    >
                        🔍
                    </button>
                )}
            </div>
            {(searchResult !== null || isLoading) ? (
                <p className={`text-[12px] text-center !mt-1`} style={{ color:'#9CA3AF' }}>{isLoading ? 'Cargando...' : (()=>{
                    const raw = String(searchResult.price ?? '');
                    const normalized = raw.replace(/\s+/g,'').replace(/,/g,'');
                    const priceNum = Number(normalized);
                    const priceStr = Number.isFinite(priceNum) ? priceNum.toLocaleString('es-AR') : '-';
                    const name = searchResult.name ? searchResult.name : '';
                    return `${name} (${searchResult.ticker}) - U$S ${priceStr}`;
                })()}</p>
            ) : null}
        </div>
    );
};

export default DropComponent;
