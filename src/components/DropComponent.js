import React, { useState, useEffect } from 'react';
import { getFixedCosts } from '../services/fixedCost';
import { getIncomes } from '../services/income';
import { getSavings } from '../services/saving';
import { getTicker } from '../services/ticker';

const DropComponent = ({ plhdr, onChange, type, value, cripto }) => {
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
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type]);

    const toggleSearch = async () => {
        if (type !== 'savingVar') return;
        setIsLoading(true);
        try {
            const tkr = cripto === 'SÍ' ? `CRY-${value}` : value
            const response = await getTicker(`?tkr=${tkr}`);
            if (JSON.stringify(response) !== '{}') {
                setSearchResult(response);
            } else {
                setSearchResult(null);
            }
        } catch (error) {
            console.error("Error fetching prices:", error);
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center rounded-lg mb-2">
            <div>
                <input
                    className='text-center bg-gray-700 w-60 p-2 rounded-lg text-white'
                    type="text"
                    name="drop"
                    list="drop"
                    value={value}
                    autoComplete='off'
                    placeholder={plhdr}
                    maxLength={20}
                    onChange={onChange} />
                <datalist id="drop">
                    {options.map((opt, index) => (
                        <option key={index} value={opt} />
                    ))}
                </datalist>
                <button
                    onClick={toggleSearch}
                    className={`absolute p-2 ml-2 rounded-xl hover:bg-gray-600 bg-gray-700 text-white ${type !== 'savingVar' ? 'hidden' : ''
                        }`}
                >
                    🔍
                </button>
            </div>
            {searchResult != null ? (
                <p className={`text-white text-[12px] text-center !mt-1`}>{isLoading ? 'Cargando...' : `${searchResult.name ? searchResult.name : ''} (${searchResult.ticker}) - U$S ${parseInt(searchResult.price)}`}</p>
            ) : (
                <p className={`text-blue-400 text-[12px] text-center !mt-1`} >También puedes <span className='font-bold'>actualizar</span> uno existente.</p>

            )}
        </div>
    );
};

export default DropComponent;
